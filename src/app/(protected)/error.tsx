'use client';

import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { StatePanel } from '@/components/ui/state-panel';

export default function ProtectedError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageContainer title="Erreur">
      <StatePanel
        variant="error"
        message="Une erreur est survenue pendant le chargement de la page."
        action={
          <Button variant="secondary" onClick={reset}>
            Réessayer
          </Button>
        }
      />
    </PageContainer>
  );
}
