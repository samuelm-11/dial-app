import { z } from 'zod';

export const importEntitySchema = z.enum(['clients', 'contacts', 'machines', 'contracts', 'mixed']);
export type ImportEntity = z.infer<typeof importEntitySchema>;

export const entityRowSchema = z.object({
  entity: z.enum(['clients', 'contacts', 'machines', 'contracts']),
  lineNumber: z.number().int().positive(),
  data: z.record(z.string(), z.string().nullable())
});

export const importDraftSchema = z.object({
  fileName: z.string().min(1),
  entity: importEntitySchema,
  headers: z.array(z.string().min(1)).min(1),
  rows: z.array(z.record(z.string(), z.string().nullable())).min(1)
});

export type ImportDraft = z.infer<typeof importDraftSchema>;

export const importMappingSchema = z.object({
  entity: importEntitySchema,
  fieldToColumn: z.record(z.string(), z.string().nullable())
});

export type ImportMappingValues = z.infer<typeof importMappingSchema>;

export const importValidationIssueSchema = z.object({
  lineNumber: z.number().int().positive(),
  entity: z.enum(['clients', 'contacts', 'machines', 'contracts']),
  field: z.string(),
  message: z.string()
});

export type ImportValidationIssue = z.infer<typeof importValidationIssueSchema>;

export const mappedImportRowSchema = z.object({
  lineNumber: z.number().int().positive(),
  entity: z.enum(['clients', 'contacts', 'machines', 'contracts']),
  values: z.record(z.string(), z.string().nullable())
});

export type MappedImportRow = z.infer<typeof mappedImportRowSchema>;

export const runImportPayloadSchema = z.object({
  fileName: z.string().min(1),
  rows: z.array(mappedImportRowSchema)
});

export type RunImportPayload = z.infer<typeof runImportPayloadSchema>;

export type ImportExecutionResult = {
  created: Record<'clients' | 'contacts' | 'machines' | 'contracts', number>;
  skippedDuplicates: number;
  failed: number;
  errors: Array<{ lineNumber: number; entity: string; message: string }>;
};
