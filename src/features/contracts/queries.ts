import { cache } from 'react';
import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import { filterContracts, toContractsEndingSoon } from '@/features/contracts/helpers';
import { contractFilterSchema } from '@/features/contracts/schemas';
import type { Contract, ContractEndingSoon, ContractFilterInput } from '@/types/contract';
import { seedFakeData } from '@/lib/fake-data';

function toClientCategoryCode(value: string | null | undefined): Contract['clientCategory'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'enterprise' || normalized === 'sme' || normalized === 'public' || normalized === 'franchise') {
    return normalized;
  }
  return null;
}

function toClientFlagCode(value: string | null | undefined): Contract['clientFlag'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'vip' || normalized === 'risk' || normalized === 'watch' || normalized === 'none') {
    return normalized;
  }
  return null;
}

function mapContractRow(row: any): Contract {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
  const category = Array.isArray(client?.client_categories) ? client.client_categories[0] : client?.client_categories;
  const flag = Array.isArray(client?.flag_definitions) ? client.flag_definitions[0] : client?.flag_definitions;
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: client?.name ?? 'Client',
    title: row.title ?? row.pdf_filename ?? 'Contrat',
    startDate: row.start_date,
    endDate: row.end_date,
    privatePdfPath: row.private_pdf_path ?? row.pdf_path ?? null,
    autoRenewal: Boolean(row.auto_renewal ?? row.auto_renew ?? false),
    notes: row.notes ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    clientPostalCode: client?.postal_code ?? null,
    clientCity: client?.city ?? null,
    clientCategory: toClientCategoryCode(category?.name),
    clientFlag: toClientFlagCode(flag?.code)
  };
}

export const getContracts = cache(async (filters: ContractFilterInput = {}): Promise<Contract[]> => {
  const parsedFilters = contractFilterSchema.safeParse(filters);
  const payload = parsedFilters.success ? parsedFilters.data : {};
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from('contracts')
    .select('*, clients(name, postal_code, city, client_categories(name), flag_definitions(code))')
    .order('end_date', { ascending: true });

  const source = error || !Array.isArray(data) || data.length === 0 ? seedFakeData().contracts : data.map(mapContractRow);
  return filterContracts(source, payload);
});

export const getClientContracts = cache(async (clientId: string): Promise<Contract[]> => {
  const contracts = await getContracts({});
  return contracts.filter((contract) => contract.clientId === clientId);
});

export const getContractsEndingSoon = cache(async (days: 30 | 90 | 180 = 90): Promise<ContractEndingSoon[]> => {
  const contracts = await getContracts({ endingInDays: days });
  return toContractsEndingSoon(contracts);
});

export const getClientsWithoutContractPdf = cache(async (): Promise<Contract[]> => {
  const contracts = await getContracts({ hasPdf: false });
  return contracts;
});
