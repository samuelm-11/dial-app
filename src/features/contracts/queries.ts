import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { filterContracts, toContractsEndingSoon } from '@/features/contracts/helpers';
import { contractFilterSchema } from '@/features/contracts/schemas';
import type { Contract, ContractEndingSoon, ContractFilterInput } from '@/types/contract';

function mapContractRow(row: any): Contract {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
  const categoryCode = client?.client_categories?.code ?? null;
  const firstClientFlag = Array.isArray(client?.client_flags) ? client.client_flags[0] : null;
  const flagCode = firstClientFlag?.flag_definitions?.code ?? null;

  return {
    id: row.id,
    clientId: row.client_id,
    clientName: client?.name ?? 'Client',
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    privatePdfPath: row.private_pdf_path ?? null,
    autoRenewal: Boolean(row.auto_renewal ?? false),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    clientPostalCode: client?.postal_code ?? null,
    clientCity: client?.city ?? null,
    clientCategory: ['enterprise', 'sme', 'public', 'franchise', 'other'].includes(categoryCode) ? categoryCode : null,
    clientFlag: ['vip', 'risk', 'watch', 'none'].includes(flagCode) ? flagCode : null
  };
}

export const getContracts = cache(async (filters: ContractFilterInput = {}): Promise<Contract[]> => {
  const parsedFilters = contractFilterSchema.safeParse(filters);
  const payload = parsedFilters.success ? parsedFilters.data : {};
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('contracts')
    .select('id, client_id, title, start_date, end_date, private_pdf_path, created_at, updated_at, clients(name, client_categories(code), client_flags(flag_definitions(code)))')
    .order('end_date', { ascending: true });

  const source = error || !Array.isArray(data) ? [] : data.map(mapContractRow);
  return filterContracts(source, payload);
});

export const getClientContracts = cache(async (clientId: string): Promise<Contract[]> => {
  const contracts = await getContracts({});
  return contracts.filter((contract) => contract.clientId === clientId);
});

export const getContractsEndingSoon = cache(async (days: 30 | 90 | 180 = 90): Promise<ContractEndingSoon[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('v_contracts_ending_soon')
    .select('id, client_id, client_name, title, end_date, days_remaining')
    .lte('days_remaining', days)
    .order('days_remaining', { ascending: true });

  if (!error && data) {
    return data.map((row: any) => ({
      id: row.id,
      clientId: row.client_id,
      clientName: row.client_name,
      title: row.title,
      endDate: row.end_date,
      daysRemaining: Number(row.days_remaining)
    }));
  }

  const contracts = await getContracts({ endingInDays: days });
  return toContractsEndingSoon(contracts);
});

export const getClientsWithoutContractPdf = cache(async (): Promise<Contract[]> => {
  const contracts = await getContracts({ hasPdf: false });
  return contracts;
});
