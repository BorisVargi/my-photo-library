import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { tripsRouter } from './modules/trips/trips.routes';
import { publicTripsRouter } from './modules/publicTrips/publicTrips.routes';
import { photosRouter } from './modules/photos/photos.routes';
import { uploadsRouter } from './modules/uploads/uploads.routes';
import { authMiddleware } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/public-trips', publicTripsRouter);
// app.use('/', photosRouter);
  app.use('/auth', authRouter);
  
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'my-photo-library-api',
    });
  });


  app.use('/trips', authMiddleware, tripsRouter);
  app.use('/api/uploads', authMiddleware, uploadsRouter);
  app.use('/', authMiddleware, photosRouter);
  app.use(errorMiddleware);
