import { ContractTemplateForm } from '@/features/contracts/components/contract-template-form';
import type { ContractTemplate } from '@/types/contract';

export function ContractTemplateList({ templates }: { templates: ContractTemplate[] }) {
  if (templates.length === 0) {
    return <p className="rounded border border-dashed p-4 text-sm text-slate-500">Aucun modèle de contrat pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <section key={template.id} className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{template.name}</h2>
            <p className="text-xs text-slate-500">{template.description ?? 'Aucune description'}</p>
          </div>
          <ContractTemplateForm template={template} />
        </section>
      ))}
    </div>
  );
}
