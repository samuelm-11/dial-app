import { z } from 'zod';
import type { AlertDueBucket, AlertStatus, AlertType } from '@/types/alert';

export const alertTypeValues = ['contract_end', 'filter_change'] as const satisfies readonly AlertType[];
export const alertStatusValues = ['open', 'done', 'dismissed'] as const satisfies readonly AlertStatus[];
export const alertDueBucketValues = ['urgent', 'upcoming', 'later'] as const satisfies readonly AlertDueBucket[];

export const alertFilterSchema = z.object({
  type: z.array(z.enum(alertTypeValues)).optional(),
  status: z.array(z.enum(alertStatusValues)).optional(),
  dueBucket: z.array(z.enum(alertDueBucketValues)).optional(),
  dueWithinDays: z.coerce.number().int().min(0).max(365).optional(),
  clientId: z.string().uuid().optional(),
  postalCode: z.string().max(20).optional(),
  machineType: z.string().max(120).optional()
});

export const alertUpdateStatusSchema = z.object({
  id: z.string().uuid('Alerte invalide.'),
  status: z.enum(alertStatusValues)
});

export type AlertFilterValues = z.infer<typeof alertFilterSchema>;
