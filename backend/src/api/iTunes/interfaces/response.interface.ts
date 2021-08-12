import { Album } from './album.interface';
import { Artist } from './artist.interface';

export interface Response {
  resultCount: number;
  results: Array<Artist | Album>;
}
