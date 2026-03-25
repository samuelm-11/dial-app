import { z } from 'zod';

export const contactRoleValues = ['manager', 'billing', 'technical', 'other'] as const;

export const createContactSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis.'),
  lastName: z.string().min(2, 'Nom requis.'),
  email: z.string().email('Email invalide.').nullable().optional(),
  phone: z.string().min(6, 'Téléphone invalide.').nullable().optional(),
  role: z.enum(contactRoleValues),
  isPrimary: z.boolean().optional()
});

export const updateContactSchema = createContactSchema.partial();

export type CreateContactValues = z.infer<typeof createContactSchema>;
export type UpdateContactValues = z.infer<typeof updateContactSchema>;
