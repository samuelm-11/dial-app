import { detectEntityType, normalizeText } from '@/features/imports/helpers';
import type { ImportEntity, ImportMappingValues, MappedImportRow } from '@/features/imports/schemas';

const aliases: Record<string, string[]> = {
  name: ['name', 'client', 'client_name', 'nom client', 'nom'],
  city: ['city', 'ville'],
  postalCode: ['postal', 'postal_code', 'code postal', 'cp'],
  country: ['country', 'pays'],
  address: ['address', 'adresse'],
  parentClientName: ['parent', 'client parent', 'parent client'],
  category: ['category', 'categorie'],
  flag: ['flag', 'status_flag'],
  clientName: ['client', 'client_name', 'nom client'],
  firstName: ['first_name', 'prenom', 'firstname'],
  lastName: ['last_name', 'nom', 'lastname'],
  email: ['email', 'mail'],
  phone: ['phone', 'telephone', 'tel'],
  role: ['role', 'fonction'],
  isPrimary: ['is_primary', 'principal', 'primary'],
  machineTypeCode: ['machine_type', 'machine_type_code', 'type machine', 'code machine'],
  quantity: ['quantity', 'qty', 'quantite'],
  title: ['title', 'contract_title', 'titre'],
  startDate: ['start_date', 'date debut', 'debut'],
  endDate: ['end_date', 'date fin', 'fin'],
  autoRenewal: ['auto_renewal', 'renouvellement auto'],
  entityType: ['entity', 'type', 'line_type', 'nature']
};

export function autoMapColumns(headers: string[], entity: ImportEntity): ImportMappingValues['fieldToColumn'] {
  const normalizedHeaders = headers.map((header) => ({ raw: header, normalized: normalizeText(header).toLowerCase() }));

  const candidateFields = entity === 'mixed' ? ['entityType'] : Object.keys(aliases);

  return candidateFields.reduce<Record<string, string | null>>((acc, field) => {
    const match = normalizedHeaders.find(({ normalized }) => aliases[field]?.some((alias) => normalized.includes(alias)));
    acc[field] = match?.raw ?? null;
    return acc;
  }, {});
}

export function mapRows(
  rows: Array<Record<string, string | null>>,
  mapping: ImportMappingValues,
  baseEntity: ImportEntity
): MappedImportRow[] {
  return rows
    .map((sourceRow, index) => {
      const values: Record<string, string | null> = {};
      Object.entries(mapping.fieldToColumn).forEach(([field, column]) => {
        values[field] = column ? sourceRow[column] ?? null : null;
      });

      const entity = baseEntity === 'mixed' ? detectEntityType(values) : baseEntity;
      if (!entity) {
        return null;
      }

      return {
        lineNumber: index + 2,
        entity,
        values
      };
    })
    .filter((row): row is MappedImportRow => row !== null);
}
