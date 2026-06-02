import { Router } from 'express';

import { getTravelMapCitiesController } from './travelMap.controller';

export const travelMapRouter = Router();

travelMapRouter.get('/cities', getTravelMapCitiesController);
