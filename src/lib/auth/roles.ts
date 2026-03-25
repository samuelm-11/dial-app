import type { UserRole } from '@/types/auth';

const roleWeights: Record<UserRole, number> = {
  viewer: 1,
  manager: 2,
  admin: 3
};

export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole) {
  return roleWeights[userRole] >= roleWeights[requiredRole];
}
