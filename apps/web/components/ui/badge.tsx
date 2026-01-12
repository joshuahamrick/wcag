import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-300',
  success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-800',
  warning: 'bg-amber-900/50 text-amber-400 border border-amber-800',
  danger: 'bg-rose-900/50 text-rose-400 border border-rose-800',
  info: 'bg-blue-900/50 text-blue-400 border border-blue-800',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Specialized badge for severity levels
type SeverityLevel = 'LEGAL' | 'USABILITY' | 'BEST_PRACTICE';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

const severityConfig: Record<SeverityLevel, { label: string; variant: BadgeVariant }> = {
  LEGAL: { label: 'Legal Risk', variant: 'danger' },
  USABILITY: { label: 'Usability', variant: 'warning' },
  BEST_PRACTICE: { label: 'Best Practice', variant: 'info' },
};

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
