import { Artist as ITunesArtist } from './interfaces/artist.interface';
import { Album as ITunesAlbum } from './interfaces/album.interface';
import { ApiMapper } from '../interface/ApiMapper.interface';
import { Album } from '../../album/Album.interface';
import { Artist } from '../../artist/Artist.interface';

export const iTunesMapper: ApiMapper<ITunesArtist, ITunesAlbum> = {
  mapAlbum: (album: ITunesAlbum): Album => ({
    id: album.collectionId,
    artistName: album.artistName,
    thumbnailUrl: album.artworkUrl100,
    title: album.collectionName,
  }),
  mapArtist: (artist: ITunesArtist): Artist => ({
    id: artist.artistId,
    name: artist.artistName,
  }),
};
