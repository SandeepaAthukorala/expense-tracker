import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getBudgetProgress } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import Button from '../ui/Button';
import ProgressCircle from '../ui/ProgressCircle';

interface BudgetListProps {
  onClose: () => void;
  onAddBudget: () => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ onClose, onAddBudget }) => {
  const { data, deleteBudget } = useFinance();
  const { budgets, categories, transactions } = data;
  
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
    <motion.div
      className="fixed inset-0 bg-background z-50 overflow-y-auto pb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-white">Monthly Budgets</h2>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
        
        <div className="mb-6">
          <Button
            variant="primary"
            fullWidth
            onClick={onAddBudget}
            icon={<Plus size={20} />}
          >
            Set New Budget
          </Button>
        </div>
        
        {budgets.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400">No budgets set</p>
            <p className="text-sm text-gray-500">Set a budget to track your spending</p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {budgets.map((budget) => {
              const category = categories.find(c => c.id === budget.categoryId);
              const { used, percentage } = getBudgetProgress(budget, transactions);
              
              // Skip if category doesn't exist
              if (!category) return null;
              
              // Determine color based on percentage
              let progressColor = '#00E676'; // Green for under 60%
              if (percentage > 90) {
                progressColor = '#F44336'; // Red for over 90%
              } else if (percentage > 75) {
                progressColor = '#FFC107'; // Amber for over 75%
              } else if (percentage > 60) {
                progressColor = '#FF9800'; // Orange for over 60%
              }
              
              return (
                <motion.div
                  key={budget.id}
                  className="bg-gray-800 rounded-xl p-4"
                  variants={item}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.emoji}</span>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className="p-1 text-gray-400 hover:text-pink-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">{formatCurrency(used)}</span>
                        <span className="text-gray-400">/ {formatCurrency(budget.amount)}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {percentage >= 100 ? (
                          <span className="text-red-500">Budget exceeded!</span>
                        ) : (
                          <span>Remaining: {formatCurrency(budget.amount - used)}</span>
                        )}
                      </div>
                    </div>
                    
                    <ProgressCircle
                      percentage={percentage}
                      size={60}
                      strokeWidth={8}
                      progressColor={progressColor}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BudgetList;