import React from 'react';
import { motion } from 'framer-motion';
import { Home, Wallet, BarChart3, PiggyBank, Menu, Settings } from 'lucide-react';

type NavigationItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

interface NavigationProps {
  onCategoriesClick: () => void;
  onBudgetsClick: () => void;
  onSavingsClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onCategoriesClick,
  onBudgetsClick,
  onSavingsClick,
}) => {
  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: <Home size={24} />,
      onClick: () => {}, // No action, always on dashboard
    },
    {
      label: 'Categories',
      icon: <Menu size={24} />,
      onClick: onCategoriesClick,
    },
    {
      label: 'Budgets',
      icon: <BarChart3 size={24} />,
      onClick: onBudgetsClick,
    },
    {
      label: 'Savings',
      icon: <PiggyBank size={24} />,
      onClick: onSavingsClick,
    },
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-10"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item, index) => (
          <motion.button
            key={index}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-white"
            whileTap={{ scale: 0.9 }}
            onClick={item.onClick}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Navigation;