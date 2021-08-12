import express from 'express';
import { getRoutes as getAlbumRoutes } from './album/album.routes';
import { ApiMapper } from './api/interface/ApiMapper.interface';
import { MusicApiClient } from './api/interface/MusicApiClient.interface';

export function getRoutes<ArtistAPI, AlbumAPI>(dependencies: {
  apiClient: MusicApiClient<ArtistAPI, AlbumAPI>;
  mapper: ApiMapper<ArtistAPI, AlbumAPI>;
}) {
  const router = express.Router();

  router.use(
    '/album',
    getAlbumRoutes(dependencies.apiClient, dependencies.mapper),
  );

  console.log('All registered routes: ' + JSON.stringify(router.stack));
  return router;
}
