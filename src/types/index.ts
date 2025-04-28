export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  type: 'expense' | 'income';
};

export type Transaction = {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  notes: string;
  type: 'expense' | 'income';
  isRecurring?: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'yearly';
  nextDueDate?: string;
  sharedWith?: string[]; // IDs of users sharing this transaction
  splitPercentage?: number; // User's percentage of the transaction
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly';
  warningThreshold?: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
};

export type Notification = {
  id: string;
  type: 'budget_warning' | 'bill_due' | 'spend_analysis' | 'smart_suggestion';
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedId?: string;
  action?: {
    type: 'save' | 'reduce' | 'invest';
    amount: number;
    description: string;
  };
};

export type Debt = {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  type: 'credit_card' | 'loan' | 'mortgage';
  payments: DebtPayment[];
};

export type DebtPayment = {
  id: string;
  amount: number;
  date: string;
  isPaid: boolean;
};

export type SharedWallet = {
  id: string;
  name: string;
  members: string[];
  transactions: Transaction[];
  totalBalance: number;
  ownerEmail: string;
};

export type SmartSuggestion = {
  id: string;
  type: 'saving' | 'spending' | 'investment';
  title: string;
  description: string;
  potentialSavings: number;
  category?: string;
  confidence: number;
  implementationSteps?: string[];
};

export type FinanceData = {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  notifications: Notification[];
  debts: Debt[];
  sharedWallets: SharedWallet[];
  smartSuggestions: SmartSuggestion[];
};

export type Period = 'day' | 'week' | 'month' | 'year';

export type ChartData = {
  name: string;
  value: number;
  color: string;
};

export type SpendAnalysis = {
  categoryComparisons: {
    categoryId: string;
    name: string;
    currentSpend: number;
    previousSpend: number;
    percentageChange: number;
  }[];
  totalComparison: {
    currentTotal: number;
    previousTotal: number;
    percentageChange: number;
  };
  unusualSpending: {
    categoryId: string;
    name: string;
    amount: number;
    percentageAboveNormal: number;
  }[];
  predictedExpenses: {
    categoryId: string;
    name: string;
    predictedAmount: number;
    confidence: number;
  }[];
};