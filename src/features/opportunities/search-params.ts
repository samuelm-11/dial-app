import type { ClientFlagCode } from '@/types/client';
import type { OpportunityFilterInput, OpportunityPriority, OpportunityStatus } from '@/types/opportunity';

export function getOpportunityFiltersFromSearchParams(searchParams: Record<string, string | string[] | undefined>): OpportunityFilterInput {
  const asString = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const toNumber = (value: string | undefined) => {
    if (!value) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const status = asString(searchParams.status);
  const priority = asString(searchParams.priority);
  const machineCategoryId = asString(searchParams.machineCategoryId);
  const flag = asString(searchParams.flag);

  return {
    statuses: status ? [status as OpportunityStatus] : undefined,
    priorities: priority ? [priority as OpportunityPriority] : undefined,
    linkedMachineCategoryIds: machineCategoryId ? [machineCategoryId] : undefined,
    clientId: asString(searchParams.clientId),
    postalCode: asString(searchParams.postalCode),
    clientFlags: flag ? [flag as ClientFlagCode] : undefined,
    estimatedValueMin: toNumber(asString(searchParams.valueMin)),
    estimatedValueMax: toNumber(asString(searchParams.valueMax)),
    probabilityMin: toNumber(asString(searchParams.probabilityMin)),
    probabilityMax: toNumber(asString(searchParams.probabilityMax))
  };
}
