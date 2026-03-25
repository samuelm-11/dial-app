export type SettingScope = 'admin' | 'manager';

export type ClientCategorySetting = {
  id: string;
  code: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FlagSetting = {
  id: string;
  code: string;
  label: string;
  colorHex: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MachineCategorySetting = {
  id: string;
  code: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MachineTypeSetting = {
  id: string;
  machineCategoryId: string;
  code: string;
  label: string;
  requiresFilterChange: boolean;
  filterLifespanDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationRuleCode =
  | 'contract_end_6m'
  | 'contract_end_3m'
  | 'contract_end_1m'
  | 'filter_change_due'
  | 'filter_change_30d';

export type NotificationRuleSetting = {
  id: string;
  code: NotificationRuleCode;
  label: string;
  daysBeforeDue: number;
  notificationType: 'contract_end' | 'filter_change';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
