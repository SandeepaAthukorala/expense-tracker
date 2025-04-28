import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, DollarSign } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getSavingsGoalProgress } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../ui/Button';
import ProgressCircle from '../ui/ProgressCircle';
import Card from '../ui/Card';

interface AddFundsModalProps {
  goalId: string;
  goalName: string;
  onClose: () => void;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ goalId, goalName, onClose }) => {
  const { updateSavingsGoalAmount } = useFinance();
  const [amount, setAmount] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) return;
    
    updateSavingsGoalAmount(goalId, parseFloat(amount));
    onClose();
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 w-full max-w-md rounded-xl p-5"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <h3 className="text-lg font-bold text-white mb-4">Add to "{goalName}"</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="addAmount" className="block text-gray-400 mb-2 font-medium">
              Amount to Add
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">
                $
              </div>
              <input
                type="number"
                id="addAmount"
                step="0.01"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 pl-8 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              fullWidth
              icon={<DollarSign size={18} />}
            >
              Add Funds
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

interface SavingsListProps {
  onClose: () => void;
  onAddSavingsGoal: () => void;
}

const SavingsList: React.FC<SavingsListProps> = ({ onClose, onAddSavingsGoal }) => {
  const { data, deleteSavingsGoal } = useFinance();
  const { savingsGoals } = data;
  
  const [showAddFunds, setShowAddFunds] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<{ id: string; name: string } | null>(null);
  
  const handleAddFunds = (id: string, name: string) => {
    setSelectedGoal({ id, name });
    setShowAddFunds(true);
  };
  
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
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
          <div className="w-8"></div> {/* Empty div for flex alignment */}
        </div>
        
        <div className="mb-6">
          <Button
            variant="primary"
            fullWidth
            onClick={onAddSavingsGoal}
            icon={<Plus size={20} />}
          >
            New Savings Goal
          </Button>
        </div>
        
        {savingsGoals.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400">No savings goals yet</p>
            <p className="text-sm text-gray-500">Create a goal to start saving!</p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {savingsGoals.map((goal) => {
              const { percentage, remaining } = getSavingsGoalProgress(goal);
              
              return (
                <motion.div
                  key={goal.id}
                  className="bg-gray-800 rounded-xl p-4"
                  variants={item}
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium text-lg">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-xs text-gray-400">Target: {formatDate(goal.deadline)}</p>
                      )}
                    </div>
                    <ProgressCircle
                      percentage={percentage}
                      size={60}
                      strokeWidth={8}
                      progressColor="#4FC3F7"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">{formatCurrency(goal.currentAmount)}</span>
                        <span className="text-gray-400">/ {formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {percentage >= 100 ? (
                          <span className="text-green-500">Goal reached! 🎉</span>
                        ) : (
                          <span>Still need: {formatCurrency(remaining)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => deleteSavingsGoal(goal.id)}
                      icon={<Trash2 size={16} />}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => handleAddFunds(goal.id, goal.name)}
                      icon={<DollarSign size={16} />}
                    >
                      Add Funds
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
      
      {showAddFunds && selectedGoal && (
        <AddFundsModal
          goalId={selectedGoal.id}
          goalName={selectedGoal.name}
          onClose={() => setShowAddFunds(false)}
        />
      )}
    </motion.div>
  );
};

export default SavingsList;