'use client';

import type { MappedImportRow } from '@/features/imports/schemas';

export function ImportPreviewTable({ rows }: { rows: MappedImportRow[] }) {
  if (!rows.length) {
    return <p className="rounded border border-dashed p-4 text-sm text-slate-500">Aucune ligne exploitable avec ce mapping.</p>;
  }

  const previewRows = rows.slice(0, 20);

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-700">
            <th className="px-3 py-2">Ligne</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Données mappées</th>
          </tr>
        </thead>
        <tbody>
          {previewRows.map((row) => (
            <tr key={`${row.entity}-${row.lineNumber}`} className="border-t border-slate-100 align-top">
              <td className="px-3 py-2">{row.lineNumber}</td>
              <td className="px-3 py-2 uppercase">{row.entity}</td>
              <td className="px-3 py-2">
                <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                  {Object.entries(row.values)
                    .filter(([, value]) => value)
                    .map(([field, value]) => (
                      <p key={field} className="text-xs text-slate-700">
                        <span className="font-medium">{field}:</span> {value}
                      </p>
                    ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 20 ? <p className="p-3 text-xs text-slate-500">Prévisualisation limitée à 20 lignes ({rows.length} lignes mappées).</p> : null}
    </div>
  );
}
