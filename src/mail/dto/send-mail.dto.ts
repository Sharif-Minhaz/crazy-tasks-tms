import { z } from 'zod';

export const sendMailSchema = z
  .object({
    email: z.email('Invalid email address'),
    subject: z.string().min(1, 'Subject must be string'),
    html: z.string().min(1, 'HTML must be string'),
  })
  .required();

export type SendMailDto = z.infer<typeof sendMailSchema>;
