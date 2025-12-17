import { z } from 'zod';

/**
 * Product validation schemas
 * Untuk create dan edit product form
 */

export const createProductSchema = z.object({
  sku: z.string()
    .min(3, 'SKU minimal 3 karakter')
    .max(50, 'SKU maksimal 50 karakter')
    .regex(/^[A-Z0-9-]+$/, 'SKU hanya boleh huruf besar, angka, dan dash'),
  
  name: z.string()
    .min(3, 'Nama minimal 3 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  
  category: z.string()
    .min(1, 'Kategori wajib dipilih'),
  
  description: z.string()
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .optional()
    .nullable(),
  
  price: z.number()
    .positive('Harga harus lebih dari 0')
    .refine(val => Number.isFinite(val), 'Harga harus angka')
    .refine(val => val.toString().split('.')[1]?.length <= 2 || !val.toString().includes('.'), 'Max 2 desimal'),
  
  min_stock: z.number()
    .int('Minimum stok harus angka bulat')
    .min(0, 'Minimum stok tidak boleh negatif')
    .max(999999, 'Minimum stok maksimal 999999'),
  
  unit: z.string()
    .min(1, 'Unit wajib dipilih'),
});

export const editProductSchema = createProductSchema.omit({ sku: true });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type EditProductInput = z.infer<typeof editProductSchema>;
