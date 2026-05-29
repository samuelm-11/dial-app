import { cache } from 'react';
import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import type { Client, ClientFilterInput, ClientWithRelations } from '@/types/client';
import type { Contact } from '@/types/contact';
import { filterClients } from '@/features/clients/helpers';
import { getClientIdsMatchingMachineFilters } from '@/features/machines/queries';

function toClientCategoryCode(value: string | null | undefined): Client['category'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'enterprise' || normalized === 'sme' || normalized === 'public' || normalized === 'franchise') {
    return normalized;
  }
  return 'other';
}

function toClientFlagCode(value: string | null | undefined): Client['flag'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'vip' || normalized === 'risk' || normalized === 'watch') {
    return normalized;
  }
  return 'none';
}

function toContactRole(value: string | null | undefined): Contact['role'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'manager' || normalized === 'billing' || normalized === 'technical') {
    return normalized;
  }
  return 'other';
}

function mapClientRow(row: Record<string, any>): Client {
  const contracts = Array.isArray(row.contracts) ? row.contracts : [];
  const opportunities = Array.isArray(row.client_opportunities) ? row.client_opportunities : [];
  const notifications = Array.isArray(row.notifications) ? row.notifications : [];
  return {
    id: row.id,
    name: row.name ?? 'Client sans nom',
    category: toClientCategoryCode(row.category),
    flag: toClientFlagCode(row.flag),
    address: row.address ?? [row.address_line_1, row.address_line_2].filter(Boolean).join(', '),
    postalCode: row.postal_code ?? row.postalCode ?? '',
    city: row.city ?? '',
    country: row.country ?? '',
    installationDate: row.installation_date ?? row.installationDate ?? null,
    improvementNotes: row.improvement_notes ?? row.improvementNotes ?? null,
    internalNotes: row.internal_notes ?? row.internalNotes ?? null,
    hasContract: contracts.length > 0,
    openOpportunities: opportunities.filter((item) => item?.status !== 'won' && item?.status !== 'lost').length,
    openAlerts: notifications.filter((item) => item?.status === 'open').length,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString()
  };
}

export const getClients = cache(async (filters: ClientFilterInput = {}): Promise<Client[]> => {
  const supabase = await createSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*, contracts(id), client_opportunities(id, status), notifications(id, status)')
    .order('name', { ascending: true });

  const baseClients = error || !Array.isArray(data) ? [] : data.map((row) => mapClientRow(row as Record<string, any>));
  const basicFilteredClients = filterClients(baseClients, filters);

  const matchingMachineClientIds = await getClientIdsMatchingMachineFilters(filters.machineFilters ?? {});
  if (!matchingMachineClientIds) {
    return basicFilteredClients;
  }

  return basicFilteredClients.filter((client) => matchingMachineClientIds.has(client.id));
});

export const getClientById = cache(async (id: string): Promise<ClientWithRelations | null> => {
  const [clients, supabase] = await Promise.all([getClients({}), createSupabaseServerComponentClient()]);
  const current = clients.find((item: Client) => item.id === id);

  if (!current) {
    return null;
  }

  const { data: contactsRows, error } = await supabase
    .from('contacts')
    .select('id, client_id, first_name, last_name, role, email, phone, is_primary, created_at, updated_at')
    .eq('client_id', current.id)
    .order('is_primary', { ascending: false });

  const contacts: Contact[] = error || !Array.isArray(contactsRows)
    ? []
    : contactsRows.map((row) => {
        return {
          id: row.id,
          clientId: row.client_id,
          firstName: row.first_name || 'Contact',
          lastName: row.last_name || 'Sans nom',
          email: row.email ?? null,
          phone: row.phone ?? null,
          role: toContactRole(row.role),
          isPrimary: Boolean(row.is_primary),
          createdAt: row.created_at ?? new Date().toISOString(),
          updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString()
        };
      });

  return {
    ...current,
    contacts
  };
});

export const getClientOptions = cache(async (): Promise<Array<{ id: string; name: string }>> => {
  const clients = await getClients({});
  return clients.map((client) => ({ id: client.id, name: client.name }));
});
