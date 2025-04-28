import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Button from '../ui/Button';

interface CategoryListProps {
  onClose: () => void;
  onAddCategory: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onClose, onAddCategory }) => {
  const { data, deleteCategory } = useFinance();
  const { categories } = data;
  
  // Group categories by type
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  
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
          <h2 className="text-xl font-bold text-white">Categories</h2>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
        
        <div className="mb-4">
          <Button
            variant="primary"
            fullWidth
            onClick={onAddCategory}
            icon={<Plus size={20} />}
          >
            Add New Category
          </Button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Expense Categories</h3>
          {expenseCategories.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400">No expense categories</p>
              <p className="text-sm text-gray-500">Add a category to get started</p>
            </div>
          ) : (
            <motion.div
              className="space-y-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {expenseCategories.map((category) => (
                <motion.div
                  key={category.id}
                  className="bg-gray-800 rounded-xl p-3 flex items-center justify-between"
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full text-xl" style={{ backgroundColor: `${category.color}20` }}>
                      {category.emoji}
                    </div>
                    <span className="text-white">{category.name}</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-pink-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-3">Income Categories</h3>
          {incomeCategories.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400">No income categories</p>
              <p className="text-sm text-gray-500">Add a category to get started</p>
            </div>
          ) : (
            <motion.div
              className="space-y-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {incomeCategories.map((category) => (
                <motion.div
                  key={category.id}
                  className="bg-gray-800 rounded-xl p-3 flex items-center justify-between"
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full text-xl" style={{ backgroundColor: `${category.color}20` }}>
                      {category.emoji}
                    </div>
                    <span className="text-white">{category.name}</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-pink-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryList;