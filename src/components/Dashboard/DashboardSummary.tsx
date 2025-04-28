import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getExpenses, getIncome, getBalance } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const DashboardSummary: React.FC = () => {
  const { data } = useFinance();
  const { transactions } = data;
  
  const todayExpenses = getExpenses(transactions, 'day');
  const weekExpenses = getExpenses(transactions, 'week');
  const monthExpenses = getExpenses(transactions, 'month');
  const monthIncome = getIncome(transactions, 'month');
  const balance = getBalance(transactions);

  const items = [
    {
      title: "Today's Spending",
      value: formatCurrency(todayExpenses),
      icon: <TrendingDown size={20} className="text-pink-500" />,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
    },
    {
      title: 'Weekly Spending',
      value: formatCurrency(weekExpenses),
      icon: <TrendingDown size={20} className="text-blue-400" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(monthIncome),
      icon: <TrendingUp size={20} className="text-green-500" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(monthExpenses),
      icon: <TrendingDown size={20} className="text-amber-500" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="mb-6">
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-white">Your Money</h2>
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <DollarSign size={16} className={balance >= 0 ? 'text-green-500' : 'text-pink-500'} />
          <span className={`font-bold ${balance >= 0 ? 'text-green-500' : 'text-pink-500'}`}>
            {formatCurrency(balance)}
          </span>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-2 gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`${item.bgColor} border ${item.borderColor} backdrop-blur-lg rounded-xl p-3`}
            variants={item}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-400 text-xs">{item.title}</span>
              {item.icon}
            </div>
            <div className={`${item.color} font-bold text-lg`}>{item.value}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardSummary;