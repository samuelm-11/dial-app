import type { ClientCategoryCode, ClientFlagCode } from '@/types/client';
import type { ContractFilterInput } from '@/types/contract';

export function getContractFiltersFromSearchParams(searchParams: Record<string, string | string[] | undefined>): ContractFilterInput {
  const asString = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const toBoolean = (value: string | undefined) => (value === undefined ? undefined : value === '1');

  const endingParam = asString(searchParams.endingInDays);
  const endingInDays = endingParam ? (Number(endingParam) as 30 | 90 | 180) : undefined;
  const category = asString(searchParams.category);
  const flag = asString(searchParams.flag);

  return {
    endingInDays: endingInDays === 30 || endingInDays === 90 || endingInDays === 180 ? endingInDays : undefined,
    hasPdf: toBoolean(asString(searchParams.hasPdf)),
    autoRenewal: toBoolean(asString(searchParams.autoRenewal)),
    postalCode: asString(searchParams.postalCode),
    city: asString(searchParams.city),
    categories: category ? [category as ClientCategoryCode] : undefined,
    flags: flag ? [flag as ClientFlagCode] : undefined
  };
}
