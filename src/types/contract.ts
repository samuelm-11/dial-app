import type { ClientCategoryCode, ClientFlagCode } from '@/types/client';

export type Contract = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  startDate: string;
  endDate: string;
  templateId: string | null;
  generatedContent: string | null;
  privatePdfPath: string | null;
  autoRenewal: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  clientPostalCode: string | null;
  clientCity: string | null;
  clientCategory: ClientCategoryCode | null;
  clientFlag: ClientFlagCode | null;
};

export type ContractFilterInput = {
  endingInDays?: 30 | 90 | 180;
  hasPdf?: boolean;
  autoRenewal?: boolean;
  postalCode?: string;
  city?: string;
  categories?: ClientCategoryCode[];
  flags?: ClientFlagCode[];
};

export type ContractEndingSoon = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  endDate: string;
  daysRemaining: number;
};

export type ContractTemplate = {
  id: string;
  name: string;
  description: string | null;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateContractInput = {
  clientId: string;
  title: string;
  startDate: string;
  endDate: string;
  autoRenewal?: boolean;
  templateId?: string | null;
  generatedContent?: string | null;
};

export type UpdateContractInput = Partial<Omit<CreateContractInput, 'clientId'>>;

export type CreateContractTemplateInput = {
  name: string;
  description?: string | null;
  content: string;
  isActive?: boolean;
};

export type UpdateContractTemplateInput = Partial<CreateContractTemplateInput>;

export type GenerateContractInput = {
  clientId: string;
  templateId: string;
  title: string;
  startDate: string;
  endDate: string;
  autoRenewal?: boolean;
};
