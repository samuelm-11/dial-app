import { z } from 'zod';

export const clientCategorySchema = z.object({
  code: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(120),
  isActive: z.boolean().default(true)
});

export const flagSchema = z.object({
  code: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(120),
  colorHex: z.string().trim().regex(/^#([0-9A-Fa-f]{6})$/, 'Couleur hexadécimale invalide (ex: #0ea5e9).'),
  isActive: z.boolean().default(true)
});

export const machineCategorySchema = z.object({
  code: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(120),
  isActive: z.boolean().default(true)
});

export const machineTypeSchema = z.object({
  machineCategoryId: z.string().uuid('Catégorie machine invalide.'),
  code: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(120),
  requiresFilterChange: z.boolean().default(false),
  filterLifespanDays: z.number().int().min(1).max(3650).nullable().optional(),
  isActive: z.boolean().default(true)
});

export const notificationRuleSchema = z.object({
  code: z.enum(['contract_end_6m', 'contract_end_3m', 'contract_end_1m', 'filter_change_due', 'filter_change_30d']),
  label: z.string().trim().min(2).max(120),
  daysBeforeDue: z.number().int().min(0).max(3650),
  notificationType: z.enum(['contract_end', 'filter_change']),
  isActive: z.boolean().default(true)
});

export type ClientCategoryValues = z.infer<typeof clientCategorySchema>;
export type FlagValues = z.infer<typeof flagSchema>;
export type MachineCategoryValues = z.infer<typeof machineCategorySchema>;
export type MachineTypeValues = z.infer<typeof machineTypeSchema>;
export type NotificationRuleValues = z.infer<typeof notificationRuleSchema>;
