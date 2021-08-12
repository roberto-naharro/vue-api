import express, { Express } from 'express';
import morgan from 'morgan';
import dependencies from './dependencies';
import { getRoutes } from './routes';

const defaultPort = 3000;
const app: Express = express();

// Logging
app.use(morgan('dev'));

app.use((req, res, next) => {
  // set the CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'origin, X-Requested-With,Content-Type,Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
    return res.status(200).json({});
  }
  next();
});

// Routes
app.use('/', getRoutes(dependencies));

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  return res.status(404).json({
    message: error.message,
  });
});

const PORT: number = process.env.PORT ? Number(process.env.PORT) : defaultPort;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
