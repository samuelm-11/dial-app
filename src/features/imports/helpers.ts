import { z } from 'zod';
import type { ImportEntity, ImportValidationIssue, MappedImportRow } from '@/features/imports/schemas';

const clientRowSchema = z.object({
  name: z.string().min(2, 'Nom client requis'),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  flag: z.string().optional()
});

const contactRowSchema = z.object({
  clientName: z.string().min(2, 'Client requis'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.string().optional(),
  isPrimary: z.string().optional()
});

const machineRowSchema = z.object({
  clientName: z.string().min(2, 'Client requis'),
  machineTypeCode: z.string().min(1, 'Type machine requis'),
  quantity: z.coerce.number().int().min(1, 'Quantité >= 1')
});

const contractRowSchema = z.object({
  clientName: z.string().min(2, 'Client requis'),
  title: z.string().min(1, 'Titre requis'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date début invalide (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date fin invalide (YYYY-MM-DD)'),
  autoRenewal: z.string().optional()
});

export const fieldSets: Record<ImportEntity, Array<{ key: string; label: string; required?: boolean }>> = {
  clients: [
    { key: 'name', label: 'Nom client', required: true },
    { key: 'city', label: 'Ville', required: true },
    { key: 'postalCode', label: 'Code postal' },
    { key: 'country', label: 'Pays' },
    { key: 'address', label: 'Adresse' },
    { key: 'category', label: 'Catégorie client' },
    { key: 'flag', label: 'Flag client' }
  ],
  contacts: [
    { key: 'clientName', label: 'Nom client', required: true },
    { key: 'firstName', label: 'Prénom', required: true },
    { key: 'lastName', label: 'Nom', required: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
    { key: 'role', label: 'Rôle' },
    { key: 'isPrimary', label: 'Contact principal' }
  ],
  machines: [
    { key: 'clientName', label: 'Nom client', required: true },
    { key: 'machineTypeCode', label: 'Code type machine', required: true },
    { key: 'quantity', label: 'Quantité', required: true }
  ],
  contracts: [
    { key: 'clientName', label: 'Nom client', required: true },
    { key: 'title', label: 'Titre contrat', required: true },
    { key: 'startDate', label: 'Date début (YYYY-MM-DD)', required: true },
    { key: 'endDate', label: 'Date fin (YYYY-MM-DD)', required: true },
    { key: 'autoRenewal', label: 'Auto-renouvellement' }
  ],
  mixed: [{ key: 'entityType', label: 'Type ligne (client/contact/machine/contract)', required: true }]
};

export function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? '';
}

export function parseBoolean(value: string | null | undefined) {
  const v = normalizeText(value).toLowerCase();
  return ['1', 'true', 'oui', 'yes', 'y'].includes(v);
}

export function detectEntityType(raw: Record<string, string | null>) {
  const type = normalizeText(raw.entityType ?? raw.type ?? raw.entity).toLowerCase();
  if (type.startsWith('client')) return 'clients';
  if (type.startsWith('contact')) return 'contacts';
  if (type.startsWith('machine')) return 'machines';
  if (type.startsWith('contract') || type.startsWith('contrat')) return 'contracts';
  return null;
}

function pickSchema(entity: MappedImportRow['entity']) {
  if (entity === 'clients') return clientRowSchema;
  if (entity === 'contacts') return contactRowSchema;
  if (entity === 'machines') return machineRowSchema;
  return contractRowSchema;
}

export function validateMappedRows(rows: MappedImportRow[]) {
  const issues: ImportValidationIssue[] = [];
  const duplicateKeys = new Set<string>();

  rows.forEach((row) => {
    const schema = pickSchema(row.entity);
    const result = schema.safeParse(row.values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        issues.push({
          lineNumber: row.lineNumber,
          entity: row.entity,
          field: issue.path.join('.') || 'row',
          message: issue.message
        });
      });
    }

    const duplicateKey = `${row.entity}:${normalizeText(row.values.clientName ?? row.values.name).toLowerCase()}:${normalizeText(row.values.title ?? row.values.email ?? row.values.machineTypeCode).toLowerCase()}`;
    if (duplicateKeys.has(duplicateKey)) {
      issues.push({
        lineNumber: row.lineNumber,
        entity: row.entity,
        field: 'row',
        message: 'Doublon détecté dans le fichier importé.'
      });
    }
    duplicateKeys.add(duplicateKey);
  });

  return issues;
}
