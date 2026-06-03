import {
  getTrip,
  getTrips,
  createTripController,
  updateTripController,
  deleteTripController,
  getTripCitiesController,
  createTripCityController,
  deleteTripCityController,
  updateTripCityController,
} from './trips.controller';
import { Router } from 'express';

export const tripsRouter = Router();

tripsRouter.get('/', getTrips);
tripsRouter.post('/', createTripController);

tripsRouter.get('/:tripId/cities', getTripCitiesController);
tripsRouter.post('/:tripId/cities', createTripCityController);
tripsRouter.delete('/cities/:cityId', deleteTripCityController);
tripsRouter.patch('/cities/:cityId', updateTripCityController);

tripsRouter.get('/:id', getTrip);
tripsRouter.patch('/:id', updateTripController);
tripsRouter.delete('/:id', deleteTripController);
