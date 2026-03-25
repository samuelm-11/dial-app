export const userRoleValues = ['admin', 'manager', 'viewer'] as const;

export type UserRole = (typeof userRoleValues)[number];

export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
