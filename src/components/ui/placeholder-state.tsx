import { StatePanel } from '@/components/ui/state-panel';

export function PlaceholderState({ message }: { message: string }) {
  return <StatePanel message={message} variant="empty" />;
}
