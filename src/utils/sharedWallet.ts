import { Transaction, SharedWallet } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const calculateMemberBalances = (wallet: SharedWallet): {
  [memberId: string]: number;
} => {
  const balances: { [key: string]: number } = {};
  
  // Initialize balances for all members
  wallet.members.forEach(memberId => {
    balances[memberId] = 0;
  });

  // Calculate individual contributions and shares
  wallet.transactions.forEach(transaction => {
    if (!transaction.sharedWith || !transaction.splitPercentage) return;

    const memberShare = transaction.amount * (transaction.splitPercentage / 100);
    const otherShare = transaction.amount * ((100 - transaction.splitPercentage) / 100);
    const perPersonShare = otherShare / (transaction.sharedWith.length);

    // Add contribution
    balances[transaction.sharedWith[0]] += memberShare;

    // Subtract shares from others
    transaction.sharedWith.forEach(memberId => {
      if (memberId !== transaction.sharedWith[0]) {
        balances[memberId] -= perPersonShare;
      }
    });
  });

  return balances;
};

export const generateSettlementPlan = (wallet: SharedWallet): {
  payments: Array<{
    from: string;
    to: string;
    amount: number;
  }>;
} => {
  const balances = calculateMemberBalances(wallet);
  const payments: Array<{
    from: string;
    to: string;
    amount: number;
  }> = [];

  // Find members who owe money (negative balance)
  const debtors = Object.entries(balances)
    .filter(([_, balance]) => balance < 0)
    .sort(([_, a], [__, b]) => a - b);

  // Find members who are owed money (positive balance)
  const creditors = Object.entries(balances)
    .filter(([_, balance]) => balance > 0)
    .sort(([_, a], [__, b]) => b - a);

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const [debtorId, debtorBalance] = debtors[debtorIndex];
    const [creditorId, creditorBalance] = creditors[creditorIndex];

    const paymentAmount = Math.min(Math.abs(debtorBalance), creditorBalance);

    if (paymentAmount > 0) {
      payments.push({
        from: debtorId,
        to: creditorId,
        amount: paymentAmount,
      });
    }

    // Update balances and move to next person if their balance is settled
    if (Math.abs(debtorBalance) === paymentAmount) {
      debtorIndex++;
    }
    if (creditorBalance === paymentAmount) {
      creditorIndex++;
    }
  }

  return { payments };
};