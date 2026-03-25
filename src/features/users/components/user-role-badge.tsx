import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types/auth';

const roleConfig: Record<UserRole, { label: string; tone: 'danger' | 'info' | 'neutral' }> = {
  admin: { label: 'Admin', tone: 'danger' },
  manager: { label: 'Manager', tone: 'info' },
  viewer: { label: 'Lecture', tone: 'neutral' }
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  return <Badge label={roleConfig[role].label} tone={roleConfig[role].tone} rounded="soft" />;
}
