import { EMPTY } from 'rxjs';

export const buildMockMusicApiClient = (initial: any = {}): any => ({
  baseUrl: initial.baseUrl || '',
  getFirstArtistByName:
    initial.getFirstArtistByName || jest.fn().mockReturnValue(EMPTY),
  getAlbumsByArtistId:
    initial.getAlbumsByArtistId || jest.fn().mockReturnValue(EMPTY),
});
