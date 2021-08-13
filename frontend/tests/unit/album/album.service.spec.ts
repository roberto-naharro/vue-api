import axios from 'axios';
import faker from 'faker';

import { getAlbumService } from '@/components/album/album.service';
import { Config } from '@/interfaces/Config.interface';

describe('AlbumService test suite', () => {
  let mockConfig: Config;
  let albumService: ReturnType<typeof getAlbumService>;

  beforeEach(() => {
    (axios.get as jest.Mock).mockClear();
    mockConfig = {
      musicAPIRequestDelay: 0,
      musicApiUrl: faker.internet.url(),
    };
    albumService = getAlbumService(mockConfig);
  });

  describe('getAlbumsFromArtist method', () => {
    it('should return the results of the request as an observable', (done) => {
      const mockResult = [1, 2, 3];
      (axios.get as jest.Mock).mockResolvedValue({
        data: { results: mockResult },
      });
      const artistName = faker.commerce.productName();
      const receivedValues: typeof mockResult = [];

      albumService.getAlbumsFromArtist(artistName).subscribe({
        next: (v: any) => {
          receivedValues.push(v);
        },
        complete: () => {
          expect(receivedValues).toHaveLength(mockResult.length);
          expect(axios.get as jest.Mock).toBeCalledWith(
            `${mockConfig.musicApiUrl}/album?${new URLSearchParams({
              artist: artistName,
            }).toString()}`,
          );
          done();
        },
        error: (err) => {
          done.fail(err);
        },
      });
    });

    it('should return and error if there is an error in the request', (done) => {
      const error = new Error(faker.lorem.sentence());
      (axios.get as jest.Mock).mockRejectedValue(error);
      const artistName = faker.commerce.productName();

      albumService.getAlbumsFromArtist(artistName).subscribe({
        complete: () => {
          done.fail('Should not complete');
        },
        error: (err) => {
          expect(axios.get as jest.Mock).toBeCalledWith(
            `${mockConfig.musicApiUrl}/album?${new URLSearchParams({
              artist: artistName,
            }).toString()}`,
          );
          expect(err).toEqual(error);
          done();
        },
      });
    });
  });
});
