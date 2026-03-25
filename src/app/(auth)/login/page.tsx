import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-slate-600">
          <Link href="/forgot-password" className="underline">
            Mot de passe oublié ?
          </Link>
        </p>
      </div>
    </main>
  );
}
