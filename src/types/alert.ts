export type AlertType = 'contract_end' | 'filter_change';

export type AlertStatus = 'open' | 'done' | 'dismissed';

export type AlertDueBucket = 'urgent' | 'upcoming' | 'later';

export type Alert = {
  id: string;
  type: AlertType;
  status: AlertStatus;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientPostalCode: string | null;
  machineId: string | null;
  machineTypeLabel: string | null;
  machineTypeCode: string | null;
  contractId: string | null;
  contractTitle: string | null;
  dueDate: string;
  daysRemaining: number;
  dueBucket: AlertDueBucket;
  createdAt: string;
  updatedAt: string;
};

export type AlertFilterInput = {
  type?: AlertType[];
  status?: AlertStatus[];
  dueBucket?: AlertDueBucket[];
  dueWithinDays?: number;
  clientId?: string;
  postalCode?: string;
  machineType?: string;
};
