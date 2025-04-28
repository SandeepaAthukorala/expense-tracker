import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
}) => {
  // Base styles
  const baseStyles = 'rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-400',
    secondary: 'bg-blue-400 hover:bg-blue-500 text-white focus:ring-blue-300',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
    outline: 'bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 focus:ring-gray-500',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
    icon: 'p-2',
  };
  
  // Get appropriate styles based on props
  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span>{icon}</span>}
        {children}
      </div>
    </motion.button>
  );
};

export default Button;