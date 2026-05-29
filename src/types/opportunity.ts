import type { ClientFlagCode } from '@/types/client';

export type OpportunityStatus = 'open' | 'qualified' | 'proposal' | 'won' | 'lost';

export type OpportunityPriority = 'low' | 'medium' | 'high';

export const competitorCategoryValues = [
  'hot_drinks',
  'snacking',
  'sandwich_catering',
  'cold_drinks',
  'water_fountain',
  'other'
] as const;

export type CompetitorCategory = (typeof competitorCategoryValues)[number];

export type Opportunity = {
  id: string;
  clientId: string | null;
  clientName: string | null;
  prospectName: string;
  prospectContactName: string | null;
  prospectEmail: string | null;
  prospectPhone: string | null;
  prospectAddress: string | null;
  prospectPostalCode: string | null;
  prospectCity: string | null;
  prospectCountry: string | null;
  title: string;
  description: string | null;
  linkedMachineCategoryId: string | null;
  linkedMachineCategoryLabel: string | null;
  priority: OpportunityPriority;
  status: OpportunityStatus;
  estimatedValue: number | null;
  probability: number | null;
  yearlyRevenue: number | null;
  employeeCount: number | null;
  totalMachineCount: number | null;
  machineCountsByCategory: Record<string, number>;
  incumbentCompetitorName: string | null;
  incumbentCompetitorCategory: CompetitorCategory | null;
  competitorContractEndDate: string | null;
  notes: string | null;
  clientPostalCode: string | null;
  clientFlag: ClientFlagCode | null;
  createdAt: string;
  updatedAt: string;
};

export type OpportunityFilterInput = {
  query?: string;
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
  clientId?: string | null;
  prospectName: string;
  prospectContactName?: string | null;
  prospectEmail?: string | null;
  prospectPhone?: string | null;
  prospectAddress?: string | null;
  prospectPostalCode?: string | null;
  prospectCity?: string | null;
  prospectCountry?: string | null;
  title: string;
  description?: string | null;
  linkedMachineCategoryId?: string | null;
  priority: OpportunityPriority;
  status?: OpportunityStatus;
  estimatedValue?: number | null;
  probability?: number | null;
  yearlyRevenue?: number | null;
  employeeCount?: number | null;
  totalMachineCount?: number | null;
  machineCountsByCategory?: Record<string, number>;
  incumbentCompetitorName?: string | null;
  incumbentCompetitorCategory?: CompetitorCategory | null;
  competitorContractEndDate?: string | null;
  notes?: string | null;
};

export type UpdateOpportunityInput = Partial<Omit<CreateOpportunityInput, 'clientId'>>;
