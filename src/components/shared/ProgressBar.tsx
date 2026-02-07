import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  colorHsl?: string;
}

export function ProgressBar({ value, max, className, colorHsl }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = value > max;

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${pct}%`,
          backgroundColor: isOver
            ? 'hsl(var(--destructive))'
            : colorHsl
              ? `hsl(${colorHsl})`
              : 'hsl(var(--primary))',
        }}
      />
    </div>
  );
}
