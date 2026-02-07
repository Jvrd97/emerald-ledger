import { cn } from '@/lib/utils';
import { useBudgetStore } from '@/store/budgetStore';

interface CategoryBadgeProps {
  categoryId: string;
  className?: string;
}

export function CategoryBadge({ categoryId, className }: CategoryBadgeProps) {
  const category = useBudgetStore((s) => s.getCategoryById(categoryId));
  if (!category) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
      style={{
        backgroundColor: `hsl(${category.color} / 0.15)`,
        color: `hsl(${category.color})`,
      }}
    >
      {category.name}
    </span>
  );
}
