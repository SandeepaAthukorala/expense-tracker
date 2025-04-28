import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Wallet, TrendingUp } from 'lucide-react';
import Button from './Button';

interface FloatingActionProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
}

const FloatingAction: React.FC<FloatingActionProps> = ({ onAddExpense, onAddIncome }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const variants = {
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: { 
      opacity: 0,
      y: 10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
  };

  return (
    <div className="fixed bottom-20 right-5 sm:bottom-24 sm:right-8 z-20 flex flex-col-reverse items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={variants}
              transition={{ delay: 0.1 }}
              className="mb-2"
            >
              <Button
                variant="success"
                size="icon"
                onClick={() => {
                  onAddIncome();
                  setIsOpen(false);
                }}
                icon={<TrendingUp size={20} />}
                className="shadow-neon-green"
              />
            </motion.div>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={variants}
              className="mb-2"
            >
              <Button
                variant="danger"
                size="icon"
                onClick={() => {
                  onAddExpense();
                  setIsOpen(false);
                }}
                icon={<Wallet size={20} />}
                className="shadow-neon-red"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.div 
        whileTap={{ scale: 0.9 }} 
        whileHover={{ scale: 1.1 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Button
          variant="primary"
          size="icon"
          onClick={toggleMenu}
          className="h-14 w-14 shadow-neon"
          icon={<Plus size={24} />}
        />
      </motion.div>
    </div>
  );
};

export default FloatingAction;