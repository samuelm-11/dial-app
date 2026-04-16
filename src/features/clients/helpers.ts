import type { Client, ClientCategoryCode, ClientFilterInput, ClientFlagCode, ClientHierarchyNode } from '@/types/client';

export const clientCategoryLabels: Record<ClientCategoryCode, string> = {
  enterprise: 'Grand compte',
  sme: 'PME',
  public: 'Secteur public',
  franchise: 'Franchise',
  other: 'Autre'
};

export const clientFlagLabels: Record<ClientFlagCode, string> = {
  vip: 'VIP',
  risk: 'Risque',
  watch: 'Surveillance',
  none: 'Aucun'
};

export const clientFlagBadgeClass: Record<ClientFlagCode, string> = {
  vip: 'bg-emerald-100 text-emerald-800',
  risk: 'bg-rose-100 text-rose-800',
  watch: 'bg-amber-100 text-amber-800',
  none: 'bg-slate-100 text-slate-700'
};

export function buildClientHierarchy(clients: Client[]): ClientHierarchyNode[] {
  const byParent = new Map<string | null, Client[]>();

  for (const client of clients) {
    const parentId = client.parentClientId ?? null;
    const children = byParent.get(parentId) ?? [];
    children.push(client);
    byParent.set(parentId, children);
  }

  const toNode = (client: Client): ClientHierarchyNode => ({
    id: client.id,
    name: client.name,
    city: client.city,
    category: client.category,
    flag: client.flag,
    parentClientId: client.parentClientId,
    hasContract: client.hasContract,
    openOpportunities: client.openOpportunities,
    openAlerts: client.openAlerts,
    children: (byParent.get(client.id) ?? []).map(toNode)
  });

  return (byParent.get(null) ?? []).map(toNode);
}

export function filterClients(clients: Client[], filters: ClientFilterInput): Client[] {
  return clients.filter((client) => {
    if (filters.name && !(client.name ?? '').toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.postalCode && !(client.postalCode ?? '').includes(filters.postalCode)) {
      return false;
    }

    if (filters.city && !(client.city ?? '').toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }

    if (filters.categories?.length && !filters.categories.includes(client.category)) {
      return false;
    }

    if (filters.flags?.length && !filters.flags.includes(client.flag)) {
      return false;
    }

    if (filters.onlyParents && client.parentClientId) {
      return false;
    }

    if (filters.onlySubClients && !client.parentClientId) {
      return false;
    }

    if (filters.hasParent === true && !client.parentClientId) {
      return false;
    }

    if (filters.hasParent === false && client.parentClientId) {
      return false;
    }

    if (filters.hasContract !== undefined && client.hasContract !== filters.hasContract) {
      return false;
    }

    if (filters.hasOpenOpportunities && client.openOpportunities < 1) {
      return false;
    }

    if (filters.hasOpenAlerts && client.openAlerts < 1) {
      return false;
    }

    return true;
  });
}
