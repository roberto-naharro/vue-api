const { bindNodeCallback, from, EMPTY } = rxjs;
const { switchMap, catchError } = rxjs.operators;

function sendInvitation(authUrl, invitationBody) {
  return bindNodeCallback((cb) =>
    superagent.post(authUrl).send(invitationBody).end(cb)
  )();
}

function saveValidatedUserEmail({ authId, email }) {
  return from(
    User.findOneAndUpdate(
      {
        authId,
      },
      {
        email,
      },
      {
        upsert: true,
        new: true,
      }
    )
  );
}

/**
 * @param {Array} arr destiny
 * @param {any} el Element to insert
 * @param {(a, el) => boolean} compareFn Function to check if 2 elements are equal
 * @returns true if the element has been inserted, false otherwise
 */
function pushUnique(arr, el, compareFn = (a, el) => a === b) {
  if (arr.some((a) => compareFn(a, el))) {
    arr.push(el);
    return true;
  }
  return false;
}

exports.inviteUser = function (req, res) {
  const invitationBody = req.body;
  const shopId = req.params.shopId;
  const authUrl = "https://url.to.auth.system.com/invitation";

  // get first the shop to check if it exists before updating anything
  from(Shop.findById(shopId).exec())
    .pipe(
      // error getting the shop
      catchError((err) => {
        console.error(err);
        res.status(500).send(err);

        //end the execution and there is no more values emitted
        return EMPTY;
      }),
      //continue flow with the shop information
      switchMap((shop) => {
        if (!shop) {
          res.status(500).send({ message: "No shop found" });
          return EMPTY;
        }
        return sendInvitation(authUrl, invitationBody).pipe(
          //check response
          switchMap((invitationResponse) => {
            if (invitationResponse.status === 201) {
              return saveValidatedUserEmail(invitationResponse.body);
            } else if (invitationResponse.status === 200) {
              res.status(400).json({
                error: true,
                message: "User already invited to this shop",
              });
              return EMPTY;
            }
          }),
          //update shop
          switchMap((createdUser) => {
            const shopNeedsUpdate = false;
            const invitationId = invitationResponse.body.invitationId;

            shopNeedsUpdate =
              pushUnique(shop.invitations, invitationId) ||
              pushUnique(
                shop.users,
                createdUser._id,
                (user, id) => user._id === id
              );

            if (shopNeedsUpdate) {
              return from(shop.save());
            } else {
              return EMPTY;
            }
          })
        );
      })
    )
    .subscribe({
      // general error
      error: (err) => {
        console.error(err);
        res.status(500).send("Internal server error");
      },
    });
};
