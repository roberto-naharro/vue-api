import { from, of } from 'rxjs';
import faker from 'faker';

import { buildMockApiMapper } from '../../../api/interface/__mocks__/ApiMapper.mock';
import { buildMockMusicApiClient } from '../../../api/interface/__mocks__/MusicApiClient.mock';

import { getAlbumController } from '../../../album/album.controller';
import { buildMockArtist } from '../../../artist/__mocks__/artist.mock';
import { buildMockAlbum } from '../../../album/__mocks__/album.mock';

describe('Album controller test suite', () => {
  let albumController: ReturnType<typeof getAlbumController>;
  const mockApiClient = buildMockMusicApiClient();
  const mockApiMapper = buildMockApiMapper();

  beforeEach(() => {
    albumController = getAlbumController(mockApiClient, mockApiMapper);
  });

  describe('getAlbumsByArtistName method', () => {
    it('should return albums from an artist', (done) => {
      const mockArtist = buildMockArtist();
      const mockAlbums = Array.from({
        length: faker.datatype.number({ min: 1, max: 10 }),
      }).map(() => buildMockAlbum({ artistName: mockArtist.name }));
      const results = [];

      (mockApiMapper.mapAlbum as jest.Mock).mockImplementation((a: any) => a);
      (mockApiMapper.mapArtist as jest.Mock).mockImplementation((a: any) => a);

      (mockApiClient.getFirstArtistByName as jest.Mock).mockReturnValue(
        of(mockArtist),
      );
      (mockApiClient.getAlbumsByArtistId as jest.Mock).mockReturnValue(
        from(mockAlbums),
      );

      albumController
        .getAlbumsByArtistName(faker.company.companyName())
        .subscribe({
          next: (a) => {
            results.push(a);
          },
          complete: () => {
            expect(mockApiMapper.mapArtist).toHaveBeenCalled();
            expect(mockApiMapper.mapAlbum).toHaveBeenCalled();
            expect(mockApiClient.getFirstArtistByName).toHaveBeenCalled();
            expect(mockApiClient.getAlbumsByArtistId).toHaveBeenCalled();
            expect(results).toHaveLength(mockAlbums.length);
            done();
          },
          error: (err) => {
            throw err;
          },
        });
    });
  });
});
