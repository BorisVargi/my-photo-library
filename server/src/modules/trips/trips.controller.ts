import type { NextFunction, Request, Response } from 'express';
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripOwnerVisibility,
  makeTripPhotosPublic,
  getTripCities,
  createTripCity,
  deleteTripCity,
} from './trips.service';

import {
  createTripSchema,
  updateTripSchema,
  createTripCitySchema,
} from './trips.schemas';

export const getTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const trips = await getAllTrips(userId);
    return res.json({ trips });
  } catch (error) {
    return next(error);
  }
};

export const getTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid trip id' });
    }

    const userId = req.user.userId;
    const trip = await getTripById(id, userId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.json({ trip });
  } catch (error) {
    return next(error);
  }
};


export const createTripController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = createTripSchema.parse(req.body);

    const {
      title,
      slug,
      date,
      description,
      publicDescription,
      country,
      routeSummary,
      startDate,
      endDate,
      visibility,
      status,
    } = parsedBody;

    const userId = req.user.userId;
    const trip = await createTrip(userId, {
      title,
      slug,
      date,
      description,
      publicDescription,
      country,
      routeSummary,
      startDate,
      endDate,
      visibility,
      status,
    });

    return res.status(201).json({ trip });
  } catch (error) {
    return next(error);
  }
};

export const updateTripController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid trip id' });
    }

    const userId = req.user.userId;
    const parsedBody = updateTripSchema.parse(req.body);
    const currentTrip = await getTripOwnerVisibility(id, userId);
    if (!currentTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    const shouldMakePhotosPublic =
      parsedBody.visibility === 'public' && currentTrip.visibility !== 'public';
    
    const trip = await updateTrip(id, userId, parsedBody);
    
    if (shouldMakePhotosPublic) {
      await makeTripPhotosPublic(id);
    }

    return res.json({ trip });
  } catch (error) {
      return next(error);
  }
};

export const deleteTripController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid trip id' });
    }

    const userId = req.user.userId;
    await deleteTrip(id, userId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const getTripCitiesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId } = req.params;

    if (!tripId || Array.isArray(tripId)) {
      return res.status(400).json({ message: 'Invalid trip id' });
    }

    const userId = req.user.userId;
    const cities = await getTripCities(tripId, userId);

    return res.json({ cities });
  } catch (error) {
    return next(error);
  }
};

export const createTripCityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tripId } = req.params;

    if (!tripId || Array.isArray(tripId)) {
      return res.status(400).json({ message: 'Invalid trip id' });
    }

    const userId = req.user.userId;
    const parsedBody = createTripCitySchema.parse(req.body);

    const city = await createTripCity(tripId, userId, parsedBody);

    return res.status(201).json({ city });
  } catch (error) {
    return next(error);
  }
};

export const deleteTripCityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cityId } = req.params;

    if (!cityId || Array.isArray(cityId)) {
      return res.status(400).json({ message: 'Invalid city id' });
    }

    const userId = req.user.userId;

    await deleteTripCity(cityId, userId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
