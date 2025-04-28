import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Button from '../ui/Button';

interface SavingsGoalFormProps {
  onClose: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({ onClose }) => {
  const { addSavingsGoal } = useFinance();
  
  const [name, setName] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [currentAmount, setCurrentAmount] = useState<string>('0');
  const [deadline, setDeadline] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !targetAmount) return;
    
    addSavingsGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline: deadline || undefined,
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
          <h2 className="text-xl font-bold text-white">New Savings Goal</h2>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-400 mb-2 font-medium">
              Goal Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="E.g., New Laptop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="targetAmount" className="block text-gray-400 mb-2 font-medium">
              Target Amount
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">
                $
              </div>
              <input
                type="number"
                id="targetAmount"
                step="0.01"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 pl-8 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="currentAmount" className="block text-gray-400 mb-2 font-medium">
              Current Amount (Optional)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">
                $
              </div>
              <input
                type="number"
                id="currentAmount"
                step="0.01"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 pl-8 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="0.00"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label htmlFor="deadline" className="block text-gray-400 mb-2 font-medium">
              Target Date (Optional)
            </label>
            <input
              type="date"
              id="deadline"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            icon={<Target size={20} />}
          >
            Create Goal
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default SavingsGoalForm;