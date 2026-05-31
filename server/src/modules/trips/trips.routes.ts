import { Router } from 'express';
import { getTrip, getTrips, createTripController, updateTripController, deleteTripController} from './trips.controller';

export const tripsRouter = Router();

tripsRouter.get('/', getTrips);
tripsRouter.post('/', createTripController);
tripsRouter.get('/:id', getTrip);
tripsRouter.patch('/:id', updateTripController);
tripsRouter.delete('/:id', deleteTripController);
