import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Client, ClientFilterInput, ClientHierarchyNode, ClientWithRelations } from '@/types/client';
import type { Contact } from '@/types/contact';
import { buildClientHierarchy, filterClients } from '@/features/clients/helpers';

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

export const getClients = cache(async (filters: ClientFilterInput = {}): Promise<Client[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('clients').select('*').order('name', { ascending: true });

  if (error || !data) {
    return filterClients(mockClients, filters);
  }

  return filterClients(data as Client[], filters);
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

  const contacts = mockContacts.filter((contact) => contact.clientId === current.id);

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
