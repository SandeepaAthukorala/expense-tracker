import React from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 p-4 flex items-center justify-between sticky top-0 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Moon size={24} className="text-pink-500" />
        </motion.div>
        <h1 className="text-xl font-bold text-white">
          <span className="text-pink-500">Dark</span>Money
        </h1>
      </motion.div>
    </motion.header>
  );
};

export default Header;