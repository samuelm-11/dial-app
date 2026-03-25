'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseBoolean, normalizeText } from '@/features/imports/helpers';
import { runImportPayloadSchema, type ImportExecutionResult, type MappedImportRow } from '@/features/imports/schemas';

async function findClientIdByName(clientName: string, supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data } = await supabase
    .from('clients')
    .select('id, name')
    .ilike('name', clientName)
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}

async function importClient(row: MappedImportRow, result: ImportExecutionResult, supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const name = normalizeText(row.values.name);
  const city = normalizeText(row.values.city);

  const { data: existing } = await supabase
    .from('clients')
    .select('id')
    .ilike('name', name)
    .ilike('city', city)
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    result.skippedDuplicates += 1;
    return;
  }

  const parentClientId = row.values.parentClientName ? await findClientIdByName(row.values.parentClientName, supabase) : null;

  const { error } = await supabase.from('clients').insert({
    name,
    city,
    postal_code: normalizeText(row.values.postalCode) || null,
    country: normalizeText(row.values.country) || 'France',
    address: normalizeText(row.values.address) || '-',
    parent_client_id: parentClientId,
    category: normalizeText(row.values.category).toLowerCase() || 'other',
    flag: normalizeText(row.values.flag).toLowerCase() || 'none'
  });

  if (error) {
    throw new Error(error.message);
  }

  result.created.clients += 1;
}

async function importContact(row: MappedImportRow, result: ImportExecutionResult, supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const clientId = await findClientIdByName(normalizeText(row.values.clientName), supabase);
  if (!clientId) {
    throw new Error('Client introuvable pour ce contact.');
  }

  const email = normalizeText(row.values.email) || null;

  if (email) {
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('client_id', clientId)
      .ilike('email', email)
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      result.skippedDuplicates += 1;
      return;
    }
  }

  if (parseBoolean(row.values.isPrimary)) {
    await supabase.from('contacts').update({ is_primary: false }).eq('client_id', clientId);
  }

  const { error } = await supabase.from('contacts').insert({
    client_id: clientId,
    first_name: normalizeText(row.values.firstName),
    last_name: normalizeText(row.values.lastName),
    email,
    phone: normalizeText(row.values.phone) || null,
    role: normalizeText(row.values.role).toLowerCase() || 'other',
    is_primary: parseBoolean(row.values.isPrimary)
  });

  if (error) {
    throw new Error(error.message);
  }

  result.created.contacts += 1;
}

async function importMachine(row: MappedImportRow, result: ImportExecutionResult, supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const clientId = await findClientIdByName(normalizeText(row.values.clientName), supabase);
  if (!clientId) {
    throw new Error('Client introuvable pour cette machine.');
  }

  const machineTypeCode = normalizeText(row.values.machineTypeCode).toLowerCase();
  const { data: machineType } = await supabase.from('machine_types').select('id').ilike('code', machineTypeCode).limit(1).maybeSingle();

  if (!machineType?.id) {
    throw new Error('Type de machine introuvable.');
  }

  const { data: existing } = await supabase
    .from('client_machines')
    .select('id')
    .eq('client_id', clientId)
    .eq('machine_type_id', machineType.id)
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    result.skippedDuplicates += 1;
    return;
  }

  const { error } = await supabase.from('client_machines').insert({
    client_id: clientId,
    machine_type_id: machineType.id,
    quantity: Number(row.values.quantity ?? 1),
    status: 'active'
  });

  if (error) {
    throw new Error(error.message);
  }

  result.created.machines += 1;
}

async function importContract(row: MappedImportRow, result: ImportExecutionResult, supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const clientId = await findClientIdByName(normalizeText(row.values.clientName), supabase);
  if (!clientId) {
    throw new Error('Client introuvable pour ce contrat.');
  }

  const title = normalizeText(row.values.title);

  const { data: existing } = await supabase
    .from('contracts')
    .select('id')
    .eq('client_id', clientId)
    .ilike('title', title)
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    result.skippedDuplicates += 1;
    return;
  }

  const { error } = await supabase.from('contracts').insert({
    client_id: clientId,
    title,
    start_date: row.values.startDate,
    end_date: row.values.endDate,
    auto_renewal: parseBoolean(row.values.autoRenewal)
  });

  if (error) {
    throw new Error(error.message);
  }

  result.created.contracts += 1;
}

export async function runImport(payload: unknown): Promise<ImportExecutionResult> {
  const parsed = runImportPayloadSchema.parse(payload);
  const supabase = await createSupabaseServerClient();

  const result: ImportExecutionResult = {
    created: { clients: 0, contacts: 0, machines: 0, contracts: 0 },
    skippedDuplicates: 0,
    failed: 0,
    errors: []
  };

  for (const row of parsed.rows) {
    try {
      if (row.entity === 'clients') {
        await importClient(row, result, supabase);
      } else if (row.entity === 'contacts') {
        await importContact(row, result, supabase);
      } else if (row.entity === 'machines') {
        await importMachine(row, result, supabase);
      } else {
        await importContract(row, result, supabase);
      }
    } catch (error) {
      result.failed += 1;
      result.errors.push({
        lineNumber: row.lineNumber,
        entity: row.entity,
        message: error instanceof Error ? error.message : 'Erreur import inconnue'
      });
    }
  }

  revalidatePath('/imports');
  revalidatePath('/clients');
  revalidatePath('/contracts');

  return result;
}
