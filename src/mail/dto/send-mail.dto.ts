import { z } from 'zod';

export const sendMailBodySchema = z
  .object({
    taskId: z.string().min(1, 'Task ID must be string'),
    userId: z.string().min(1, 'User ID must be string'),
  })
  .required();

export type SendMailBody = z.infer<typeof sendMailBodySchema>;
