import got from 'got';
import { from, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Response } from './interfaces/response.interface';
import { Artist as ITunesArtist } from './interfaces/artist.interface';
import { Album as ITunesAlbum } from './interfaces/album.interface';
import { MusicApiClient } from '../interface/MusicApiClient.interface';

const baseUrl = 'https://itunes.apple.com';

export const iTunesApi: MusicApiClient<ITunesArtist, ITunesAlbum> = {
  baseUrl,
  getFirstArtistByName: function (
    artistName: string,
  ): Observable<ITunesArtist> {
    return from(
      got('search', {
        prefixUrl: this.baseUrl,
        searchParams: { term: artistName, entity: 'musicArtist' },
      }).json<Response>(),
    ).pipe(
      switchMap((res: Response) => from(res.results as ITunesArtist[])),
      take(1),
    );
  },
  getAlbumsByArtistId: function (artistId: number): Observable<ITunesAlbum> {
    return from(
      got('lookup', {
        prefixUrl: this.baseUrl,
        searchParams: { id: artistId, entity: 'album' },
      }).json<Response>(),
    ).pipe(
      switchMap((res: Response) =>
        from(
          res.results.reduce((acc, item: ITunesAlbum) => {
            // save only albums
            if (item.collectionType === 'Album') {
              // save only unique value names
              if (
                acc.find(
                  (album) => album.collectionName === item.collectionName,
                ) === undefined
              ) {
                acc.push(item as ITunesAlbum);
              }
            }
            return acc;
          }, [] as ITunesAlbum[]),
        ),
      ),
    );
  },
};
