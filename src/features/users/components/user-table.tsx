import { UserForm } from '@/features/users/components/user-form';
import { UserRoleBadge } from '@/features/users/components/user-role-badge';
import type { UserListItem } from '@/types/user';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

export function UserTable({ users, canManage }: { users: UserListItem[]; canManage: boolean }) {
  if (users.length === 0) {
    return <p className="rounded border border-dashed p-6 text-sm text-slate-500">Aucun utilisateur trouvé.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-600">
            <th className="px-3 py-2">Nom</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Rôle</th>
            <th className="px-3 py-2">Statut</th>
            <th className="px-3 py-2">Création</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 align-top">
              <td className="px-3 py-2 font-medium text-slate-900">{user.fullName ?? '—'}</td>
              <td className="px-3 py-2 text-slate-700">{user.email}</td>
              <td className="px-3 py-2">
                <UserRoleBadge role={user.role} />
              </td>
              <td className="px-3 py-2">
                <span className={`rounded px-2 py-1 text-xs ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-700">{dateFormatter.format(new Date(user.createdAt))}</td>
              <td className="space-y-2 px-3 py-2">
                {canManage ? <UserForm user={user} /> : <p className="text-xs text-slate-500">Lecture seule</p>}
                {canManage ? (
                  <button type="button" disabled className="rounded border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-500">
                    Invitation (bientôt)
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
