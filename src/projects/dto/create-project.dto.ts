import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name must be string'),
  description: z.string().min(1, 'Description must be string'),
  icon: z.any().optional(),
  iconKey: z.string().optional().nullable(),
  banner: z.any().optional(),
  bannerKey: z.string().optional().nullable(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
