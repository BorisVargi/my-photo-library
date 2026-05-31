import { Router } from 'express';
import { cloudinarySignatureController } from './uploads.controller';

export const uploadsRouter = Router();

uploadsRouter.post('/cloudinary-signature', cloudinarySignatureController);
