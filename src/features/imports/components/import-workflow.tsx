'use client';

import { useMemo, useState, useTransition } from 'react';
import { runImport } from '@/features/imports/actions';
import { validateMappedRows } from '@/features/imports/helpers';
import { autoMapColumns, mapRows } from '@/features/imports/mappers';
import { parseImportFile } from '@/features/imports/parsers';
import { ImportDropzone } from '@/features/imports/components/import-dropzone';
import { ImportMappingStep } from '@/features/imports/components/import-mapping-step';
import { ImportPreviewTable } from '@/features/imports/components/import-preview-table';
import { ImportSummary } from '@/features/imports/components/import-summary';
import type { ImportEntity, ImportExecutionResult, ImportMappingValues, ImportValidationIssue, MappedImportRow } from '@/features/imports/schemas';

const steps = ['Upload', 'Colonnes', 'Mapping', 'Prévisualisation', 'Validation', 'Import final', 'Résumé'];

export function ImportWorkflow() {
  const [entity, setEntity] = useState<ImportEntity>('mixed');
  const [fileName, setFileName] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Array<Record<string, string | null>>>([]);
  const [mappedRows, setMappedRows] = useState<MappedImportRow[]>([]);
  const [validationIssues, setValidationIssues] = useState<ImportValidationIssue[]>([]);
  const [mapping, setMapping] = useState<Record<string, string | null>>({});
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportExecutionResult | null>(null);
  const [isImporting, startTransition] = useTransition();

  const currentStep = useMemo(() => {
    if (!fileName) return 1;
    if (!Object.keys(mapping).length) return 3;
    if (!mappedRows.length) return 4;
    if (validationIssues.length) return 5;
    if (isImporting) return 6;
    if (importResult) return 7;
    return 4;
  }, [fileName, importResult, isImporting, mappedRows.length, mapping, validationIssues.length]);

  const handleFileSelected = async (file: File) => {
    setErrorMessage(null);
    setImportResult(null);
    setValidationIssues([]);

    try {
      const parsed = await parseImportFile(file);
      setFileName(file.name);
      setHeaders(parsed.headers);
      setRawRows(parsed.rows);
      setInfoMessage(parsed.warning ?? null);
      const autoMapping = autoMapColumns(parsed.headers, entity);
      setMapping(autoMapping);
      const draftRows = mapRows(parsed.rows, { entity, fieldToColumn: autoMapping }, entity);
      setMappedRows(draftRows);
      setValidationIssues(validateMappedRows(draftRows));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lecture fichier.');
    }
  };

  const handleMappingConfirm = (values: ImportMappingValues) => {
    setMapping(values.fieldToColumn);
    const rows = mapRows(rawRows, values, entity);
    setMappedRows(rows);
    setValidationIssues(validateMappedRows(rows));
    setImportResult(null);
  };

  const handleRunImport = () => {
    startTransition(async () => {
      const result = await runImport({ fileName: fileName ?? 'unknown', rows: mappedRows });
      setImportResult(result);
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        {steps.map((step, index) => (
          <span key={step} className={index + 1 === currentStep ? 'font-semibold text-slate-900' : ''}>
            {index + 1}. {step}
            {index < steps.length - 1 ? '  →  ' : ''}
          </span>
        ))}
      </div>

      <div className="rounded border border-slate-200 bg-white p-4">
        <label className="text-sm text-slate-700" htmlFor="import-entity">
          Cible import
        </label>
        <select
          id="import-entity"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm md:w-72"
          value={entity}
          onChange={(event) => setEntity(event.target.value as ImportEntity)}
        >
          <option value="mixed">Mixte (une feuille unique)</option>
          <option value="clients">Clients</option>
          <option value="contacts">Contacts</option>
          <option value="machines">Machines</option>
          <option value="contracts">Contrats</option>
        </select>
      </div>

      <ImportDropzone onFileSelected={handleFileSelected} isLoading={false} error={errorMessage} />

      {fileName ? (
        <div className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p>
            Fichier: <span className="font-medium">{fileName}</span> - {rawRows.length} lignes détectées.
          </p>
          {infoMessage ? <p className="mt-1 text-amber-700">{infoMessage}</p> : null}
        </div>
      ) : null}

      {headers.length ? <ImportMappingStep entity={entity} headers={headers} defaultMapping={mapping} onConfirm={handleMappingConfirm} /> : null}

      <ImportPreviewTable rows={mappedRows} />

      <ImportSummary validationIssues={validationIssues} importResult={importResult} />

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isImporting || !mappedRows.length || validationIssues.length > 0}
          onClick={handleRunImport}
          className="rounded bg-emerald-700 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isImporting ? 'Import en cours...' : 'Lancer import final'}
        </button>
        {validationIssues.length > 0 ? <p className="text-xs text-rose-600">Corrigez les lignes invalides avant import.</p> : null}
      </div>

      <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-600">
        Placeholder propre: la gestion avancée des pièces PDF privées sera finalisée à l'étape dédiée.
      </div>
    </div>
  );
}
