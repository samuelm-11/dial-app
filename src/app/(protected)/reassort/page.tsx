import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAuth } from '@/lib/auth/guards';

type RoundStatus = 'a_faire' | 'en_cours' | 'termine';

type RestockingRound = {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  status: RoundStatus;
  stops: Array<{
    order: number;
    clientName: string;
    siteName: string;
    address: string;
    machines: string[];
    categories: string[];
    status: RoundStatus;
  }>;
};

const rounds: RestockingRound[] = [
  {
    id: 'TR-2026-001',
    date: '2026-04-29',
    employeeId: 'emp-1',
    employeeName: 'Nicolas K.',
    status: 'en_cours',
    stops: [
      {
        order: 1,
        clientName: 'Clinique Horizon',
        siteName: 'Bâtiment A',
        address: '14 Rue de la Station, Seraing',
        machines: ['Distributeur boissons #A12', 'Snacks #S04'],
        categories: ['Boissons fraîches', 'Snacks salés', 'Eaux'],
        status: 'en_cours'
      },
      {
        order: 2,
        clientName: 'Liège Logistic Hub',
        siteName: 'Open Space Nord',
        address: "8 Rue de l'Industrie, Herstal",
        machines: ['Combo #C22'],
        categories: ['Sandwiches', 'Snacks sucrés', 'Boissons énergétiques'],
        status: 'a_faire'
      }
    ]
  },
  {
    id: 'TR-2026-002',
    date: '2026-04-29',
    employeeId: 'emp-2',
    employeeName: 'Thierry R.',
    status: 'a_faire',
    stops: [
      {
        order: 1,
        clientName: 'Ateliers du Val Saint-Lambert',
        siteName: 'Accueil principal',
        address: '2 Rue du Val, Flémalle',
        machines: ['Eau #W09', 'Snacks #S31'],
        categories: ['Eaux', 'Snacks salés'],
        status: 'a_faire'
      }
    ]
  }
];

const statusLabel: Record<RoundStatus, string> = {
  a_faire: 'à faire',
  en_cours: 'en cours',
  termine: 'terminé'
};

const statusTone: Record<RoundStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  a_faire: 'warning',
  en_cours: 'neutral',
  termine: 'success'
};

