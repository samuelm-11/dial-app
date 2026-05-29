import type { ClientCategoryCode, ClientFlagCode, ClientFilterInput } from '@/types/client';

export function getFiltersFromSearchParams(searchParams: Record<string, string | string[] | undefined>): ClientFilterInput {
  const asString = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

  const category = asString(searchParams.category);
  const flag = asString(searchParams.flag);

  const toBoolean = (value: string | undefined) => (value === undefined ? undefined : value === '1');

  const machineCategoryId = asString(searchParams.machineCategoryId);
  const machineTypeId = asString(searchParams.machineTypeId);

  return {
    name: asString(searchParams.name),
    postalCode: asString(searchParams.postalCode),
    city: asString(searchParams.city),
    categories: category ? [category as ClientCategoryCode] : undefined,
    flags: flag ? [flag as ClientFlagCode] : undefined,
    hasContract: toBoolean(asString(searchParams.hasContract)),
    hasOpenOpportunities: toBoolean(asString(searchParams.hasOpenOpportunities)),
    hasOpenAlerts: toBoolean(asString(searchParams.hasOpenAlerts)),
    machineFilters: {
      machineCategoryIds: machineCategoryId ? [machineCategoryId] : undefined,
      machineTypeIds: machineTypeId ? [machineTypeId] : undefined,
      hasHotDrinks: toBoolean(asString(searchParams.hasHotDrinks)),
      hasCandy: toBoolean(asString(searchParams.hasCandy)),
      withoutWaterFountain: toBoolean(asString(searchParams.withoutWaterFountain)),
      withFiltersDueSoon: toBoolean(asString(searchParams.withFiltersDueSoon))
    }
  };
}
