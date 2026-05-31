import { z } from 'zod';
import { STATUS_VALUES, VISIBILITY_VALUES } from '../../shared/constants';

export const createTripSchema = z.object({
  title: z.string().min(1, 'title is required'),
  slug: z.string().min(1, 'slug is required'),
  date: z.string().min(1, 'date is required'),

  description: z.string().optional(),
  publicDescription: z.string().optional(),
  country: z.string().optional(),
  routeSummary: z.string().optional(),

  startDate: z.string().optional(),
  endDate: z.string().optional(),

  visibility: z.enum(VISIBILITY_VALUES).optional(),
  status: z.enum(STATUS_VALUES).optional(),
});

export const updateTripSchema = createTripSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Request body is empty'
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
