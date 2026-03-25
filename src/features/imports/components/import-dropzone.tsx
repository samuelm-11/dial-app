'use client';

import { useRef } from 'react';

type ImportDropzoneProps = {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  error: string | null;
};

export function ImportDropzone({ onFileSelected, isLoading, error }: ImportDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
      <p className="text-sm text-slate-700">Déposez un fichier .csv ou .xlsx (une feuille unique ou multi-feuilles).</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          {isLoading ? 'Lecture fichier...' : 'Choisir un fichier'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelected(file);
            }
          }}
        />
      </div>
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
