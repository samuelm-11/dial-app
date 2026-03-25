import { z } from 'zod';

const nullableDate = z.string().nullable().optional();

export const machineStatusValues = ['active', 'inactive', 'maintenance'] as const;

export const createClientMachineSchema = z.object({
  machineTypeId: z.string().uuid('Type machine invalide.'),
  quantity: z.number().int().min(1, 'La quantité doit être au moins 1.'),
  installationDate: nullableDate,
  status: z.enum(machineStatusValues).optional(),
  lastFilterChangeDate: nullableDate,
  notes: z.string().max(3000).nullable().optional()
});

export const updateClientMachineSchema = createClientMachineSchema.partial();

export const machineCategorySchema = z.object({
  code: z.string().min(2).max(80),
  label: z.string().min(2).max(120),
  isActive: z.boolean().optional()
});

export const machineTypeSchema = z.object({
  machineCategoryId: z.string().uuid('Catégorie machine invalide.'),
  code: z.string().min(2).max(80),
  label: z.string().min(2).max(120),
  requiresFilterChange: z.boolean().default(false),
  filterLifespanDays: z.number().int().min(1).max(3650).nullable().optional(),
  isActive: z.boolean().optional()
});

export type CreateClientMachineValues = z.infer<typeof createClientMachineSchema>;
export type UpdateClientMachineValues = z.infer<typeof updateClientMachineSchema>;
export type MachineCategoryValues = z.infer<typeof machineCategorySchema>;
export type MachineTypeValues = z.infer<typeof machineTypeSchema>;
