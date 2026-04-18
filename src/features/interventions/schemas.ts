import { z } from 'zod';
import { interventionStatusValues, interventionTypeValues } from '@/types/intervention';

const optionalTrimmedText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((value) => {
      if (!value) {
        return null;
      }

      const trimmed = value.trim();
      return trimmed.length ? trimmed : null;
    });

const optionalTime = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }

    const trimmed = value.trim();
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed) ? `${trimmed}:00` : null;
  });

export const interventionFormSchema = z.object({
  clientId: z.string().uuid('Client invalide.'),
  machineId: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return null;
      }
      return value.trim().length ? value : null;
    }),
  technicianUserId: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return null;
      }
      return value.trim().length ? value : null;
    }),
  technicianName: optionalTrimmedText(120),
  interventionDate: z.string().date('Date d’intervention invalide.'),
  startTime: optionalTime,
  endTime: optionalTime,
  type: z.enum(interventionTypeValues, { message: 'Type d’intervention invalide.' }),
  status: z.enum(interventionStatusValues, { message: 'Statut d’intervention invalide.' }),
  title: z.string().min(3, 'Le titre est requis.').max(140),
  description: z.string().min(5, 'La description est requise.').max(2500),
  diagnosis: optionalTrimmedText(2500),
  actionTaken: optionalTrimmedText(2500),
  photoPath: optionalTrimmedText(500),
  notes: optionalTrimmedText(2500)
});

export type InterventionFormValues = z.infer<typeof interventionFormSchema>;
