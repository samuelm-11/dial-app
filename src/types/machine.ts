export type MachineStatus = 'active' | 'inactive' | 'maintenance';

export type MachineCategory = {
  id: string;
  code: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MachineType = {
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

export type ClientMachine = {
  id: string;
  clientId: string;
  machineTypeId: string;
  machineTypeLabel: string;
  machineCategoryId: string;
  machineCategoryLabel: string;
  quantity: number;
  installationDate: string | null;
  status: MachineStatus;
  lastFilterChangeDate: string | null;
  nextFilterChangeDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateClientMachineInput = {
  machineTypeId: string;
  quantity: number;
  installationDate?: string | null;
  status?: MachineStatus;
  lastFilterChangeDate?: string | null;
  notes?: string | null;
};

export type UpdateClientMachineInput = Partial<CreateClientMachineInput>;

export type MachineFilterInput = {
  machineCategoryIds?: string[];
  machineTypeIds?: string[];
  hasHotDrinks?: boolean;
  hasCandy?: boolean;
  withoutWaterFountain?: boolean;
  withFiltersDueSoon?: boolean;
};
