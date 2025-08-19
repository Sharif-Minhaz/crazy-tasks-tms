import { z } from 'zod';
import { TaskStatus } from '../../schemas/tasks.schema';
import mongoose from 'mongoose';

export const createTaskSchema = z
  .object({
    title: z.string().min(1, 'Title must be string'),
    description: z.string().min(1, 'Description must be string'),
    status: z.enum(
      TaskStatus,
      `Status must be one of the following: ${Object.values(TaskStatus).join(', ')}`,
    ),
    assignee: z.array(
      z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid MongoDB ObjectID for assignee',
      }),
    ),
    project: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid MongoDB ObjectID for project',
    }),
  })
  .required();

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
