export interface Config {
  /** URL of the API server to retrieve the music data */
  musicApiUrl: string;
  /** Delay between consecutive request to the music API */
  musicAPIRequestDelay: number;
}
