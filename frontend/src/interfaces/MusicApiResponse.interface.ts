import { Album } from '@/components/album/Album.interface';

export interface MusicApiResponse {
  resultCount: number;
  results: Album[];
}
