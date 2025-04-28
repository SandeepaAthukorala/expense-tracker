import { addMonths, addWeeks, addYears, format, isBefore, isToday } from 'date-fns';
import { Transaction, Budget, Notification, FinanceData } from '../types';
import { getBudgetProgress } from './calculations';
import { formatCurrency } from './formatters';

export const checkBudgetWarnings = (
  budgets: Budget[],
  transactions: Transaction[]
): Notification[] => {
  return budgets
    .map(budget => {
      const { percentage } = getBudgetProgress(budget, transactions);
      const warningThreshold = budget.warningThreshold || 80;
      
      if (percentage >= warningThreshold) {
        return {
          id: `budget_warning_${budget.id}`,
          type: 'budget_warning',
          title: 'Budget Warning',
          message: `You've used ${Math.round(percentage)}% of your budget for this category`,
          date: new Date().toISOString(),
          read: false,
          relatedId: budget.id,
        };
      }
      return null;
    })
    .filter((notification): notification is Notification => notification !== null);
};

export const checkRecurringTransactions = (
  transactions: Transaction[]
): Notification[] => {
  const today = new Date();
  const notifications: Notification[] = [];

  transactions
    .filter(t => t.isRecurring && t.nextDueDate)
    .forEach(transaction => {
      const dueDate = new Date(transaction.nextDueDate!);
      
      if (isToday(dueDate) || isBefore(dueDate, today)) {
        notifications.push({
          id: `bill_due_${transaction.id}`,
          type: 'bill_due',
          title: 'Payment Due',
          message: `${formatCurrency(transaction.amount)} payment is due today`,
          date: new Date().toISOString(),
          read: false,
          relatedId: transaction.id,
        });
      }
    });

  return notifications;
};

export const updateRecurringTransactionDates = (
  transaction: Transaction
): string | undefined => {
  if (!transaction.isRecurring || !transaction.nextDueDate) return undefined;

  const currentDueDate = new Date(transaction.nextDueDate);
  let nextDueDate: Date;

  switch (transaction.recurringPeriod) {
    case 'weekly':
      nextDueDate = addWeeks(currentDueDate, 1);
      break;
    case 'monthly':
      nextDueDate = addMonths(currentDueDate, 1);
      break;
    case 'yearly':
      nextDueDate = addYears(currentDueDate, 1);
      break;
    default:
      return undefined;
  }

  return format(nextDueDate, 'yyyy-MM-dd');
};