import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  label: string;
  description?: string;
}

export function OptionCard({ selected, onClick, icon, label, description }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all',
        selected
          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/30 dark:bg-brand-950/40'
          : 'border-[rgb(var(--border))] hover:border-brand-300',
      )}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="font-medium">{label}</span>
      {description && <span className="text-xs text-muted">{description}</span>}
    </button>
  );
}
