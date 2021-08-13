exports.inviteUser = function (req, res) {
  // you should use `const` instead of `var`
  var invitationBody = req.body;
  // you should use `const` instead of `var`
  var shopId = req.params.shopId;
  // you should use `const` instead of `var`
  var authUrl = "https://url.to.auth.system.com/invitation";

  //calback hell!!! nested lambda functions make the code difficult to read
  superagent
    .post(authUrl)
    .send(invitationBody)
    .end(function (err, invitationResponse) {
      if (invitationResponse.status === 201) {
        User.findOneAndUpdate(
          {
            authId: invitationResponse.body.authId,
          },
          {
            authId: invitationResponse.body.authId, // this field is not necessary, upsert option combines the filter and the new data
            email: invitationBody.email,
          },
          {
            upsert: true,
            new: true,
          },
          function (err, createdUser) {
            // this mongoDB request is done after retrieve the user, could be done in parallel to save time
            Shop.findById(shopId).exec(function (err, shop) {
              if (err || !shop) {
                // the user is saved after the failed shop update attempt. There are changes in the DB even if the petition is incorrect
                return res
                  .status(500)
                  .send(err || { message: "No shop found" });
              }
              //this condition is duplicating the invitationId inside the shop invitations array
              if (
                shop.invitations.indexOf(invitationResponse.body.invitationId)
              ) {
                shop.invitations.push(invitationResponse.body.invitationId);
              }
              // this condition is searching for a user id in a user array, and it won't be found never
              if (shop.users.indexOf(createdUser._id) === -1) {
                shop.users.push(createdUser);
              }
              // could call save function even if there is no changes
              // save is not resolved
              shop.save();
            });
          }
        );
      } else if (invitationResponse.status === 200) {
        res.status(400).json({
          error: true,
          message: "User already invited to this shop",
        });
        return;
      }
      // the express response is sent more than once
      res.json(invitationResponse);
    });
};
