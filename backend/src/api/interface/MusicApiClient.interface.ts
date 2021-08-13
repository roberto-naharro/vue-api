import { Observable } from "rxjs";

/**
 * Does common music API operations
 */
export interface MusicApiClient<ArtistAPI, AlbumAPI> {
  baseUrl: string;
  getFirstArtistByName: (artistName: string) => Observable<ArtistAPI>;
  getAlbumsByArtistId: (artistId: number) => Observable<AlbumAPI>;
}