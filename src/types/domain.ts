export type ClientCategory = {
  id: string;
  label: string;
  code: string;
  createdAt: string;
  updatedAt: string;
};

export type Client = {
  id: string;
  name: string;
  categoryId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Flag = {
  id: string;
  code: string;
  label: string;
  colorHex: string;
  createdAt: string;
  updatedAt: string;
};

export type MachineCategory = {
  id: string;
  code: string;
  label: string;
  createdAt: string;
  updatedAt: string;
};

export type MachineType = {
  id: string;
  code: string;
  label: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientMachine = {
  id: string;
  clientId: string;
  machineTypeId: string;
  serialNumber: string | null;
  installationDate: string | null;
  nextFilterChangeDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Contract = {
  id: string;
  clientId: string;
  title: string;
  startDate: string;
  endDate: string;
  privatePdfPath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Opportunity = {
  id: string;
  clientId: string;
  title: string;
  status: 'open' | 'won' | 'lost';
  expectedCloseDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Alert = {
  id: string;
  type: 'contract_end' | 'filter_change';
  clientId: string;
  machineId: string | null;
  dueDate: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
};
