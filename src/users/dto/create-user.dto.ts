import { UserRole } from 'src/schemas/users.schema';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(1, 'Name must be string'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(
      UserRole,
      `Role must be one of the following: ${Object.values(UserRole).join(', ')}`,
    ),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
