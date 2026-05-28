import type { Contact } from '@/types/contact';

export type ClientFlagCode = 'vip' | 'risk' | 'watch' | 'none';

export type ClientCategoryCode = 'enterprise' | 'sme' | 'public' | 'franchise' | 'other';

export type Client = {
  id: string;
  name: string;
  category: ClientCategoryCode;
  flag: ClientFlagCode;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  installationDate: string | null;
  improvementNotes: string | null;
  internalNotes: string | null;
  hasContract: boolean;
  openOpportunities: number;
  openAlerts: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientWithRelations = Client & {
  contacts: Contact[];
};

export type ClientFilterInput = {
  name?: string;
  postalCode?: string;
  city?: string;
  categories?: ClientCategoryCode[];
  flags?: ClientFlagCode[];
  hasContract?: boolean;
  hasOpenOpportunities?: boolean;
  hasOpenAlerts?: boolean;
  machineFilters?: {
    machineCategoryIds?: string[];
    machineTypeIds?: string[];
    hasHotDrinks?: boolean;
    hasCandy?: boolean;
    withoutWaterFountain?: boolean;
    withFiltersDueSoon?: boolean;
  };
};

export type CreateClientInput = {
  name: string;
  category: ClientCategoryCode;
  flag: ClientFlagCode;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  installationDate?: string | null;
  improvementNotes?: string | null;
  internalNotes?: string | null;
  initialPrimaryContact?: {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
  };
};

export type UpdateClientInput = Partial<Omit<CreateClientInput, 'initialPrimaryContact'>>;
