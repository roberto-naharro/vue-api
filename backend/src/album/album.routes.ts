import express, { Router } from 'express';
import { reduce } from 'rxjs/operators';
import { ApiMapper } from '../api/interface/ApiMapper.interface';
import { MusicApiClient } from '../api/interface/MusicApiClient.interface';
import { getAlbumController } from './album.controller';
import { Album } from './Album.interface';

export function getRoutes<ArtistAPI, AlbumAPI>(
  apiClient: MusicApiClient<ArtistAPI, AlbumAPI>,
  mapper: ApiMapper<ArtistAPI, AlbumAPI>,
): Router {
  const albumRouter = express.Router();
  const albumController = getAlbumController(apiClient, mapper);

  albumRouter.get('', function (req, res) {
    // only support expected query request
    const artistName = req.query.artist;

    //Only allow sinlge query values
    if (!artistName || typeof artistName !== 'string') {
      res.status(404).send('Method not implemented');
      return;
    }

    albumController
      .getAlbumsByArtistName(artistName as string)
      .pipe(
        reduce((acc: Album[], album: Album) => {
          acc.push(album);
          return acc;
        }, []),
      )
      .subscribe({
        next: (albums: Album[]) => {
          res
            .type('json')
            .send(
              JSON.stringify({ resultCount: albums.length, results: albums }),
            );
        },
        error: (err: Error) => {
          console.error(err);
          res.status(500).send('Internal server error');
        },
      });
  });

  console.log('Album routes: ' + JSON.stringify(albumRouter.stack));

  return albumRouter;
}
