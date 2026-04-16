import { alertStatusValues } from '@/features/alerts/schemas';
import type { AlertDueBucket, AlertFilterInput, AlertType } from '@/types/alert';

export function getAlertFiltersFromSearchParams(searchParams: Record<string, string | string[] | undefined>): AlertFilterInput {
  const asString = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

  const dueWithinDays = asString(searchParams.dueWithinDays);
  const dueWithinParsed = dueWithinDays ? Number(dueWithinDays) : undefined;

  const type = asString(searchParams.type);
  const status = asString(searchParams.status);
  const dueBucket = asString(searchParams.dueBucket);

  return {
    type: type ? [type as AlertType] : undefined,
    status: status ? [status as (typeof alertStatusValues)[number]] : undefined,
    dueBucket: dueBucket ? [dueBucket as AlertDueBucket] : undefined,
    dueWithinDays: dueWithinParsed !== undefined && !Number.isNaN(dueWithinParsed) ? dueWithinParsed : undefined,
    clientId: asString(searchParams.clientId),
    postalCode: asString(searchParams.postalCode),
    machineType: asString(searchParams.machineType)
  };
}
