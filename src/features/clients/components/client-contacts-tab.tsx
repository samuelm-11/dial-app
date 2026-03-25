import { ContactList } from '@/features/contacts/components/contact-list';
import type { ClientWithRelations } from '@/types/client';

export function ClientContactsTab({ client }: { client: ClientWithRelations }) {
  return <ContactList contacts={client.contacts} clientId={client.id} />;
}
