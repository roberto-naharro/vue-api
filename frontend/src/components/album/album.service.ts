import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Config } from '@/interfaces/Config.interface';
import { MusicApiResponse } from '@/interfaces/MusicApiResponse.interface';
import { Album } from './Album.interface';

export const getAlbumService = (
  config: Config,
): {
  getAlbumsFromArtist(artistName: string): Observable<Album>;
} => {
  const albumApiURL = `${config.musicApiUrl}/album`;

  return {
    getAlbumsFromArtist(artistName: string): Observable<Album> {
      return from(
        axios.get(
          `${albumApiURL}?${new URLSearchParams({
            artist: artistName,
          }).toString()}`,
        ),
      ).pipe(
        switchMap((res: AxiosResponse<MusicApiResponse>) => {
          return from(res.data.results);
        }),
      );
    },
  };
};
