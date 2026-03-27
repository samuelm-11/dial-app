import Link from 'next/link';

type DialLogoProps = {
  compact?: boolean;
  className?: string;
};

export function DialLogo({ compact = false, className = '' }: DialLogoProps) {
  const baseClasses = `inline-flex items-center gap-3 rounded-lg ${compact ? 'px-2 py-2' : 'px-3 py-2'} ${className}`;

  return (
    <Link href="/dashboard" className={baseClasses} aria-label="Retour au dashboard Dial Services">
      <img
        src="https://cdn.prod.website-files.com/65cb2d31002bcbf8f2bd2a32/65cb52e625e99927f6c0ec65_WhatsApp_Image_2024-02-13_%C3%A0_12.29.32_e72f0d72-removebg-preview.png"
        alt="Dial Services"
        className={`w-auto object-contain ${compact ? 'h-7' : 'h-9'}`}
      />
      {!compact ? (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white">Dial Services</span>
          <span className="text-xs font-medium text-slate-300">Service & fiabilité</span>
        </span>
      ) : null}
    </Link>
  );
}
