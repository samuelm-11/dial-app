'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { clientFormSchema, clientUpdateSchema } from '@/features/clients/schemas';
import type { CreateClientInput, UpdateClientInput } from '@/types/client';

export async function createClient(input: CreateClientInput) {
  const payload = clientFormSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('clients').insert({
    name: payload.name,
    parent_client_id: payload.parentClientId ?? null,
    category: payload.category,
    flag: payload.flag,
    address: payload.address,
    postal_code: payload.postalCode,
    city: payload.city,
    country: payload.country,
    installation_date: payload.installationDate,
    improvement_notes: payload.improvementNotes,
    internal_notes: payload.internalNotes
  });

  if (error) {
    throw new Error(`Erreur création client: ${error.message}`);
  }

  revalidatePath('/clients');
}

export async function updateClient(clientId: string, input: UpdateClientInput) {
  const payload = clientUpdateSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('clients')
    .update({
      name: payload.name,
      parent_client_id: payload.parentClientId,
      category: payload.category,
      flag: payload.flag,
      address: payload.address,
      postal_code: payload.postalCode,
      city: payload.city,
      country: payload.country,
      installation_date: payload.installationDate,
      improvement_notes: payload.improvementNotes,
      internal_notes: payload.internalNotes
    })
    .eq('id', clientId);

  if (error) {
    throw new Error(`Erreur mise à jour client: ${error.message}`);
  }

  revalidatePath('/clients');
  revalidatePath(`/clients/${clientId}`);
}

export async function createSubClient(parentClientId: string, input: CreateClientInput) {
  return createClient({
    ...input,
    parentClientId
  });
}
