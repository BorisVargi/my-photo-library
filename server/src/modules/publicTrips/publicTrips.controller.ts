import type { Request, Response } from 'express';
import { getPublicTripBySlug, getPublicTrips } from './publicTrips.service';

export const getPublicTripsController = async (_req: Request, res: Response) => {
  try {
    const trips = await getPublicTrips();

    return res.json({ trips });
  } catch (error) {
    console.error('Failed to load public trips', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPublicTripController = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      return res.status(400).json({ message: 'Invalid trip slug' });
    }

    const trip = await getPublicTripBySlug(slug);

    if (!trip) {
      return res.status(404).json({ message: 'Public trip not found' });
    }

    return res.json({ trip });
  } catch (error) {
    console.error('Failed to load public trip', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
