export type ContactRole = 'manager' | 'billing' | 'technical' | 'other';

export type Contact = {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: ContactRole;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateContactInput = {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  role: ContactRole;
  isPrimary?: boolean;
};

export type UpdateContactInput = Partial<CreateContactInput>;
