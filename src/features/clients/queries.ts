import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Client, ClientFilterInput, ClientHierarchyNode, ClientWithRelations } from '@/types/client';
import type { Contact } from '@/types/contact';
import { buildClientHierarchy, filterClients } from '@/features/clients/helpers';
import { getClientIdsMatchingMachineFilters } from '@/features/machines/queries';

const mockClients: Client[] = [
  {
    id: '3f2d8635-a2d7-40ec-a4a2-25d0f4791fbb',
    name: 'Groupe Atlantique Distribution',
    parentClientId: null,
    category: 'enterprise',
    flag: 'vip',
    address: '12 avenue des Arômes',
    postalCode: '44000',
    city: 'Nantes',
    country: 'France',
    installationDate: '2022-01-10',
    improvementNotes: 'Prévoir extension de parc T3.',
    internalNotes: 'Renouvellement anticipé possible.',
    hasContract: true,
    openOpportunities: 2,
    openAlerts: 1,
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2025-10-02T10:00:00.000Z'
  },
  {
    id: 'a82f9f13-f2de-47e2-b9c8-7e8f4fef5898',
    name: 'Atlantique Distribution - Site Angers',
    parentClientId: '3f2d8635-a2d7-40ec-a4a2-25d0f4791fbb',
    category: 'sme',
    flag: 'watch',
    address: '8 rue de la Gare',
    postalCode: '49000',
    city: 'Angers',
    country: 'France',
    installationDate: '2023-03-12',
    improvementNotes: null,
    internalNotes: 'Site pilote paiements sans contact.',
    hasContract: true,
    openOpportunities: 1,
    openAlerts: 2,
    createdAt: '2024-02-10T10:00:00.000Z',
    updatedAt: '2025-10-02T10:00:00.000Z'
  },
  {
    id: '4f86908f-6524-4f23-b89e-631df4ac0716',
    name: 'Mairie de Pessac',
    parentClientId: null,
    category: 'public',
    flag: 'none',
    address: 'Place de la République',
    postalCode: '33600',
    city: 'Pessac',
    country: 'France',
    installationDate: '2021-09-01',
    improvementNotes: 'Mettre en place suivi énergétique.',
    internalNotes: null,
    hasContract: false,
    openOpportunities: 0,
    openAlerts: 0,
    createdAt: '2024-05-01T10:00:00.000Z',
    updatedAt: '2025-10-02T10:00:00.000Z'
  }
];

const mockContacts: Contact[] = [
  {
    id: '05ea9b8f-b2ea-4f3d-af8b-88e6ca3bc081',
    clientId: '3f2d8635-a2d7-40ec-a4a2-25d0f4791fbb',
    firstName: 'Camille',
    lastName: 'Roux',
    email: 'camille.roux@example.com',
    phone: '+33 6 01 02 03 04',
    role: 'manager',
    isPrimary: true,
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2025-10-02T10:00:00.000Z'
  },
  {
    id: '4f3f6a4f-4d50-4e69-a9dd-91f6492d5e8b',
    clientId: 'a82f9f13-f2de-47e2-b9c8-7e8f4fef5898',
    firstName: 'Noah',
    lastName: 'Bertrand',
    email: 'noah.bertrand@example.com',
    phone: '+33 6 11 12 13 14',
    role: 'technical',
    isPrimary: true,
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2025-10-02T10:00:00.000Z'
  }
];

function mapClientRow(row: Record<string, any>): Client {
  const categoryCode = row.client_categories?.code ?? row.category ?? 'other';
  const firstClientFlag = Array.isArray(row.client_flags) ? row.client_flags[0] : null;
  const flagCode = firstClientFlag?.flag_definitions?.code ?? row.flag ?? 'none';

  return {
    id: row.id,
    name: row.name ?? 'Client sans nom',
    parentClientId: row.parent_client_id ?? row.parentClientId ?? null,
    category: ['enterprise', 'sme', 'public', 'franchise', 'other'].includes(categoryCode) ? categoryCode : 'other',
    flag: ['vip', 'risk', 'watch', 'none'].includes(flagCode) ? flagCode : 'none',
    address: row.address ?? '',
    postalCode: row.postal_code ?? row.postalCode ?? '',
    city: row.city ?? '',
    country: row.country ?? '',
    installationDate: row.installation_date ?? row.installationDate ?? null,
    improvementNotes: row.improvement_notes ?? row.improvementNotes ?? null,
    internalNotes: row.internal_notes ?? row.internalNotes ?? null,
    hasContract: Boolean(row.has_contract ?? row.hasContract ?? false),
    openOpportunities: Number(row.open_opportunities ?? row.openOpportunities ?? 0),
    openAlerts: Number(row.open_alerts ?? row.openAlerts ?? 0),
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString()
  };
}

