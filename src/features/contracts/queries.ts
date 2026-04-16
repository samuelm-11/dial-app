import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { filterContracts, toContractsEndingSoon } from '@/features/contracts/helpers';
import { contractFilterSchema } from '@/features/contracts/schemas';
import type { Contract, ContractEndingSoon, ContractFilterInput } from '@/types/contract';

const mockContracts: Contract[] = [
  {
    id: '44f1d7e0-70f8-4af9-9eb7-56f88aa08131',
    clientId: '3f2d8635-a2d7-40ec-a4a2-25d0f4791fbb',
    clientName: 'Groupe Atlantique Distribution',
    title: 'Contrat maintenance premium',
    startDate: '2025-01-01',
    endDate: '2026-04-18',
    privatePdfPath: 'contracts/3f2d8635-a2d7-40ec-a4a2-25d0f4791fbb/44f1d7e0-70f8.pdf',
    autoRenewal: true,
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-11-11T10:00:00.000Z',
    clientPostalCode: '44000',
    clientCity: 'Nantes',
    clientCategory: 'enterprise',
    clientFlag: 'vip'
  },
  {
    id: '6f0d2a2d-821e-467f-b03f-774f1c2f22e3',
    clientId: 'a82f9f13-f2de-47e2-b9c8-7e8f4fef5898',
    clientName: 'Atlantique Distribution - Site Angers',
    title: 'Contrat site secondaire',
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    privatePdfPath: null,
    autoRenewal: false,
    createdAt: '2025-09-01T10:00:00.000Z',
    updatedAt: '2025-11-11T10:00:00.000Z',
    clientPostalCode: '49000',
    clientCity: 'Angers',
    clientCategory: 'sme',
    clientFlag: 'watch'
  }
];

function mapContractRow(row: any): Contract {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
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
    clientCategory: client?.category ?? null,
    clientFlag: client?.flag ?? null
  };
}

export const getContracts = cache(async (filters: ContractFilterInput = {}): Promise<Contract[]> => {
  const parsedFilters = contractFilterSchema.safeParse(filters);
  const payload = parsedFilters.success ? parsedFilters.data : {};
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('contracts')
    .select('*, clients(name, postal_code, city, category, flag)')
    .order('end_date', { ascending: true });

  const source = error || !data ? mockContracts : data.map(mapContractRow);
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
