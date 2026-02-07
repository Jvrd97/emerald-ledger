export type BudgetType = 'personal' | 'couple' | 'family';
export type BudgetPeriod = 'monthly' | 'yearly';
export type HealthStatus = 'healthy' | 'warning' | 'danger';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  defaultAmount: number;
  budgetTypes: BudgetType[];
}

export interface BudgetCategory {
  categoryId: string;
  planned: number;
  actual: number;
}

export interface Budget {
  id: string;
  name: string;
  type: BudgetType;
  period: BudgetPeriod;
  totalPlanned: number;
  categories: BudgetCategory[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  budgetId: string;
  date: string;
  notes: string;
  receiptUrl?: string;
  storeName?: string;
}

export interface ScannedItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  categoryId: string;
}

export interface ScannedReceipt {
  storeName: string;
  date: string;
  items: ScannedItem[];
  total: number;
  tax: number;
}
