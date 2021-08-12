import { Config } from './interfaces/Config.interface';

const defaultPort = 3000;
const PORT: number = process.env.PORT ? Number(process.env.PORT) : defaultPort;

export const config: Config = {
  musicApiUrl: `http://localhost:${PORT}`,
  musicAPIRequestDelay: 1000,
};
