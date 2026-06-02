import type { NextFunction, Request, Response } from 'express';

import { getTravelMapCities } from './travelMap.service';

export const getTravelMapCitiesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;

    const cities = await getTravelMapCities(userId);

    return res.json({ cities });
  } catch (error) {
    return next(error);
  }
};
