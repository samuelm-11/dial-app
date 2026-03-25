import type { ClientFlagCode } from '@/types/client';

export type OpportunityStatus = 'open' | 'qualified' | 'proposal' | 'won' | 'lost';

export type OpportunityPriority = 'low' | 'medium' | 'high';

export type Opportunity = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string | null;
  linkedMachineCategoryId: string | null;
  linkedMachineCategoryLabel: string | null;
  priority: OpportunityPriority;
  status: OpportunityStatus;
  estimatedValue: number | null;
  probability: number | null;
  clientPostalCode: string | null;
  clientFlag: ClientFlagCode | null;
  createdAt: string;
  updatedAt: string;
};

export type OpportunityFilterInput = {
  statuses?: OpportunityStatus[];
  priorities?: OpportunityPriority[];
  linkedMachineCategoryIds?: string[];
  clientId?: string;
  postalCode?: string;
  clientFlags?: ClientFlagCode[];
  estimatedValueMin?: number;
  estimatedValueMax?: number;
  probabilityMin?: number;
  probabilityMax?: number;
};

export type CreateOpportunityInput = {
  clientId: string;
  title: string;
  description?: string | null;
  linkedMachineCategoryId?: string | null;
  priority: OpportunityPriority;
  status?: OpportunityStatus;
  estimatedValue?: number | null;
  probability?: number | null;
};

export type UpdateOpportunityInput = Partial<Omit<CreateOpportunityInput, 'clientId'>>;
