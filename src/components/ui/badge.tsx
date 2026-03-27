type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  rounded?: 'pill' | 'soft';
};

const badgeToneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-danger/10 text-danger',
  accent: 'bg-primary/10 text-primary'
};

const badgeRoundedClasses = {
  pill: 'rounded-full',
  soft: 'rounded-md'
};

export function Badge({ label, tone = 'neutral', rounded = 'pill' }: BadgeProps) {
  return <span className={`${badgeRoundedClasses[rounded]} inline-flex px-2.5 py-1 text-xs font-semibold ${badgeToneClasses[tone]}`}>{label}</span>;
}
