import { create } from 'zustand';
import { Budget, BudgetCategory, Category, Transaction, ScannedItem } from '@/types/budget';
import { defaultBudgets, defaultCategories, defaultTransactions } from '@/data/mockData';

interface BudgetStore {
  // Data
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];

  // Budget actions
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Helpers
  getCategoryById: (id: string) => Category | undefined;
  getBudgetById: (id: string) => Budget | undefined;
  getTransactionsByBudget: (budgetId: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTotalSpending: () => number;
  getTopCategory: () => { category: Category; amount: number } | null;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budgets: defaultBudgets,
  categories: defaultCategories,
  transactions: defaultTransactions,

  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, { ...budget, id: generateId(), createdAt: new Date().toISOString().split('T')[0] }],
  })),

  updateBudget: (id, updates) => set((state) => ({
    budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
  })),

  deleteBudget: (id) => set((state) => ({
    budgets: state.budgets.filter((b) => b.id !== id),
    transactions: state.transactions.filter((t) => t.budgetId !== id),
  })),

  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { ...category, id: generateId() }],
  })),

  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })),

  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
  })),

  addTransaction: (transaction) => {
    const newTx: Transaction = { ...transaction, id: generateId() };
    set((state) => {
      const budgets = state.budgets.map((b) => {
        if (b.id !== newTx.budgetId) return b;
        const categories = b.categories.map((bc) => {
          if (bc.categoryId !== newTx.categoryId) return bc;
          return { ...bc, actual: bc.actual + newTx.amount };
        });
        return { ...b, categories };
      });
      return { transactions: [...state.transactions, newTx], budgets };
    });
  },

  addTransactions: (transactions) => {
    const newTxs = transactions.map((t) => ({ ...t, id: generateId() }));
    set((state) => {
      let budgets = [...state.budgets];
      newTxs.forEach((tx) => {
        budgets = budgets.map((b) => {
          if (b.id !== tx.budgetId) return b;
          const categories = b.categories.map((bc) => {
            if (bc.categoryId !== tx.categoryId) return bc;
            return { ...bc, actual: bc.actual + tx.amount };
          });
          return { ...b, categories };
        });
      });
      return { transactions: [...state.transactions, ...newTxs], budgets };
    });
  },

  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),

  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id),
  })),

  getCategoryById: (id) => get().categories.find((c) => c.id === id),
  getBudgetById: (id) => get().budgets.find((b) => b.id === id),
  getTransactionsByBudget: (budgetId) => get().transactions.filter((t) => t.budgetId === budgetId),
  getTransactionsByCategory: (categoryId) => get().transactions.filter((t) => t.categoryId === categoryId),

  getTotalSpending: () => get().transactions.reduce((sum, t) => sum + t.amount, 0),

  getTopCategory: () => {
    const { transactions, categories } = get();
    const spending: Record<string, number> = {};
    transactions.forEach((t) => {
      spending[t.categoryId] = (spending[t.categoryId] || 0) + t.amount;
    });
    let topId = '';
    let topAmount = 0;
    Object.entries(spending).forEach(([catId, amount]) => {
      if (amount > topAmount) { topId = catId; topAmount = amount; }
    });
    const category = categories.find((c) => c.id === topId);
    return category ? { category, amount: topAmount } : null;
  },
}));
