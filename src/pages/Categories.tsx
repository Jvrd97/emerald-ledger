import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { Category, BudgetType } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const iconOptions = ['UtensilsCrossed', 'Car', 'ShoppingBag', 'Gamepad2', 'Zap', 'Heart', 'MoreHorizontal', 'Coffee', 'Plane', 'Gift', 'BookOpen', 'Music'];
const colorOptions = [
  { label: 'Emerald', value: '160 84% 39%' },
  { label: 'Blue', value: '199 89% 48%' },
  { label: 'Purple', value: '280 65% 60%' },
  { label: 'Amber', value: '38 92% 50%' },
  { label: 'Red', value: '0 72% 51%' },
  { label: 'Pink', value: '340 75% 55%' },
  { label: 'Slate', value: '215 20% 55%' },
  { label: 'Teal', value: '175 80% 40%' },
];

function getIcon(name: string) {
  const Icon = (Icons as any)[name];
  return Icon ? <Icon className="h-5 w-5" /> : null;
}

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useBudgetStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('MoreHorizontal');
  const [color, setColor] = useState('160 84% 39%');
  const [defaultAmount, setDefaultAmount] = useState('100');

  const openCreate = () => {
    setEditingId(null);
    setName(''); setIcon('MoreHorizontal'); setColor('160 84% 39%'); setDefaultAmount('100');
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name); setIcon(cat.icon); setColor(cat.color); setDefaultAmount(String(cat.defaultAmount));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateCategory(editingId, { name, icon, color, defaultAmount: parseFloat(defaultAmount) });
      toast.success('Category updated');
    } else {
      addCategory({ name, icon, color, defaultAmount: parseFloat(defaultAmount), budgetTypes: ['personal', 'couple', 'family'] });
      toast.success('Category created');
    }
    setDialogOpen(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-5 group hover:border-primary/20 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `hsl(${cat.color} / 0.15)`, color: `hsl(${cat.color})` }}
                >
                  {getIcon(cat.icon)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">Default: ${cat.defaultAmount}/mo</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="text-muted-foreground hover:text-foreground p-1" aria-label="Edit category">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { deleteCategory(cat.id); toast.success('Category deleted'); }}
                  className="text-muted-foreground hover:text-destructive p-1"
                  aria-label="Delete category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-1 flex-wrap">
              {cat.budgetTypes.map((type) => (
                <span key={type} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground capitalize">{type}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2 mt-1">
                {iconOptions.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`flex h-10 w-full items-center justify-center rounded-lg transition-colors ${
                      icon === ic ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    {getIcon(ic)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                      color === c.value ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: `hsl(${c.value} / 0.15)`, color: `hsl(${c.value})` }}
                  >
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(${c.value})` }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Default Monthly Amount</Label>
              <Input type="number" value={defaultAmount} onChange={(e) => setDefaultAmount(e.target.value)} />
            </div>
            <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
              {editingId ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
