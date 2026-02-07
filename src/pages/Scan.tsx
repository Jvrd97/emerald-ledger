import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Trash2, Plus, ScanLine } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { ScannedItem } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type ScanState = 'upload' | 'scanning' | 'review';

export default function Scan() {
  const { categories, budgets, addTransactions } = useBudgetStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ScanState>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [storeName, setStoreName] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [budgetId, setBudgetId] = useState(budgets[0]?.id || '');

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      simulateScan();
    };
    reader.readAsDataURL(file);
  }, []);

  const simulateScan = () => {
    setState('scanning');
    // Simulate OCR processing — will be replaced with real AI call later
    setTimeout(() => {
      const mockItems: ScannedItem[] = [
        { id: '1', name: 'Organic Milk', quantity: 2, price: 5.99, categoryId: 'cat-1' },
        { id: '2', name: 'Whole Wheat Bread', quantity: 1, price: 3.49, categoryId: 'cat-1' },
        { id: '3', name: 'Chicken Breast', quantity: 1, price: 8.99, categoryId: 'cat-1' },
        { id: '4', name: 'Mixed Vegetables', quantity: 1, price: 4.50, categoryId: 'cat-1' },
        { id: '5', name: 'Orange Juice', quantity: 1, price: 3.99, categoryId: 'cat-1' },
        { id: '6', name: 'Vitamins', quantity: 1, price: 12.99, categoryId: 'cat-6' },
      ];
      setItems(mockItems);
      setStoreName('Whole Foods Market');
      setState('review');
    }, 2500);
  };

  const updateItem = (id: string, updates: Partial<ScannedItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = () => {
    if (!budgetId) {
      toast.error('Please select a budget');
      return;
    }
    const txs = items.map((item) => ({
      amount: item.price * item.quantity,
      categoryId: item.categoryId,
      budgetId,
      date: receiptDate,
      notes: item.name,
      storeName,
    }));
    addTransactions(txs);
    toast.success(`${items.length} transactions added from receipt`);
    setState('upload');
    setImagePreview(null);
    setItems([]);
    navigate('/transactions');
  };

  const handleReset = () => {
    setState('upload');
    setImagePreview(null);
    setItems([]);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Scan Receipt</h1>

      {state === 'upload' && (
        <div className="animate-fade-in space-y-4">
          {/* Upload Area */}
          <div
            className="glass-card-emerald p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 transition-all duration-200 relative"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect(file);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <ScanLine className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Scan your receipt</h2>
            <p className="text-sm text-muted-foreground mb-4">Take a photo or upload an image of your receipt</p>
            <div className="flex gap-3">
              <Button className="bg-primary hover:bg-primary/90">
                <Camera className="h-4 w-4 mr-2" /> Take Photo
              </Button>
              <Button variant="outline" className="border-border">
                <Upload className="h-4 w-4 mr-2" /> Upload Image
              </Button>
            </div>
          </div>
        </div>
      )}

      {state === 'scanning' && (
        <div className="glass-card-emerald p-8 flex flex-col items-center text-center animate-fade-in">
          {imagePreview && (
            <div className="relative w-48 h-64 mb-6 rounded-lg overflow-hidden">
              <img src={imagePreview} alt="Receipt" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0">
                <div className="absolute left-0 right-0 h-0.5 bg-primary emerald-glow scan-line" />
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Analyzing receipt with AI...</p>
          </div>
        </div>
      )}

      {state === 'review' && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Store</p>
              <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-1 bg-muted/50 border-border/50" />
            </div>
            <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" /> Re-scan
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} className="bg-muted/50 border-border/50" />
            </div>
            <div>
              <Label>Budget</Label>
              <Select value={budgetId} onValueChange={setBudgetId}>
                <SelectTrigger className="bg-muted/50 border-border/50"><SelectValue placeholder="Select budget" /></SelectTrigger>
                <SelectContent>
                  {budgets.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Table */}
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Item</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Qty</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 last:border-0 group">
                    <td className="px-4 py-2">
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        className="h-8 bg-transparent border-transparent hover:border-border/50 focus:border-border text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select value={item.categoryId} onValueChange={(v) => updateItem(item.id, { categoryId: v })}>
                        <SelectTrigger className="h-8 bg-transparent border-transparent hover:border-border/50 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                        className="h-8 w-16 bg-transparent border-transparent hover:border-border/50 text-right text-sm ml-auto"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                        className="h-8 w-20 bg-transparent border-transparent hover:border-border/50 text-right text-sm ml-auto"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all" aria-label="Remove item">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border/50">
                  <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-foreground">Total</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-primary">${total.toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <Button onClick={handleConfirm} className="w-full bg-primary hover:bg-primary/90 h-12 text-base">
            <Plus className="h-5 w-5 mr-2" /> Add {items.length} Transactions
          </Button>
        </div>
      )}
    </div>
  );
}
