import { Transaction, Category, SpendAnalysis } from '../types';
import { startOfMonth, subMonths, isWithinInterval } from 'date-fns';

export const generateSpendAnalysis = (
  transactions: Transaction[],
  categories: Category[]
): SpendAnalysis => {
  const today = new Date();
  const currentMonthStart = startOfMonth(today);
  const previousMonthStart = startOfMonth(subMonths(today, 1));
  
  const currentMonthTransactions = transactions.filter(t => 
    isWithinInterval(new Date(t.date), {
      start: currentMonthStart,
      end: today
    })
  );
  
  const previousMonthTransactions = transactions.filter(t =>
    isWithinInterval(new Date(t.date), {
      start: previousMonthStart,
      end: subMonths(today, 1)
    })
  );

  const categoryComparisons = categories
    .filter(category => category.type === 'expense')
    .map(category => {
      const currentSpend = currentMonthTransactions
        .filter(t => t.categoryId === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const previousSpend = previousMonthTransactions
        .filter(t => t.categoryId === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const percentageChange = previousSpend === 0 
        ? 100 
        : ((currentSpend - previousSpend) / previousSpend) * 100;

      return {
        categoryId: category.id,
        name: category.name,
        currentSpend,
        previousSpend,
        percentageChange,
      };
    });

  const currentTotal = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousTotal = previousMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPercentageChange = previousTotal === 0 
    ? 100 
    : ((currentTotal - previousTotal) / previousTotal) * 100;

  const unusualSpending = categoryComparisons
    .filter(comparison => comparison.percentageChange > 30)
    .map(comparison => ({
      categoryId: comparison.categoryId,
      name: comparison.name,
      amount: comparison.currentSpend,
      percentageAboveNormal: comparison.percentageChange,
    }));

  return {
    categoryComparisons,
    totalComparison: {
      currentTotal,
      previousTotal,
      percentageChange: totalPercentageChange,
    },
    unusualSpending,
  };
};