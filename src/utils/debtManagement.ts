import { Debt, DebtPayment } from '../types';
import { addMonths, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const calculateDebtPayoff = (debt: Debt): {
  monthsToPayoff: number;
  totalInterest: number;
  suggestedPayment: number;
  amortizationSchedule: DebtPayment[];
} => {
  let balance = debt.remainingAmount;
  let monthsToPayoff = 0;
  let totalInterest = 0;
  const amortizationSchedule: DebtPayment[] = [];
  const monthlyRate = debt.interestRate / 12 / 100;

  // Calculate minimum payment if not provided
  const minimumPayment = debt.minimumPayment || Math.max(
    balance * 0.02, // 2% of balance
    25 // Minimum $25 payment
  );

  // Calculate suggested payment (1.5x minimum for faster payoff)
  const suggestedPayment = minimumPayment * 1.5;

  while (balance > 0 && monthsToPayoff < 360) { // Cap at 30 years
    const interestCharge = balance * monthlyRate;
    const principalPayment = Math.min(suggestedPayment - interestCharge, balance);
    
    totalInterest += interestCharge;
    balance -= principalPayment;
    monthsToPayoff++;

    amortizationSchedule.push({
      id: uuidv4(),
      amount: suggestedPayment,
      date: format(addMonths(new Date(), monthsToPayoff), 'yyyy-MM-dd'),
      isPaid: false
    });
  }

  return {
    monthsToPayoff,
    totalInterest,
    suggestedPayment,
    amortizationSchedule
  };
};

export const generatePaymentStrategy = (debts: Debt[]): {
  order: Debt[];
  monthlyAllocation: { debtId: string; amount: number }[];
  totalMonths: number;
  totalInterestSaved: number;
} => {
  // Sort debts by interest rate (debt avalanche method)
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  
  // Calculate total minimum payments
  const totalMinimum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Assume 20% more than minimum payments available
  const availableForDebt = totalMinimum * 1.2;
  
  // Allocate extra money to highest interest debt
  const allocation = sortedDebts.map(debt => ({
    debtId: debt.id,
    amount: debt.minimumPayment
  }));
  
  // Add extra to highest interest debt
  if (allocation.length > 0) {
    allocation[0].amount += (availableForDebt - totalMinimum);
  }

  // Calculate total payoff time and interest saved
  let maxMonths = 0;
  let totalInterestSaved = 0;

  sortedDebts.forEach(debt => {
    const standardPayoff = calculateDebtPayoff({
      ...debt,
      minimumPayment: debt.minimumPayment
    });
    
    const acceleratedPayoff = calculateDebtPayoff({
      ...debt,
      minimumPayment: allocation.find(a => a.debtId === debt.id)?.amount || debt.minimumPayment
    });
    
    maxMonths = Math.max(maxMonths, acceleratedPayoff.monthsToPayoff);
    totalInterestSaved += (standardPayoff.totalInterest - acceleratedPayoff.totalInterest);
  });

  return {
    order: sortedDebts,
    monthlyAllocation: allocation,
    totalMonths: maxMonths,
    totalInterestSaved
  };
};