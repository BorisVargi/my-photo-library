import { z } from 'zod';

export const createPhotoSchema = z.object({
  url: z.string().min(1, 'url is required'),
  thumbnailUrl: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  visibility: z.enum(['private', 'public']),
  isCover: z.boolean().optional(),
  takenAt: z.string().optional(),
  originalFileName: z.string().optional(),
  fileSize: z.number().int().optional(),
  });


export const updatePhotoSchema = createPhotoSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Request body is empty'
  );

  export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;
