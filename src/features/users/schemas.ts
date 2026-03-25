import { z } from 'zod';
import { userRoleValues } from '@/types/auth';

export const userUpdateSchema = z.object({
  role: z.enum(userRoleValues),
  isActive: z.boolean().default(true)
});

export const inviteUserSchema = z.object({
  email: z.string().trim().email('Email invalide.')
});

export type UserUpdateValues = z.infer<typeof userUpdateSchema>;
export type InviteUserValues = z.infer<typeof inviteUserSchema>;
