import type { Request, Response, NextFunction } from 'express';
import { createPhoto, getPhotosByTripId, updatePhoto, deletePhoto, setPhotoAsCover } from './photos.service';
import {
  createPhotoSchema,
  updatePhotoSchema,
} from './photos.schemas';

export const getPhotosController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;

    if (!tripId || Array.isArray(tripId)) {
      return res.status(400).json({ message: 'Invalid trip id' });
    }

    const userId = req.user.userId;
    const photos = await getPhotosByTripId(tripId, userId);

    return res.json({ photos });
  } catch (error) {
   return next(error);
  }
};

export const createPhotoController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;

    if (!tripId || Array.isArray(tripId)) {
      return res.status(400).json({ message: 'Invalid trip id' });
    }

    const parsedBody = createPhotoSchema.parse(req.body);
    const photoData = {
      ...parsedBody,
      takenAt: parsedBody.takenAt ? new Date(parsedBody.takenAt) : undefined,
    };

    const {
      url,
      thumbnailUrl,
      title,
      caption,
      visibility,
      isCover,
      takenAt,
      originalFileName,
      fileSize,
    } = parsedBody;

    const userId = req.user.userId;
    const photo = await createPhoto(tripId, userId, {
      url,
      thumbnailUrl,
      title,
      caption,
      visibility,
      isCover,
      takenAt,
      originalFileName,
      fileSize,
    });

    if (!photo) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(201).json({ photo });
  } catch (error) {
    return next(error);
  }
};

export const updatePhotoController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid photo id' });
    }

    // const photo = await updatePhoto(id, userId, req.body);
    const userId = req.user.userId;

    const parsedBody = updatePhotoSchema.parse(req.body);
    const photoData = {
      ...parsedBody,
      takenAt: parsedBody.takenAt ? new Date(parsedBody.takenAt) : undefined,
    };
    const result = await updatePhoto(id, userId, parsedBody);
    if (result.count === 0) {
      return res.status(404).json({ message: 'Photo not found' });
    }
      return res.json({ message: 'Photo updated' });
    // return res.json({ photo });
  } catch (error) {
    return next(error);
  }
};

export const deletePhotoController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid photo id' });
    }

    const userId = req.user.userId;

    const result = await deletePhoto(id, userId);

    if (result.count === 0) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};


export const setPhotoAsCoverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid photo id' });
    }

    const userId = req.user.userId;
    const photo = await setPhotoAsCover(id, userId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    return res.json({ photo });
  } catch (error) {
    return next(error);
  }
};
