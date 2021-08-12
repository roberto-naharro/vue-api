import { Observable } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { ApiMapper } from '../api/interface/ApiMapper.interface';
import { MusicApiClient } from '../api/interface/MusicApiClient.interface';
import { Artist } from '../artist/Artist.interface';
import { Album } from './Album.interface';

export const getAlbumController = <ArtistAPI, AlbumAPI>(
  apiClient: MusicApiClient<ArtistAPI, AlbumAPI>,
  mapper: ApiMapper<ArtistAPI, AlbumAPI>,
) => ({
  getAlbumsByArtistName: (artistName: string): Observable<Album> =>
    apiClient.getArtistIdByName(artistName).pipe(
      map(mapper.mapArtist),
      switchMap((artist: Artist) =>
        apiClient.getAlbumsByArtistId(artist.id).pipe(
          map(mapper.mapAlbum),
          filter((album: Album) => album.artistName === artist.name),
        ),
      ),
    ),
});