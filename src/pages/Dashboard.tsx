import { User, Users, Home, TrendingDown, TrendingUp } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { BudgetType } from '@/types/budget';
import { useNavigate } from 'react-router-dom';

const budgetTypeConfig: Record<BudgetType, { icon: typeof User; label: string }> = {
  personal: { icon: User, label: 'Personal' },
  couple: { icon: Users, label: 'Couple' },
  family: { icon: Home, label: 'Family' },
};

export default function Dashboard() {
  const { budgets, transactions, categories, getTotalSpending, getTopCategory } = useBudgetStore();
  const navigate = useNavigate();

  const totalPlanned = budgets.reduce((sum, b) => sum + b.totalPlanned, 0);
  const totalActual = budgets.reduce(
    (sum, b) => sum + b.categories.reduce((s, c) => s + c.actual, 0),
    0,
  );
  const totalAvailable = totalPlanned - totalActual;
  const topCat = getTopCategory();

  const healthPct = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
  const healthStatus = healthPct > 90 ? 'danger' : healthPct > 70 ? 'warning' : 'healthy';
  const healthColor = healthStatus === 'danger' ? 'text-destructive' : healthStatus === 'warning' ? 'text-warning' : 'text-primary';

  const recentTxs = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // Group budgets by type
  const budgetsByType = budgets.reduce<Record<BudgetType, typeof budgets>>((acc, b) => {
    if (!acc[b.type]) acc[b.type] = [];
    acc[b.type].push(b);
    return acc;
  }, {} as any);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero Card */}
      <div className="glass-card-emerald p-6 md:p-8 emerald-glow">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Available</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-emerald tracking-tight">
            ${totalAvailable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h1>
          <div className="mt-4 w-full max-w-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Spent: ${totalActual.toLocaleString()}</span>
              <span>Plan: ${totalPlanned.toLocaleString()}</span>
            </div>
            <ProgressBar value={totalActual} max={totalPlanned} />
          </div>
        </div>
      </div>

      {/* Budget Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['personal', 'couple', 'family'] as BudgetType[]).map((type) => {
          const config = budgetTypeConfig[type];
          const typeBudgets = budgetsByType[type] || [];
          const typePlanned = typeBudgets.reduce((s, b) => s + b.totalPlanned, 0);
          const typeActual = typeBudgets.reduce(
            (s, b) => s + b.categories.reduce((cs, c) => cs + c.actual, 0),
            0,
          );

          return (
            <button
              key={type}
              onClick={() => navigate('/budgets')}
              className="glass-card p-5 text-left hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <config.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{typeBudgets.length} budget{typeBudgets.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-foreground mb-2">
                ${typePlanned.toLocaleString()}
              </p>
              <ProgressBar value={typeActual} max={typePlanned} />
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="This Month's Spending"
          value={`$${totalActual.toLocaleString()}`}
          icon={TrendingDown}
        />
        <StatCard
          title="Top Category"
          value={topCat?.category.name || 'N/A'}
          subtitle={topCat ? `$${topCat.amount.toLocaleString()}` : undefined}
          icon={TrendingUp}
        />
        <div className="glass-card p-5 animate-slide-up">
          <p className="text-sm text-muted-foreground">Budget Health</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`h-3 w-3 rounded-full ${healthStatus === 'danger' ? 'bg-destructive' : healthStatus === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
            <p className={`text-2xl font-bold ${healthColor}`}>
              {healthPct.toFixed(0)}%
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {healthStatus === 'healthy' ? 'On track' : healthStatus === 'warning' ? 'Getting close' : 'Over budget'}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {recentTxs.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{tx.notes || 'Transaction'}</p>
                  <div className="flex items-center gap-2">
                    <CategoryBadge categoryId={tx.categoryId} />
                    <span className="text-xs text-muted-foreground">{tx.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">
                -${tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
