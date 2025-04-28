import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getTodayFormatted } from '../../utils/formatters';
import Button from '../ui/Button';

interface TransactionFormProps {
  type: 'expense' | 'income';
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onClose }) => {
  const { data, addTransaction } = useFinance();
  const { categories } = data;
  
  const availableCategories = categories.filter(category => category.type === type);
  
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(availableCategories.length > 0 ? availableCategories[0].id : '');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayFormatted());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId) return;
    
    addTransaction({
      amount: parseFloat(amount),
      categoryId,
      notes,
      date,
      type,
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
          <h2 className="text-xl font-bold text-white">
            Add {type === 'expense' ? 'Expense' : 'Income'}
          </h2>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="amount" className="block text-gray-400 mb-2 font-medium">
              Amount
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
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-medium">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableCategories.map((category) => (
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
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-400 mb-2 font-medium">
              Notes (Optional)
            </label>
            <input
              type="text"
              id="notes"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Coffee with friends..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="date" className="block text-gray-400 mb-2 font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            variant={type === 'expense' ? 'danger' : 'success'}
            fullWidth
            size="lg"
          >
            Save {type === 'expense' ? 'Expense' : 'Income'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default TransactionForm;