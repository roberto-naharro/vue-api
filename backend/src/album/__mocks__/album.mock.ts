export const buildMockAlbum = (initial: any = {}) => ({
  id: initial.id || 0,
  artistName: initial.artistName || '',
  title: initial.title || '',
  thumbnailUrl: initial.thumbnailUrl || '',
});
