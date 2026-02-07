import { useState } from 'react';
import { ChevronRight, ChevronDown, Wallet, Plus, Trash2, User, Users, Home } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Budget, BudgetType } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const typeIcons: Record<BudgetType, typeof User> = { personal: User, couple: Users, family: Home };

export default function Budgets() {
  const { budgets, categories, deleteBudget, addBudget } = useBudgetStore();
  const [selectedId, setSelectedId] = useState<string | null>(budgets[0]?.id || null);
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({ personal: true, couple: true, family: true });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<BudgetType>('personal');
  const [newPeriod, setNewPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const selected = budgets.find((b) => b.id === selectedId);
  const grouped = budgets.reduce<Record<BudgetType, Budget[]>>((acc, b) => {
    if (!acc[b.type]) acc[b.type] = [];
    acc[b.type].push(b);
    return acc;
  }, {} as any);

  const toggleType = (type: string) => setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleCreate = () => {
    if (!newName.trim()) return;
    const catList = categories
      .filter((c) => c.budgetTypes.includes(newType))
      .map((c) => ({ categoryId: c.id, planned: c.defaultAmount, actual: 0 }));
    addBudget({
      name: newName,
      type: newType,
      period: newPeriod,
      totalPlanned: catList.reduce((s, c) => s + c.planned, 0),
      categories: catList,
    });
    setNewName('');
    setDialogOpen(false);
    toast.success('Budget created successfully');
  };

  return (
    <div className="mx-auto max-w-6xl flex gap-6 h-[calc(100vh-7rem)]">
      {/* Folder Tree Sidebar */}
      <aside className="w-64 shrink-0 glass-card p-3 overflow-y-auto scrollbar-thin hidden md:block">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Budgets</h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-primary hover:text-primary/80 transition-colors" aria-label="Add budget">
                <Plus className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Budget Name</Label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. January Budget" />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={newType} onValueChange={(v) => setNewType(v as BudgetType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period</Label>
                  <Select value={newPeriod} onValueChange={(v) => setNewPeriod(v as 'monthly' | 'yearly')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} className="w-full bg-primary hover:bg-primary/90">Create Budget</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {(['personal', 'couple', 'family'] as BudgetType[]).map((type) => {
          const Icon = typeIcons[type];
          const items = grouped[type] || [];
          return (
            <div key={type} className="mb-1">
              <button
                onClick={() => toggleType(type)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                {expandedTypes[type] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                <Icon className="h-3.5 w-3.5" />
                <span className="capitalize">{type}</span>
                <span className="ml-auto text-xs">{items.length}</span>
              </button>
              {expandedTypes[type] && items.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`flex w-full items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm transition-colors ${
                    selectedId === b.id ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-muted/50'
                  }`}
                >
                  <Wallet className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{b.name}</span>
                </button>
              ))}
            </div>
          );
        })}
      </aside>

      {/* Detail View */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {selected ? (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{selected.name}</h1>
                <p className="text-sm text-muted-foreground capitalize">{selected.type} · {selected.period}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => { deleteBudget(selected.id); setSelectedId(budgets.find(b => b.id !== selected.id)?.id || null); toast.success('Budget deleted'); }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>

            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Planned</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actual</th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground w-40">Progress</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.categories.map((bc) => {
                    const cat = categories.find((c) => c.id === bc.categoryId);
                    const remaining = bc.planned - bc.actual;
                    return (
                      <tr key={bc.categoryId} className="border-b border-border/20 last:border-0">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-foreground">{cat?.name || 'Unknown'}</span>
                        </td>
                        <td className="text-right px-4 py-3 text-sm text-muted-foreground">${bc.planned.toLocaleString()}</td>
                        <td className="text-right px-4 py-3 text-sm text-foreground font-medium">${bc.actual.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <ProgressBar value={bc.actual} max={bc.planned} colorHsl={cat?.color} />
                        </td>
                        <td className={`text-right px-4 py-3 text-sm font-medium ${remaining < 0 ? 'text-destructive' : 'text-primary'}`}>
                          ${Math.abs(remaining).toLocaleString()}
                          {remaining < 0 && ' over'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border/50">
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">Total</td>
                    <td className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                      ${selected.categories.reduce((s, c) => s + c.planned, 0).toLocaleString()}
                    </td>
                    <td className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                      ${selected.categories.reduce((s, c) => s + c.actual, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar
                        value={selected.categories.reduce((s, c) => s + c.actual, 0)}
                        max={selected.categories.reduce((s, c) => s + c.planned, 0)}
                      />
                    </td>
                    <td className="text-right px-4 py-3 text-sm font-semibold text-primary">
                      ${(selected.categories.reduce((s, c) => s + c.planned, 0) - selected.categories.reduce((s, c) => s + c.actual, 0)).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a budget or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
