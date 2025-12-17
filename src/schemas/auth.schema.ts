import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter'),
  remember_me: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
