'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth, requireRole } from '@/lib/auth/guards';
import { createSupabaseServerActionClient } from '@/lib/supabase/server';
import { inviteUserSchema, userUpdateSchema, type InviteUserValues, type UserUpdateValues } from '@/features/users/schemas';
import type { UserInvitationPlaceholder } from '@/types/user';

async function assertAdminAccess() {
  await requireRole('admin');
}

export async function updateUser(userId: string, input: UserUpdateValues) {
  const currentProfile = await requireAuth();
  await assertAdminAccess();

  const payload = userUpdateSchema.parse(input);

  if (currentProfile.id === userId && !payload.isActive) {
    throw new Error('Vous ne pouvez pas désactiver votre propre compte.');
  }

  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.from('profiles').update({ role: payload.role, is_active: payload.isActive }).eq('id', userId);

  if (error) {
    throw new Error(`Erreur mise à jour utilisateur: ${error.message}`);
  }

  revalidatePath('/users');
}

export async function inviteUserPlaceholder(input: InviteUserValues): Promise<UserInvitationPlaceholder> {
  await assertAdminAccess();
  const payload = inviteUserSchema.parse(input);

  return {
    status: 'pending_integration' as const,
    email: payload.email
  };
}
