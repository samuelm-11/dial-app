'use client';

import type { ImportExecutionResult, ImportValidationIssue } from '@/features/imports/schemas';

type ImportSummaryProps = {
  validationIssues: ImportValidationIssue[];
  importResult: ImportExecutionResult | null;
};

export function ImportSummary({ validationIssues, importResult }: ImportSummaryProps) {
  if (!validationIssues.length && !importResult) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Résumé import</h3>

      {validationIssues.length ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium">{validationIssues.length} erreur(s) de validation détectée(s)</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            {validationIssues.slice(0, 8).map((issue) => (
              <li key={`${issue.lineNumber}-${issue.field}`}>
                Ligne {issue.lineNumber} ({issue.entity}) - {issue.field}: {issue.message}
              </li>
            ))}
          </ul>
          {validationIssues.length > 8 ? <p className="mt-1 text-xs">Affichage limité, corrigez le fichier puis relancez.</p> : null}
        </div>
      ) : null}

      {importResult ? (
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          <p>Créés: clients {importResult.created.clients}, contacts {importResult.created.contacts}, machines {importResult.created.machines}, contrats {importResult.created.contracts}</p>
          <p>Doublons ignorés: {importResult.skippedDuplicates}</p>
          <p>Échecs: {importResult.failed}</p>
          {importResult.errors.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-rose-700">
              {importResult.errors.slice(0, 8).map((error, index) => (
                <li key={`${error.lineNumber}-${index}`}>
                  Ligne {error.lineNumber} ({error.entity}): {error.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
