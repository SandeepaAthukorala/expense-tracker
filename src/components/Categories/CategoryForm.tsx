import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Button from '../ui/Button';

// Predefined emojis for category selection
const EMOJIS = [
  '🍔', '🚗', '🛍️', '🎬', '📝', '💊', '🏠', '✈️', '🎮', '🍺',
  '📱', '👕', '💇', '🎓', '🎁', '💼', '📚', '⚽', '🎨', '💰',
];

// Predefined colors for category selection
const COLORS = [
  '#FF3C78', '#4FC3F7', '#00E676', '#FFC107', '#9C27B0',
  '#F44336', '#3F51B5', '#795548', '#607D8B', '#FF9800',
];

interface CategoryFormProps {
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onClose }) => {
  const { addCategory } = useFinance();
  
  const [name, setName] = useState<string>('');
  const [emoji, setEmoji] = useState<string>(EMOJIS[0]);
  const [color, setColor] = useState<string>(COLORS[0]);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !emoji || !color) return;
    
    addCategory({
      name,
      emoji,
      color,
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
          <h2 className="text-xl font-bold text-white">New Category</h2>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-400 mb-2 font-medium">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="E.g., Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-medium">
              Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-xl ${
                  type === 'expense'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-xl ${
                  type === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-medium">
              Emoji
            </label>
            <div className="grid grid-cols-10 gap-2">
              {EMOJIS.map((e) => (
                <motion.button
                  key={e}
                  type="button"
                  className={`p-2 rounded-lg text-xl ${
                    emoji === e
                      ? 'bg-gray-700 border-2 border-pink-500'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                  onClick={() => setEmoji(e)}
                  whileTap={{ scale: 0.9 }}
                >
                  {e}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-400 mb-2 font-medium">
              Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((c) => (
                <motion.button
                  key={c}
                  type="button"
                  className={`h-12 rounded-xl ${
                    color === c ? 'ring-2 ring-white' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            icon={<Plus size={20} />}
          >
            Create Category
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default CategoryForm;