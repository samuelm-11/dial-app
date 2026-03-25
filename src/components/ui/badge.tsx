type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  rounded?: 'pill' | 'soft';
};

const badgeToneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-sky-100 text-sky-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-700',
  accent: 'bg-violet-100 text-violet-800'
};

const badgeRoundedClasses = {
  pill: 'rounded-full',
  soft: 'rounded'
};

export function Badge({ label, tone = 'neutral', rounded = 'pill' }: BadgeProps) {
  return <span className={`${badgeRoundedClasses[rounded]} px-2 py-1 text-xs font-medium ${badgeToneClasses[tone]}`}>{label}</span>;
}
