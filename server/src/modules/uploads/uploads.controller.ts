import type { Request, Response, NextFunction } from 'express';
import { createCloudinaryUploadSignature } from './uploads.service';

export const cloudinarySignatureController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const signatureData = createCloudinaryUploadSignature();

    return res.json(signatureData);
  } catch (error) {
    if (error instanceof Error && error.message === 'Cloudinary is not configured') {
      return res.status(503).json({ message: error.message });
    }

    return next(error);
  }
};
