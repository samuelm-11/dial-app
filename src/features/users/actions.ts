'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth/guards';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { inviteUserSchema, userUpdateSchema, type InviteUserValues, type UserUpdateValues } from '@/features/users/schemas';

async function assertAdminAccess() {
  await requireRole('admin');
}

export async function updateUser(userId: string, input: UserUpdateValues) {
  await assertAdminAccess();
  const payload = userUpdateSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('profiles').update({ role: payload.role, is_active: payload.isActive }).eq('id', userId);

  if (error) {
    throw new Error(`Erreur mise à jour utilisateur: ${error.message}`);
  }

  revalidatePath('/users');
}

export async function inviteUserPlaceholder(input: InviteUserValues) {
  await assertAdminAccess();
  inviteUserSchema.parse(input);

  // Placeholder propre: l'invitation réelle sera branchée quand le flux email sera validé.
  return { status: 'pending_integration' as const };
}
