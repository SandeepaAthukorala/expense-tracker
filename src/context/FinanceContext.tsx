import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FinanceData, Transaction, Category, Budget, SavingsGoal } from '../types';
import { getData, saveData, isStorageAvailable } from '../utils/storage';

interface FinanceContextType {
  data: FinanceData;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  updateSavingsGoalAmount: (id: string, amount: number) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [data, setData] = useState<FinanceData>({
    transactions: [],
    categories: [],
    budgets: [],
    savingsGoals: [],
  });

  // Load data from localStorage on initial render
  useEffect(() => {
    if (isStorageAvailable()) {
      const storedData = getData();
      setData(storedData);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isStorageAvailable() && data.categories.length > 0) {
      saveData(data);
    }
  }, [data]);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    };
    
    setData(prevData => ({
      ...prevData,
      transactions: [...prevData.transactions, newTransaction],
    }));
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setData(prevData => ({
      ...prevData,
      transactions: prevData.transactions.filter(transaction => transaction.id !== id),
    }));
  };

  // Add a new category
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
    };
    
    setData(prevData => ({
      ...prevData,
      categories: [...prevData.categories, newCategory],
    }));
  };

  // Update a category
  const updateCategory = (category: Category) => {
    setData(prevData => ({
      ...prevData,
      categories: prevData.categories.map(c => 
        c.id === category.id ? category : c
      ),
    }));
  };

  // Delete a category
  const deleteCategory = (id: string) => {
    setData(prevData => ({
      ...prevData,
      categories: prevData.categories.filter(category => category.id !== id),
      // Remove budgets associated with this category
      budgets: prevData.budgets.filter(budget => budget.categoryId !== id),
    }));
  };

  // Add a new budget
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: uuidv4(),
    };
    
    setData(prevData => ({
      ...prevData,
      budgets: [...prevData.budgets, newBudget],
    }));
  };

  // Update a budget
  const updateBudget = (budget: Budget) => {
    setData(prevData => ({
      ...prevData,
      budgets: prevData.budgets.map(b => 
        b.id === budget.id ? budget : b
      ),
    }));
  };

  // Delete a budget
  const deleteBudget = (id: string) => {
    setData(prevData => ({
      ...prevData,
      budgets: prevData.budgets.filter(budget => budget.id !== id),
    }));
  };

  // Add a new savings goal
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: uuidv4(),
    };
    
    setData(prevData => ({
      ...prevData,
      savingsGoals: [...prevData.savingsGoals, newGoal],
    }));
  };

  // Update a savings goal
  const updateSavingsGoal = (goal: SavingsGoal) => {
    setData(prevData => ({
      ...prevData,
      savingsGoals: prevData.savingsGoals.map(g => 
        g.id === goal.id ? goal : g
      ),
    }));
  };

  // Delete a savings goal
  const deleteSavingsGoal = (id: string) => {
    setData(prevData => ({
      ...prevData,
      savingsGoals: prevData.savingsGoals.filter(goal => goal.id !== id),
    }));
  };

  // Update a savings goal amount (for adding money to a goal)
  const updateSavingsGoalAmount = (id: string, amount: number) => {
    setData(prevData => ({
      ...prevData,
      savingsGoals: prevData.savingsGoals.map(goal => 
        goal.id === id 
          ? { ...goal, currentAmount: goal.currentAmount + amount } 
          : goal
      ),
    }));
  };

  const value = {
    data,
    addTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    updateSavingsGoalAmount,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};