export default async function ReassortPage({
  searchParams
}: {
  searchParams: Promise<{ employee?: string; status?: RoundStatus }>;
}) {
  const profile = await requireAuth();
  const params = await searchParams;
  const isManager = profile.role === 'manager' || profile.role === 'admin';
  const isEmployee = !isManager;
  const employeeFilter = params.employee ?? 'all';
  const statusFilter = params.status ?? 'all';

  const visibleRounds = rounds.filter((round) => {
    if (isEmployee) return round.employeeId === profile.id;
    return (employeeFilter === 'all' || round.employeeId === employeeFilter) && (statusFilter === 'all' || round.status === statusFilter);
  });

  const employeeStats = rounds.reduce<Record<string, { employeeName: string; stops: number }>>((acc, round) => {
    if (!acc[round.employeeId]) acc[round.employeeId] = { employeeName: round.employeeName, stops: 0 };
    acc[round.employeeId].stops += round.stops.length;
    return acc;
  }, {});

  return (
    <PageContainer title="Réassort">
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Réassort / Tournées</CardTitle>
              <CardDescription>Pilotage des tournées de réassort des machines avec suivi du statut.</CardDescription>
            </div>
            <Badge tone="neutral" label={isManager ? 'Vue manager' : 'Vue employé'} />
          </CardHeader>
          {isManager && (
            <form className="grid gap-3 border-t border-muted pt-4 sm:grid-cols-2">
              <label className="text-sm text-slate-700">
                Employé
                <select name="employee" defaultValue={employeeFilter} className="mt-1 w-full rounded-lg border border-muted px-3 py-2">
                  <option value="all">Tous les employés</option>
                  {Object.entries(employeeStats).map(([id, data]) => (
                    <option key={id} value={id}>
                      {data.employeeName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-700">
                Statut
                <select name="status" defaultValue={statusFilter} className="mt-1 w-full rounded-lg border border-muted px-3 py-2">
                  <option value="all">Tous les statuts</option>
                  <option value="a_faire">à faire</option>
                  <option value="en_cours">en cours</option>
                  <option value="termine">terminé</option>
                </select>
              </label>
              <button type="submit" className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
                Filtrer
              </button>
            </form>
          )}
        </Card>

        {isManager && (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <p className="text-xs uppercase tracking-wide text-slate-500">Aperçu du jour</p>
              <p className="mt-2 text-3xl font-semibold text-primary">{rounds.length}</p>
              <p className="mt-1 text-xs text-slate-500">tournées planifiées aujourd&apos;hui</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-slate-500">Progression globale</p>
              <p className="mt-2 text-3xl font-semibold text-secondary">
                {rounds.filter((round) => round.status === 'termine').length}/{rounds.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">tournées terminées</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-slate-500">Arrêts par employé</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {Object.values(employeeStats).map((item) => (
                  <li key={item.employeeName}>
                    {item.employeeName} · <strong>{item.stops}</strong> arrêts
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <div>
              <CardTitle>{isManager ? 'Tournées à superviser' : 'Ma tournée assignée'}</CardTitle>
              <CardDescription>Structure prête pour validation d&apos;arrêt, notes terrain et dépôt de photos (prochaine version).</CardDescription>
            </div>
          </CardHeader>
          {visibleRounds.length === 0 ? (
            <p className="rounded-lg border border-dashed border-muted p-4 text-sm text-slate-500">
              Aucune tournée disponible pour les filtres sélectionnés.
            </p>
          ) : (
            <div className="space-y-4">
              {visibleRounds.map((round) => (
                <article key={round.id} className="rounded-xl border border-muted p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {round.id} · {round.employeeName}
                    </h3>
                    <Badge tone={statusTone[round.status]} label={statusLabel[round.status]} />
                    <span className="text-xs text-slate-500">{round.date}</span>
                  </div>
                  <ol className="space-y-3">
                    {round.stops.map((stop) => (
                      <li key={`${round.id}-${stop.order}`} className="rounded-lg border border-muted/70 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900">
                            #{stop.order} · {stop.clientName} — {stop.siteName}
                          </p>
                          <Badge tone={statusTone[stop.status]} label={statusLabel[stop.status]} />
                        </div>
                        <p className="text-sm text-slate-600">{stop.address}</p>
                        <p className="mt-2 text-sm text-slate-700">
                          <strong>Machines :</strong> {stop.machines.join(', ')}
                        </p>
                        <p className="text-sm text-slate-700">
                          <strong>Catégories :</strong> {stop.categories.join(', ')}
                        </p>
                        <div className="mt-3 grid gap-2 rounded-lg border border-dashed border-muted p-3 sm:grid-cols-3">
                          <button type="button" disabled className="rounded-lg border border-muted bg-white px-3 py-2 text-xs text-slate-400">
                            Marquer comme terminé (bientôt)
                          </button>
                          <button type="button" disabled className="rounded-lg border border-muted bg-white px-3 py-2 text-xs text-slate-400">
                            Ajouter une note (bientôt)
                          </button>
                          <button type="button" disabled className="rounded-lg border border-muted bg-white px-3 py-2 text-xs text-slate-400">
                            Ajouter une photo (bientôt)
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          )}
        </Card>

        {isManager && (
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Carte des tournées (placeholder)</CardTitle>
                <CardDescription>Zone réservée à Google Maps / Mapbox, GPS employé et optimisation d&apos;itinéraire.</CardDescription>
              </div>
            </CardHeader>
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-muted bg-slate-50 text-sm text-slate-500">
              Carte à venir (GPS + optimisation de tournée)
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
