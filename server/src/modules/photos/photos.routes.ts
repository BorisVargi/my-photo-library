import { Router } from 'express';
import { createPhotoController,
   getPhotosController, 
   updatePhotoController, 
   deletePhotoController,
  setPhotoAsCoverController
  } from './photos.controller';

export const photosRouter = Router();

photosRouter.get('/trips/:tripId/photos', getPhotosController);
photosRouter.post('/trips/:tripId/photos', createPhotoController);
photosRouter.patch('/photos/:id', updatePhotoController);
photosRouter.delete('/photos/:id', deletePhotoController);
photosRouter.patch('/photos/:id/set-cover', setPhotoAsCoverController)
