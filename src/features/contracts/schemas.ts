import { z } from 'zod';

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (YYYY-MM-DD).');

const contractBaseSchema = z.object({
  clientId: z.string().uuid('Client invalide.'),
  title: z.string().min(2, 'Titre requis.').max(180, 'Titre trop long.'),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  autoRenewal: z.boolean().default(false)
});

export const contractFormSchema = contractBaseSchema.refine((value) => value.endDate >= value.startDate, {
  message: 'La date de fin doit être après la date de début.',
  path: ['endDate']
});

export const contractUpdateSchema = contractBaseSchema.omit({ clientId: true }).partial();

export const contractFilterSchema = z.object({
  endingInDays: z.union([z.literal(30), z.literal(90), z.literal(180)]).optional(),
  hasPdf: z.boolean().optional(),
  autoRenewal: z.boolean().optional(),
  postalCode: z.string().max(20).optional(),
  city: z.string().max(120).optional(),
  categories: z.array(z.enum(['enterprise', 'sme', 'public', 'franchise', 'other'])).optional(),
  flags: z.array(z.enum(['vip', 'risk', 'watch', 'none'])).optional()
});

export const contractUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024),
  mimeType: z.string().refine((type) => type === 'application/pdf', 'Seuls les PDF sont autorisés.')
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;
export type ContractUpdateValues = z.infer<typeof contractUpdateSchema>;
export type ContractFilterValues = z.infer<typeof contractFilterSchema>;
