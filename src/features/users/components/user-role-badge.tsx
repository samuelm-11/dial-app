import type { UserRole } from '@/types/auth';

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  viewer: 'Lecture'
};

const roleClasses: Record<UserRole, string> = {
  admin: 'bg-rose-100 text-rose-700',
  manager: 'bg-blue-100 text-blue-700',
  viewer: 'bg-slate-200 text-slate-700'
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  return <span className={`rounded px-2 py-1 text-xs font-medium ${roleClasses[role]}`}>{roleLabels[role]}</span>;
}
