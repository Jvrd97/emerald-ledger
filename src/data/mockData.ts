import { Budget, Category, Transaction } from '@/types/budget';

export const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'UtensilsCrossed', color: '160 84% 39%', defaultAmount: 500, budgetTypes: ['personal', 'couple', 'family'] },
  { id: 'cat-2', name: 'Transportation', icon: 'Car', color: '199 89% 48%', defaultAmount: 200, budgetTypes: ['personal', 'couple', 'family'] },
  { id: 'cat-3', name: 'Shopping', icon: 'ShoppingBag', color: '280 65% 60%', defaultAmount: 300, budgetTypes: ['personal', 'couple'] },
  { id: 'cat-4', name: 'Entertainment', icon: 'Gamepad2', color: '38 92% 50%', defaultAmount: 150, budgetTypes: ['personal', 'couple', 'family'] },
  { id: 'cat-5', name: 'Bills & Utilities', icon: 'Zap', color: '0 72% 51%', defaultAmount: 400, budgetTypes: ['personal', 'couple', 'family'] },
  { id: 'cat-6', name: 'Healthcare', icon: 'Heart', color: '340 75% 55%', defaultAmount: 100, budgetTypes: ['personal', 'family'] },
  { id: 'cat-7', name: 'Other', icon: 'MoreHorizontal', color: '215 20% 55%', defaultAmount: 100, budgetTypes: ['personal', 'couple', 'family'] },
];

export const defaultBudgets: Budget[] = [
  {
    id: 'budget-1',
    name: 'My Monthly Budget',
    type: 'personal',
    period: 'monthly',
    totalPlanned: 1750,
    categories: [
      { categoryId: 'cat-1', planned: 500, actual: 420 },
      { categoryId: 'cat-2', planned: 200, actual: 180 },
      { categoryId: 'cat-3', planned: 300, actual: 350 },
      { categoryId: 'cat-4', planned: 150, actual: 90 },
      { categoryId: 'cat-5', planned: 400, actual: 400 },
      { categoryId: 'cat-6', planned: 100, actual: 45 },
      { categoryId: 'cat-7', planned: 100, actual: 60 },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'budget-2',
    name: 'Couple Expenses',
    type: 'couple',
    period: 'monthly',
    totalPlanned: 2500,
    categories: [
      { categoryId: 'cat-1', planned: 800, actual: 720 },
      { categoryId: 'cat-2', planned: 300, actual: 250 },
      { categoryId: 'cat-3', planned: 400, actual: 480 },
      { categoryId: 'cat-4', planned: 250, actual: 200 },
      { categoryId: 'cat-5', planned: 600, actual: 600 },
      { categoryId: 'cat-7', planned: 150, actual: 80 },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'budget-3',
    name: 'Family Budget',
    type: 'family',
    period: 'monthly',
    totalPlanned: 4000,
    categories: [
      { categoryId: 'cat-1', planned: 1200, actual: 1050 },
      { categoryId: 'cat-2', planned: 500, actual: 420 },
      { categoryId: 'cat-4', planned: 400, actual: 350 },
      { categoryId: 'cat-5', planned: 900, actual: 900 },
      { categoryId: 'cat-6', planned: 500, actual: 200 },
      { categoryId: 'cat-7', planned: 500, actual: 300 },
    ],
    createdAt: '2026-01-01',
  },
];

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const defaultTransactions: Transaction[] = [
  { id: 'tx-1', amount: 45.50, categoryId: 'cat-1', budgetId: 'budget-1', date: daysAgo(0), notes: 'Grocery store', storeName: 'Whole Foods' },
  { id: 'tx-2', amount: 12.00, categoryId: 'cat-2', budgetId: 'budget-1', date: daysAgo(0), notes: 'Uber ride' },
  { id: 'tx-3', amount: 89.99, categoryId: 'cat-3', budgetId: 'budget-1', date: daysAgo(1), notes: 'New headphones' },
  { id: 'tx-4', amount: 35.00, categoryId: 'cat-1', budgetId: 'budget-2', date: daysAgo(1), notes: 'Date night dinner' },
  { id: 'tx-5', amount: 150.00, categoryId: 'cat-5', budgetId: 'budget-1', date: daysAgo(2), notes: 'Electric bill' },
  { id: 'tx-6', amount: 22.50, categoryId: 'cat-4', budgetId: 'budget-1', date: daysAgo(2), notes: 'Movie tickets' },
  { id: 'tx-7', amount: 65.00, categoryId: 'cat-1', budgetId: 'budget-3', date: daysAgo(3), notes: 'Family dinner out' },
  { id: 'tx-8', amount: 40.00, categoryId: 'cat-2', budgetId: 'budget-1', date: daysAgo(3), notes: 'Gas station' },
  { id: 'tx-9', amount: 200.00, categoryId: 'cat-3', budgetId: 'budget-2', date: daysAgo(4), notes: 'Anniversary gift' },
  { id: 'tx-10', amount: 15.00, categoryId: 'cat-6', budgetId: 'budget-1', date: daysAgo(4), notes: 'Pharmacy' },
  { id: 'tx-11', amount: 120.00, categoryId: 'cat-1', budgetId: 'budget-3', date: daysAgo(5), notes: 'Weekly groceries' },
  { id: 'tx-12', amount: 55.00, categoryId: 'cat-4', budgetId: 'budget-3', date: daysAgo(5), notes: 'Kids activities' },
  { id: 'tx-13', amount: 30.00, categoryId: 'cat-6', budgetId: 'budget-3', date: daysAgo(6), notes: 'Vitamins' },
  { id: 'tx-14', amount: 250.00, categoryId: 'cat-5', budgetId: 'budget-1', date: daysAgo(7), notes: 'Internet + phone' },
  { id: 'tx-15', amount: 18.99, categoryId: 'cat-1', budgetId: 'budget-1', date: daysAgo(7), notes: 'Coffee beans' },
  { id: 'tx-16', amount: 75.00, categoryId: 'cat-3', budgetId: 'budget-1', date: daysAgo(8), notes: 'Clothes' },
  { id: 'tx-17', amount: 95.00, categoryId: 'cat-2', budgetId: 'budget-2', date: daysAgo(9), notes: 'Car maintenance' },
  { id: 'tx-18', amount: 28.00, categoryId: 'cat-1', budgetId: 'budget-2', date: daysAgo(10), notes: 'Takeout' },
  { id: 'tx-19', amount: 60.00, categoryId: 'cat-7', budgetId: 'budget-1', date: daysAgo(12), notes: 'Misc supplies' },
  { id: 'tx-20', amount: 180.00, categoryId: 'cat-5', budgetId: 'budget-3', date: daysAgo(14), notes: 'Water bill' },
];
