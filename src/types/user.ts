import type { UserRole } from '@/types/auth';

export type UserStatus = 'active' | 'inactive';

export type UserListItem = {
  id: string;
  fullName: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserAccountSummary = {
  id: string;
  fullName: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
};
