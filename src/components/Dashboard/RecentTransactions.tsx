import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const RecentTransactions: React.FC = () => {
  const { data, deleteTransaction } = useFinance();
  const { transactions, categories } = data;
  
  // Get most recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };
  
  if (recentTransactions.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-white font-medium mb-3">Recent Transactions</h3>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-500">Add some transactions to get started</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-white font-medium mb-3">Recent Transactions</h3>
      <motion.div
        className="space-y-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {recentTransactions.map((transaction) => {
          const category = categories.find(c => c.id === transaction.categoryId);
          
          return (
            <motion.div
              key={transaction.id}
              className="bg-gray-800 rounded-xl p-3 flex items-center justify-between"
              variants={item}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => deleteTransaction(transaction.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-pink-500/20'}`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : (
                    <TrendingDown size={16} className="text-pink-500" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {category?.emoji} {category?.name}
                  </p>
                  <p className="text-gray-400 text-xs">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-pink-500'}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default RecentTransactions;