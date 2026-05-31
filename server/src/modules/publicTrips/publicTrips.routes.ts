import { Router } from 'express';
import {
  getPublicTripController,
  getPublicTripsController,
} from './publicTrips.controller';

export const publicTripsRouter = Router();

publicTripsRouter.get('/', getPublicTripsController);
publicTripsRouter.get('/:slug', getPublicTripController);
