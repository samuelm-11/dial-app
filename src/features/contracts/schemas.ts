import { z } from 'zod';

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (YYYY-MM-DD).');

const contractBaseSchema = z.object({
  clientId: z.string().uuid('Client invalide.'),
  title: z.string().min(2, 'Titre requis.').max(180, 'Titre trop long.'),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  autoRenewal: z.boolean().default(false),
  templateId: z.string().uuid('Modèle invalide.').nullable().optional(),
  generatedContent: z.string().max(50000, 'Contenu trop long.').nullable().optional()
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

export const contractTemplateSchema = z.object({
  name: z.string().min(2, 'Nom du modèle requis.').max(160, 'Nom du modèle trop long.'),
  description: z.string().max(500, 'Description trop longue.').nullable().optional(),
  content: z.string().min(20, 'Le modèle doit contenir le texte du contrat.').max(50000, 'Modèle trop long.'),
  isActive: z.boolean().default(true)
});

export const contractTemplateUpdateSchema = contractTemplateSchema.partial();

export const generateContractSchema = contractBaseSchema
  .extend({
    templateId: z.string().uuid('Modèle invalide.'),
    serviceLevel: z.string().min(2, 'Formule de service requise.').max(180, 'Formule trop longue.'),
    monthlyFee: z.string().min(1, 'Montant requis.').max(80, 'Montant trop long.'),
    billingFrequency: z.string().min(2, 'Fréquence de facturation requise.').max(120, 'Fréquence trop longue.'),
    paymentTerms: z.string().min(2, 'Conditions de paiement requises.').max(160, 'Conditions trop longues.'),
    contractDuration: z.string().min(2, 'Durée requise.').max(120, 'Durée trop longue.'),
    specialConditions: z.string().max(2000, 'Conditions particulières trop longues.').nullable().optional()
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: 'La date de fin doit être après la date de début.',
    path: ['endDate']
  });

export type ContractFormValues = z.infer<typeof contractFormSchema>;
export type ContractUpdateValues = z.infer<typeof contractUpdateSchema>;
export type ContractFilterValues = z.infer<typeof contractFilterSchema>;
export type ContractTemplateValues = z.infer<typeof contractTemplateSchema>;
export type GenerateContractValues = z.infer<typeof generateContractSchema>;
