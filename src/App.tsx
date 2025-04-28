import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import TransactionForm from './components/Transactions/TransactionForm';
import CategoryForm from './components/Categories/CategoryForm';
import CategoryList from './components/Categories/CategoryList';
import BudgetForm from './components/Budget/BudgetForm';
import BudgetList from './components/Budget/BudgetList';
import SavingsGoalForm from './components/Savings/SavingsGoalForm';
import SavingsList from './components/Savings/SavingsList';
import FloatingAction from './components/ui/FloatingAction';
import FloatingBalance from './components/ui/FloatingBalance';

function App() {
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [showCategoryList, setShowCategoryList] = useState<boolean>(false);
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);
  const [showBudgetList, setShowBudgetList] = useState<boolean>(false);
  const [showSavingsForm, setShowSavingsForm] = useState<boolean>(false);
  const [showSavingsList, setShowSavingsList] = useState<boolean>(false);

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background text-white flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <Dashboard />
        </main>
        
        <Navigation
          onCategoriesClick={() => setShowCategoryList(true)}
          onBudgetsClick={() => setShowBudgetList(true)}
          onSavingsClick={() => setShowSavingsList(true)}
        />
        
        <FloatingAction
          onAddExpense={() => setShowExpenseForm(true)}
          onAddIncome={() => setShowIncomeForm(true)}
        />
        
        <FloatingBalance />
        
        <AnimatePresence>
          {showExpenseForm && (
            <TransactionForm
              type="expense"
              onClose={() => setShowExpenseForm(false)}
            />
          )}
          
          {showIncomeForm && (
            <TransactionForm
              type="income"
              onClose={() => setShowIncomeForm(false)}
            />
          )}
          
          {showCategoryForm && (
            <CategoryForm onClose={() => setShowCategoryForm(false)} />
          )}
          
          {showCategoryList && (
            <CategoryList
              onClose={() => setShowCategoryList(false)}
              onAddCategory={() => {
                setShowCategoryList(false);
                setShowCategoryForm(true);
              }}
            />
          )}
          
          {showBudgetForm && (
            <BudgetForm onClose={() => setShowBudgetForm(false)} />
          )}
          
          {showBudgetList && (
            <BudgetList
              onClose={() => setShowBudgetList(false)}
              onAddBudget={() => {
                setShowBudgetList(false);
                setShowBudgetForm(true);
              }}
            />
          )}
          
          {showSavingsForm && (
            <SavingsGoalForm onClose={() => setShowSavingsForm(false)} />
          )}
          
          {showSavingsList && (
            <SavingsList
              onClose={() => setShowSavingsList(false)}
              onAddSavingsGoal={() => {
                setShowSavingsList(false);
                setShowSavingsForm(true);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </FinanceProvider>
  );
}

export default App;