import { z } from 'zod';

export const inTransactionSchema = z.object({
  product_id: z.string().uuid('Produk harus dipilih'),
  quantity: z.number()
    .int('Jumlah harus angka bulat')
    .min(1, 'Jumlah minimal 1 unit')
    .max(999999, 'Jumlah terlalu besar'),
  reference: z.string().max(100, 'Referensi maksimal 100 karakter').optional().or(z.literal('')),
  notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional().or(z.literal('')),
  transaction_date: z.coerce.date().refine((date) => date instanceof Date && !isNaN(date.getTime()), {
    message: 'Tanggal wajib diisi',
  }),
});

export const outTransactionSchema = z.object({
  product_id: z.string().uuid('Produk harus dipilih'),
  quantity: z.number()
    .int('Jumlah harus angka bulat')
    .min(1, 'Jumlah minimal 1 unit')
    .max(999999, 'Jumlah terlalu besar'),
  reference: z.string().max(100, 'Referensi maksimal 100 karakter').optional().or(z.literal('')),
  notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional().or(z.literal('')),
  transaction_date: z.coerce.date().refine((date) => date instanceof Date && !isNaN(date.getTime()), {
    message: 'Tanggal wajib diisi',
  }),
});

export const adjustmentSchema = z.object({
  product_id: z.string().uuid('Produk harus dipilih'),
  quantity: z.number()
    .int('Jumlah harus angka bulat')
    .refine(val => val !== 0, 'Jumlah tidak boleh 0'),
  reason: z.enum([
    'stock_opname',
    'kerusakan',
    'kadaluarsa',
    'selisih_fisik',
    'koreksi_sistem',
    'lainnya',
  ], { errorMap: () => ({ message: 'Alasan wajib dipilih' }) }),
  notes: z.string()
    .min(10, 'Catatan minimal 10 karakter')
    .max(500, 'Catatan maksimal 500 karakter'),
  reference: z.string().max(100, 'Referensi maksimal 100 karakter').optional().or(z.literal('')),
  transaction_date: z.coerce.date().refine((date) => date instanceof Date && !isNaN(date.getTime()), {
    message: 'Tanggal wajib diisi',
  }),
});

export type InTransactionInput = z.infer<typeof inTransactionSchema>;
export type OutTransactionInput = z.infer<typeof outTransactionSchema>;
export type AdjustmentInput = z.infer<typeof adjustmentSchema>;