export const getClients = cache(async (filters: ClientFilterInput = {}): Promise<Client[]> => {
  const supabase = await createSupabaseServerClient();

  const [
    { data: clientsData, error: clientsError },
    { data: contractsData, error: contractsError },
    { data: opportunitiesData, error: opportunitiesError },
    { data: notificationsData, error: notificationsError }
  ] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name, parent_client_id, created_at, updated_at, client_categories(code), client_flags(flag_definitions(code))')
      .order('name', { ascending: true }),
    supabase.from('contracts').select('client_id'),
    supabase.from('client_opportunities').select('client_id, status'),
    supabase.from('notifications').select('client_id, is_resolved')
  ]);

  const contractsByClient = new Map<string, number>();
  if (!contractsError && Array.isArray(contractsData)) {
    for (const row of contractsData) {
      const current = contractsByClient.get(row.client_id) ?? 0;
      contractsByClient.set(row.client_id, current + 1);
    }
  }

  const opportunitiesByClient = new Map<string, number>();
  if (!opportunitiesError && Array.isArray(opportunitiesData)) {
    for (const row of opportunitiesData) {
      const status = row.status as string | null;
      if (status && status !== 'won' && status !== 'lost') {
        const current = opportunitiesByClient.get(row.client_id) ?? 0;
        opportunitiesByClient.set(row.client_id, current + 1);
      }
    }
  }

  const alertsByClient = new Map<string, number>();
  if (!notificationsError && Array.isArray(notificationsData)) {
    for (const row of notificationsData) {
      if (!row.is_resolved) {
        const current = alertsByClient.get(row.client_id) ?? 0;
        alertsByClient.set(row.client_id, current + 1);
      }
    }
  }

  const baseClients =
    clientsError || !Array.isArray(clientsData)
      ? mockClients
      : clientsData.map((row) =>
          mapClientRow({
            ...row,
            has_contract: (contractsByClient.get(row.id) ?? 0) > 0,
            open_opportunities: opportunitiesByClient.get(row.id) ?? 0,
            open_alerts: alertsByClient.get(row.id) ?? 0
          } as Record<string, any>)
        );

  const basicFilteredClients = filterClients(baseClients, filters);

  const matchingMachineClientIds = await getClientIdsMatchingMachineFilters(filters.machineFilters ?? {});
  if (!matchingMachineClientIds) {
    return basicFilteredClients;
  }

  return basicFilteredClients.filter((client) => matchingMachineClientIds.has(client.id));
});

export const getClientHierarchy = cache(async (filters: ClientFilterInput = {}): Promise<ClientHierarchyNode[]> => {
  const clients = await getClients(filters);
  return buildClientHierarchy(clients);
});

export const getClientById = cache(async (id: string): Promise<ClientWithRelations | null> => {
  const clients = await getClients({});
  const current = clients.find((item) => item.id === id);

  if (!current) {
    return null;
  }

  const parent = clients.find((item) => item.id === current.parentClientId);
  const subClients = clients
    .filter((item) => item.parentClientId === current.id)
    .map((item) => ({ id: item.id, name: item.name, city: item.city, flag: item.flag }));

  const supabase = await createSupabaseServerClient();
  const { data: contactsData, error: contactsError } = await supabase
    .from('client_contacts')
    .select('*')
    .eq('client_id', current.id)
    .order('is_primary', { ascending: false });

  const contacts =
    contactsError || !Array.isArray(contactsData)
      ? mockContacts.filter((contact) => contact.clientId === current.id)
      : contactsData.map((contact) => ({
          id: contact.id,
          clientId: contact.client_id,
          firstName: contact.first_name,
          lastName: contact.last_name,
          email: contact.email ?? null,
          phone: contact.phone ?? null,
          role: 'other' as const,
          isPrimary: contact.is_primary ?? false,
          createdAt: contact.created_at,
          updatedAt: contact.updated_at
        }));

  return {
    ...current,
    parent: parent ? { id: parent.id, name: parent.name } : null,
    subClients,
    contacts
  };
});

export const getClientParentOptions = cache(async (): Promise<Array<{ id: string; name: string }>> => {
  const clients = await getClients({});
  return clients.map((client) => ({ id: client.id, name: client.name }));
});