import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { getRandomTip } from '../../utils/formatters';

const FinancialTip: React.FC = () => {
  const [tip, setTip] = useState<string>(getRandomTip());

  // Change tip every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTip(getRandomTip());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 mb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={tip}
          className="bg-gray-800 rounded-xl p-4 border border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Lightbulb size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Did you know?</p>
              <p className="text-sm text-gray-400">{tip}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FinancialTip;