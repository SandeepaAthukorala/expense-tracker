import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { getBalance } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const FloatingBalance: React.FC = () => {
  const { data } = useFinance();
  const balance = getBalance(data.transactions);
  
  return (
    <motion.div
      className="fixed bottom-20 left-4 z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 30 }}
    >
      <motion.div
        className={`px-4 py-2 rounded-full shadow-lg text-white font-medium text-sm ${
          balance >= 0 ? 'bg-green-500' : 'bg-red-500'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Balance: {formatCurrency(balance)}
      </motion.div>
    </motion.div>
  );
};

export default FloatingBalance;