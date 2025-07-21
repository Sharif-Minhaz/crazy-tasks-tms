import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .required();

export type LoginDto = z.infer<typeof loginSchema>;
