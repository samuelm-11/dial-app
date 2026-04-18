import { PageContainer } from '@/components/layout/page-container';
import { InterventionForm } from '@/features/interventions/components/intervention-form';
import { InterventionTable } from '@/features/interventions/components/intervention-table';
import { getInterventionFormOptions, getInterventions } from '@/features/interventions/queries';

export default async function InterventionsPage() {
  const [interventions, options] = await Promise.all([getInterventions(), getInterventionFormOptions()]);
  const safeInterventions = Array.isArray(interventions) ? interventions : [];

  return (
    <PageContainer title="Interventions">
      <div className="space-y-5">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Nouvelle intervention</h2>
          <InterventionForm clients={options.clients} machines={options.machines} technicians={options.technicians} />
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Historique des interventions</h2>
          <InterventionTable interventions={safeInterventions} />
        </section>
      </div>
    </PageContainer>
  );
}
