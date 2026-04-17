import { z } from 'zod';
import { competitorCategoryValues, type OpportunityPriority, type OpportunityStatus } from '@/types/opportunity';

export const opportunityStatusValues = ['open', 'qualified', 'proposal', 'won', 'lost'] as const satisfies readonly OpportunityStatus[];
export const opportunityPriorityValues = ['low', 'medium', 'high'] as const satisfies readonly OpportunityPriority[];

const emptyToUndefined = (value: unknown) => {
  if (value === '' || value === null || value === undefined || (typeof value === 'number' && Number.isNaN(value))) {
    return undefined;
  }
  return value;
};

const nullableNumberSchema = z.preprocess(
  emptyToUndefined,
  z.coerce.number().nonnegative('La valeur doit être positive.').optional()
);

const machineCountsByCategorySchema = z
  .record(z.string().trim().min(1), z.coerce.number().int().min(0))
  .optional()
  .default({});

export const opportunityFormSchema = z.object({
  clientId: z.string().uuid('Client invalide.'),
  title: z.string().min(2, 'Titre requis.').max(180, 'Titre trop long.'),
  description: z.string().max(1200, 'Description trop longue.').optional().nullable(),
  linkedMachineCategoryId: z.string().uuid('Catégorie machine invalide.').optional().nullable(),
  priority: z.enum(opportunityPriorityValues),
  status: z.enum(opportunityStatusValues).default('open'),
  estimatedValue: nullableNumberSchema.nullable(),
  probability: z
    .preprocess(emptyToUndefined, z.coerce.number().min(0, 'Min 0%.').max(100, 'Max 100%.').optional())
    .nullable(),
  yearlyRevenue: nullableNumberSchema.nullable(),
  employeeCount: z.preprocess(emptyToUndefined, z.coerce.number().int().nonnegative('Le nombre doit être positif.').optional()).nullable(),
  totalMachineCount: z.preprocess(emptyToUndefined, z.coerce.number().int().nonnegative('Le nombre doit être positif.').optional()).nullable(),
  machineCountsByCategory: machineCountsByCategorySchema,
  incumbentCompetitorName: z.string().max(180, 'Nom du concurrent trop long.').optional().nullable(),
  incumbentCompetitorCategory: z.enum(competitorCategoryValues).optional().nullable(),
  competitorContractEndDate: z
    .preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.').optional())
    .nullable(),
  notes: z.string().max(2500, 'Notes trop longues.').optional().nullable()
});

export const opportunityUpdateSchema = opportunityFormSchema.omit({ clientId: true }).partial();

export const opportunityFilterSchema = z
  .object({
    statuses: z.array(z.enum(opportunityStatusValues)).optional(),
    priorities: z.array(z.enum(opportunityPriorityValues)).optional(),
    linkedMachineCategoryIds: z.array(z.string().uuid()).optional(),
    clientId: z.string().uuid().optional(),
    postalCode: z.string().max(20).optional(),
    clientFlags: z.array(z.enum(['vip', 'risk', 'watch', 'none'])).optional(),
    estimatedValueMin: z.coerce.number().nonnegative().optional(),
    estimatedValueMax: z.coerce.number().nonnegative().optional(),
    probabilityMin: z.coerce.number().min(0).max(100).optional(),
    probabilityMax: z.coerce.number().min(0).max(100).optional()
  })
  .refine((value) => value.estimatedValueMin === undefined || value.estimatedValueMax === undefined || value.estimatedValueMin <= value.estimatedValueMax, {
    message: 'Min valeur > max valeur',
    path: ['estimatedValueMax']
  })
  .refine((value) => value.probabilityMin === undefined || value.probabilityMax === undefined || value.probabilityMin <= value.probabilityMax, {
    message: 'Min probabilité > max probabilité',
    path: ['probabilityMax']
  });

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;
export type OpportunityUpdateValues = z.infer<typeof opportunityUpdateSchema>;
export type OpportunityFilterValues = z.infer<typeof opportunityFilterSchema>;
