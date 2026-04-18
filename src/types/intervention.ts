export const interventionStatusValues = ['planned', 'in_progress', 'done', 'cancelled'] as const;
export type InterventionStatus = (typeof interventionStatusValues)[number];

export const interventionTypeValues = ['depannage', 'maintenance', 'controle', 'installation', 'autre'] as const;
export type InterventionType = (typeof interventionTypeValues)[number];

export type Intervention = {
  id: string;
  clientId: string;
  clientName: string;
  machineId: string | null;
  machineLabel: string | null;
  technicianUserId: string | null;
  technicianUserLabel: string | null;
  technicianName: string | null;
  interventionDate: string;
  startTime: string | null;
  endTime: string | null;
  type: InterventionType;
  status: InterventionStatus;
  title: string;
  description: string;
  diagnosis: string | null;
  actionTaken: string | null;
  photoPath: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateInterventionInput = {
  clientId: string;
  machineId?: string | null;
  technicianUserId?: string | null;
  technicianName?: string | null;
  interventionDate: string;
  startTime?: string | null;
  endTime?: string | null;
  type: InterventionType;
  status: InterventionStatus;
  title: string;
  description: string;
  diagnosis?: string | null;
  actionTaken?: string | null;
  photoPath?: string | null;
  notes?: string | null;
};
