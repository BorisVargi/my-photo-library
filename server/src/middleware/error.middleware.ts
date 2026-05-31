import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client';

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: 'Resource already exists',
      });
    }
  
    if (error.code === 'P2025') {
      return res.status(404).json({
        message: 'Resource not found',
      });
    }
  }
  console.error(error);

  return res.status(500).json({
    message: 'Internal server error',
  });
}
