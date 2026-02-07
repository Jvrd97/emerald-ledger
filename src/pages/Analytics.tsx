import { useState, useMemo } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CHART_COLORS = [
  'hsl(160, 84%, 39%)',
  'hsl(199, 89%, 48%)',
  'hsl(280, 65%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(340, 75%, 55%)',
  'hsl(215, 20%, 55%)',
];

export default function Analytics() {
  const { transactions, categories, budgets } = useBudgetStore();
  const [period, setPeriod] = useState('30');

  const cutoffDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(period));
    return d.toISOString().split('T')[0];
  }, [period]);

  const filteredTxs = useMemo(
    () => transactions.filter((t) => t.date >= cutoffDate),
    [transactions, cutoffDate],
  );

  // Category distribution
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTxs.forEach((t) => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    });
    return Object.entries(map).map(([catId, value]) => {
      const cat = categories.find((c) => c.id === catId);
      return { name: cat?.name || 'Unknown', value: Math.round(value * 100) / 100, color: cat?.color };
    }).sort((a, b) => b.value - a.value);
  }, [filteredTxs, categories]);

  // Spending over time (daily)
  const timeData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTxs.forEach((t) => {
      map[t.date] = (map[t.date] || 0) + t.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({
        date: date.slice(5), // MM-DD
        amount: Math.round(amount * 100) / 100,
      }));
  }, [filteredTxs]);

  // Plan vs Actual
  const planActualData = useMemo(() => {
    return budgets.flatMap((b) =>
      b.categories.map((bc) => {
        const cat = categories.find((c) => c.id === bc.categoryId);
        return { name: cat?.name || 'Unknown', planned: bc.planned, actual: bc.actual };
      }),
    ).reduce<{ name: string; planned: number; actual: number }[]>((acc, item) => {
      const existing = acc.find((a) => a.name === item.name);
      if (existing) {
        existing.planned += item.planned;
        existing.actual += item.actual;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  }, [budgets, categories]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card p-3 text-sm">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="font-medium">
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px] bg-muted/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="180">Last 6 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Over Time */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Spending Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 20%)" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="amount" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ fill: 'hsl(160, 84%, 39%)' }} name="Spending" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" nameKey="name">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color ? `hsl(${entry.color})` : CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Plan vs Actual */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Plan vs Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={planActualData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 20%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>} />
              <Bar dataKey="planned" fill="hsl(215, 25%, 30%)" name="Planned" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="hsl(160, 84%, 39%)" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
