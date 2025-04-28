import { Transaction, Category, Budget, Period, SavingsGoal } from '../types';

// Get total balance
export const getBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
};

// Get total expenses for a given period
export const getExpenses = (transactions: Transaction[], period: Period = 'month'): number => {
  const filteredTransactions = filterTransactionsByPeriod(
    transactions.filter(t => t.type === 'expense'),
    period
  );
  
  return filteredTransactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
};

// Get total income for a given period
export const getIncome = (transactions: Transaction[], period: Period = 'month'): number => {
  const filteredTransactions = filterTransactionsByPeriod(
    transactions.filter(t => t.type === 'income'),
    period
  );
  
  return filteredTransactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
};

// Filter transactions by period (day, week, month, year)
export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: Period
): Transaction[] => {
  const today = new Date();
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    
    switch (period) {
      case 'day':
        return (
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      case 'week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return transactionDate >= oneWeekAgo;
      case 'month':
        return (
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      case 'year':
        return transactionDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  });
};

// Get expenses by category for a period
export const getExpensesByCategory = (
  transactions: Transaction[],
  categories: Category[],
  period: Period = 'month'
): { category: Category; amount: number }[] => {
  const expenseTransactions = filterTransactionsByPeriod(
    transactions.filter(t => t.type === 'expense'),
    period
  );
  
  const expensesByCategory: { [key: string]: number } = {};
  
  // Initialize all expense categories with zero
  categories
    .filter(cat => cat.type === 'expense')
    .forEach(category => {
      expensesByCategory[category.id] = 0;
    });
  
  // Sum expenses by category
  expenseTransactions.forEach(transaction => {
    expensesByCategory[transaction.categoryId] =
      (expensesByCategory[transaction.categoryId] || 0) + transaction.amount;
  });
  
  // Format for return
  return Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => ({
      category: categories.find(c => c.id === categoryId) as Category,
      amount,
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
};

// Get budget progress
export const getBudgetProgress = (
  budget: Budget,
  transactions: Transaction[]
): { used: number; percentage: number } => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const categoryTransactions = transactions.filter(
    t =>
      t.categoryId === budget.categoryId &&
      t.type === 'expense' &&
      new Date(t.date) >= firstDayOfMonth &&
      new Date(t.date) <= lastDayOfMonth
  );
  
  const used = categoryTransactions.reduce((total, t) => total + t.amount, 0);
  const percentage = budget.amount > 0 ? Math.min(100, (used / budget.amount) * 100) : 0;
  
  return { used, percentage };
};

// Get savings goal progress
export const getSavingsGoalProgress = (
  goal: SavingsGoal
): { percentage: number; remaining: number } => {
  const percentage = goal.targetAmount > 0 
    ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) 
    : 0;
  const remaining = goal.targetAmount - goal.currentAmount;
  
  return { percentage, remaining };
};