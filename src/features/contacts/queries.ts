import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Contact } from '@/types/contact';

const fallbackContacts: Contact[] = [];

export const getContactsByClientId = cache(async (clientId: string): Promise<Contact[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('client_id', clientId)
    .order('is_primary', { ascending: false });

  if (error || !data) {
    return fallbackContacts;
  }

  return data as Contact[];
});
