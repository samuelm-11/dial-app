import Link from 'next/link';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <ForgotPasswordForm />
        <p className="text-center text-sm text-slate-600">
          <Link href="/login" className="underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
