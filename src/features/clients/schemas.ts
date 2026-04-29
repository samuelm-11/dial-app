import { z } from 'zod';

export const clientCategoryValues = ['enterprise', 'sme', 'public', 'franchise', 'other'] as const;
export const clientFlagValues = ['vip', 'risk', 'watch', 'none'] as const;

export const clientFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  parentClientId: z.preprocess((value) => (value === '' ? null : value), z.string().uuid().nullable().optional()),
  category: z.enum(clientCategoryValues),
  flag: z.enum(clientFlagValues),
  address: z.string().min(4, 'Adresse requise.'),
  postalCode: z.string().min(3, 'Code postal requis.'),
  city: z.string().min(2, 'Ville requise.'),
  country: z.string().min(2, 'Pays requis.'),
  installationDate: z.string().nullable().optional(),
  improvementNotes: z.string().nullable().optional(),
  internalNotes: z.string().nullable().optional(),
  initialPrimaryContact: z
    .object({
      firstName: z.string().min(2, 'Prénom requis.'),
      lastName: z.string().min(2, 'Nom requis.'),
      email: z.string().email('Email invalide.').nullable().optional(),
      phone: z.string().min(6, 'Téléphone invalide.').nullable().optional()
    })
    .optional()
});

export const clientUpdateSchema = clientFormSchema.omit({
  initialPrimaryContact: true
});

export const clientFilterSchema = z.object({
  name: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  categories: z.array(z.enum(clientCategoryValues)).optional(),
  flags: z.array(z.enum(clientFlagValues)).optional(),
  onlyParents: z.boolean().optional(),
  onlySubClients: z.boolean().optional(),
  hasParent: z.boolean().optional(),
  hasContract: z.boolean().optional(),
  hasOpenOpportunities: z.boolean().optional(),
  hasOpenAlerts: z.boolean().optional(),
  machineFilters: z
    .object({
      machineCategoryIds: z.array(z.string()).optional(),
      machineTypeIds: z.array(z.string()).optional(),
      hasHotDrinks: z.boolean().optional(),
      hasCandy: z.boolean().optional(),
      withoutWaterFountain: z.boolean().optional(),
      withFiltersDueSoon: z.boolean().optional()
    })
    .optional()
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
export type ClientUpdateValues = z.infer<typeof clientUpdateSchema>;
export type ClientFilterValues = z.infer<typeof clientFilterSchema>;
