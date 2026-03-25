export type UserRole = 'admin' | 'manager' | 'viewer';

export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
