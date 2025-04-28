import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Button from '../ui/Button';

interface BudgetFormProps {
  onClose: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onClose }) => {
  const { data, addBudget } = useFinance();
  const { categories } = data;
  
  // Filter for expense categories only
  const expenseCategories = categories.filter(category => category.type === 'expense');
  
  const [categoryId, setCategoryId] = useState<string>(
    expenseCategories.length > 0 ? expenseCategories[0].id : ''
  );
  const [amount, setAmount] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId) return;
    
    addBudget({
      categoryId,
      amount: parseFloat(amount),
      period: 'monthly',
    });
    
    onClose();
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
          <h2 className="text-xl font-bold text-white">Set Monthly Budget</h2>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-medium">
              Category
            </label>
            {expenseCategories.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400">No expense categories</p>
                <p className="text-sm text-gray-500">Add expense categories first</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {expenseCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    type="button"
                    className={`p-3 rounded-xl flex flex-col items-center justify-center ${
                      categoryId === category.id
                        ? 'bg-gray-700 border-2 border-pink-500'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                    onClick={() => setCategoryId(category.id)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl mb-1">{category.emoji}</span>
                    <span className="text-xs text-gray-300">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <label htmlFor="amount" className="block text-gray-400 mb-2 font-medium">
              Monthly Limit
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">
                $
              </div>
              <input
                type="number"
                id="amount"
                step="0.01"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 pl-8 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={expenseCategories.length === 0}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={expenseCategories.length === 0}
          >
            Save Budget
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default BudgetForm;