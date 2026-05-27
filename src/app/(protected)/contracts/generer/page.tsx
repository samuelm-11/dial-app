import { PageContainer } from '@/components/layout/page-container';
import { ContractGenerator } from '@/features/contracts/components/contract-generator';
import { getClientById, getClients } from '@/features/clients/queries';
import { getContractTemplates } from '@/features/contracts/queries';

export default async function GenerateContractPage({
  searchParams
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const params = await searchParams;
  const [clients, templates, selectedClient] = await Promise.all([
    getClients({}),
    getContractTemplates(),
    params.clientId ? getClientById(params.clientId) : Promise.resolve(null)
  ]);

  return (
    <PageContainer title="Générer un contrat">
      <div className="space-y-5">
        <form className="rounded border border-slate-200 bg-slate-50 p-4">
          <label className="text-sm font-medium text-slate-700">
            Client
            <select name="clientId" defaultValue={params.clientId ?? ''} className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} · {client.postalCode} {client.city}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="mt-3 rounded bg-slate-900 px-3 py-2 text-sm text-white">
            Continuer
          </button>
        </form>

        {params.clientId && !selectedClient ? (
          <p className="rounded border border-dashed border-slate-300 p-4 text-sm text-slate-500">Client introuvable.</p>
        ) : null}

        {selectedClient ? <ContractGenerator client={selectedClient} templates={templates} /> : null}
      </div>
    </PageContainer>
  );
}
