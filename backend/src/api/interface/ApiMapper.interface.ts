import { Album } from '../../album/Album.interface';
import { Artist } from '../../artist/Artist.interface';

/**
 * Transforms the Api received objects to the internal objects
 */
export interface ApiMapper<ArtistAPI, AlbumAPI> {
  mapArtist: (artist: ArtistAPI) => Artist;
  mapAlbum: (album: AlbumAPI) => Album;
}
