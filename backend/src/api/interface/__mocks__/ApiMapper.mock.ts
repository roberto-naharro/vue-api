export const buildMockApiMapper = (initial: any = {}): any => ({
  mapArtist: initial.mapArtist || jest.fn(),
  mapAlbum: initial.mapAlbum || jest.fn(),
});
