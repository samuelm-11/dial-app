import { PageContainer } from '@/components/layout/page-container';
import { ContractTemplateForm } from '@/features/contracts/components/contract-template-form';
import { ContractTemplateList } from '@/features/contracts/components/contract-template-list';
import { getContractTemplates } from '@/features/contracts/queries';

export default async function ContractTemplatesPage() {
  const templates = await getContractTemplates({ includeInactive: true });

  return (
    <PageContainer title="Modèles de contrat">
      <div className="space-y-5">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Nouveau modèle</h2>
          <ContractTemplateForm />
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Modèles existants</h2>
          <ContractTemplateList templates={templates} />
        </section>
      </div>
    </PageContainer>
  );
}
