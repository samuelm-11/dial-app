'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getContractFileUrl, replaceContractPdf, uploadContractPdf } from '@/features/contracts/actions';
import type { Contract } from '@/types/contract';

export function ContractUploadField({ clientId, contract }: { clientId: string; contract: Contract }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const submitUpload = (mode: 'create' | 'replace') => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Sélectionnez un PDF.');
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        if (mode === 'replace') {
          await replaceContractPdf(clientId, contract.id, file);
        } else {
          await uploadContractPdf(clientId, contract.id, file);
        }
        router.refresh();
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Erreur upload PDF.');
      }
    });
  };

  const openPdf = () => {
    if (!contract.privatePdfPath) {
      setError('Aucun PDF disponible pour ce contrat.');
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const url = await getContractFileUrl(contract.privatePdfPath ?? '');
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (viewError) {
        setError(viewError instanceof Error ? viewError.message : 'Erreur ouverture PDF.');
      }
    });
  };

  return (
    <div className="space-y-2 rounded border border-slate-200 p-3">
      <p className="text-xs text-slate-600">PDF privé (bucket Supabase: contracts)</p>
      <input ref={fileRef} type="file" accept="application/pdf" className="w-full rounded border border-slate-300 px-2 py-1 text-xs" />

      <div className="flex flex-wrap gap-2">
        {!contract.privatePdfPath ? (
          <button disabled={isPending} onClick={() => submitUpload('create')} className="rounded bg-slate-900 px-2 py-1 text-xs text-white disabled:opacity-60">
            {isPending ? 'Upload...' : 'Uploader PDF'}
          </button>
        ) : (
          <>
            <button disabled={isPending} onClick={() => submitUpload('replace')} className="rounded bg-slate-900 px-2 py-1 text-xs text-white disabled:opacity-60">
              {isPending ? 'Remplacement...' : 'Remplacer PDF'}
            </button>
            <button disabled={isPending} onClick={openPdf} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
              Voir PDF
            </button>
          </>
        )}
      </div>

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
