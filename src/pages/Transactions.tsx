import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Transactions() {
  const { transactions, categories, budgets, addTransaction, deleteTransaction } = useBudgetStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');

  // Form state
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const filtered = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((tx) => {
        if (filterCategory !== 'all' && tx.categoryId !== filterCategory) return false;
        if (filterBudget !== 'all' && tx.budgetId !== filterBudget) return false;
        if (search && !tx.notes.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
  }, [transactions, filterCategory, filterBudget, search]);

  const handleAdd = () => {
    if (!amount || !categoryId || !budgetId) {
      toast.error('Please fill in all required fields');
      return;
    }
    addTransaction({ amount: parseFloat(amount), categoryId, budgetId, date, notes });
    setAmount(''); setCategoryId(''); setBudgetId(''); setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setDialogOpen(false);
    toast.success('Transaction added');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border/50"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px] bg-muted/50 border-border/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterBudget} onValueChange={setFilterBudget}>
          <SelectTrigger className="w-[180px] bg-muted/50 border-border/50">
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Budgets</SelectItem>
            {budgets.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-muted-foreground">No transactions found</p>
            <Button variant="link" onClick={() => setDialogOpen(true)} className="text-primary mt-2">
              Add your first transaction
            </Button>
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              className="glass-card p-4 flex items-center justify-between hover:border-primary/20 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{tx.notes || 'Transaction'}</p>
                  <div className="flex items-center gap-2">
                    <CategoryBadge categoryId={tx.categoryId} />
                    <span className="text-xs text-muted-foreground">{tx.date}</span>
                    {tx.storeName && (
                      <span className="text-xs text-muted-foreground">· {tx.storeName}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-foreground">-${tx.amount.toFixed(2)}</p>
                <button
                  onClick={() => { deleteTransaction(tx.id); toast.success('Transaction deleted'); }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Amount</Label>
              <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Budget</Label>
              <Select value={budgetId} onValueChange={setBudgetId}>
                <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                <SelectContent>
                  {budgets.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What was this for?" />
            </div>
            <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90">Add Transaction</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
