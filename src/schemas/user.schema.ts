import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username hanya boleh huruf, angka, underscore, dan dash'),
  
  email: z.string()
    .email('Email tidak valid'),
  
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  
  confirmPassword: z.string(),
  
  role: z.enum(['admin', 'superadmin'], {
    errorMap: () => ({ message: 'Role harus dipilih' })
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export const editUserSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username hanya boleh huruf, angka, underscore, dan dash'),
  
  email: z.string()
    .email('Email tidak valid'),
  
  role: z.enum(['admin', 'superadmin'], {
    errorMap: () => ({ message: 'Role harus dipilih' })
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type EditUserInput = z.infer<typeof editUserSchema>;
