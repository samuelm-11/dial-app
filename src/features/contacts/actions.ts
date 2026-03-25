'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createContactSchema, updateContactSchema } from '@/features/contacts/schemas';
import type { CreateContactInput, UpdateContactInput } from '@/types/contact';

export async function createContact(clientId: string, input: CreateContactInput) {
  const payload = createContactSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  if (payload.isPrimary) {
    await supabase.from('contacts').update({ is_primary: false }).eq('client_id', clientId);
  }

  const { error } = await supabase.from('contacts').insert({
    client_id: clientId,
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    is_primary: payload.isPrimary ?? false
  });

  if (error) {
    throw new Error(`Erreur création contact: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function updateContact(contactId: string, clientId: string, input: UpdateContactInput) {
  const payload = updateContactSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  if (payload.isPrimary) {
    await supabase.from('contacts').update({ is_primary: false }).eq('client_id', clientId);
  }

  const { error } = await supabase
    .from('contacts')
    .update({
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      is_primary: payload.isPrimary
    })
    .eq('id', contactId);

  if (error) {
    throw new Error(`Erreur mise à jour contact: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function deleteContact(contactId: string, clientId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('contacts').delete().eq('id', contactId);

  if (error) {
    throw new Error(`Erreur suppression contact: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);
}

export async function setPrimaryContact(contactId: string, clientId: string) {
  const supabase = await createSupabaseServerClient();

  await supabase.from('contacts').update({ is_primary: false }).eq('client_id', clientId);
  const { error } = await supabase.from('contacts').update({ is_primary: true }).eq('id', contactId);

  if (error) {
    throw new Error(`Erreur définition contact principal: ${error.message}`);
  }

  revalidatePath(`/clients/${clientId}`);
}
