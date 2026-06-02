import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { tripsRouter } from './modules/trips/trips.routes';
import { publicTripsRouter } from './modules/publicTrips/publicTrips.routes';
import { photosRouter } from './modules/photos/photos.routes';
import { uploadsRouter } from './modules/uploads/uploads.routes';
import { authMiddleware } from './middleware/auth.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { travelMapRouter } from './modules/travelMap/travelMap.routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/public-trips', publicTripsRouter);


app.use('/trips', authMiddleware, tripsRouter);

app.use('/travel-map', authMiddleware, travelMapRouter);
  
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'my-photo-library-api',
    });
  });


  
  app.use('/api/uploads', authMiddleware, uploadsRouter);
  app.use('/', authMiddleware, photosRouter);
  app.use(errorMiddleware);
