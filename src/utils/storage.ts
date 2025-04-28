import { FinanceData } from '../types';

const STORAGE_KEY = 'finance_data';

// Default categories with emojis
const defaultCategories = [
  { id: '1', name: 'Food', emoji: '🍔', color: '#FF3C78', type: 'expense' },
  { id: '2', name: 'Transport', emoji: '🚗', color: '#4FC3F7', type: 'expense' },
  { id: '3', name: 'Shopping', emoji: '🛍️', color: '#FFC107', type: 'expense' },
  { id: '4', name: 'Entertainment', emoji: '🎬', color: '#9C27B0', type: 'expense' },
  { id: '5', name: 'Bills', emoji: '📝', color: '#F44336', type: 'expense' },
  { id: '6', name: 'Health', emoji: '💊', color: '#00E676', type: 'expense' },
  { id: '7', name: 'Salary', emoji: '💰', color: '#00E676', type: 'income' },
  { id: '8', name: 'Freelance', emoji: '💻', color: '#4FC3F7', type: 'income' },
  { id: '9', name: 'Gifts', emoji: '🎁', color: '#FF3C78', type: 'income' },
];

// Initial state
const initialState: FinanceData = {
  transactions: [],
  categories: defaultCategories,
  budgets: [],
  savingsGoals: [],
};

// Get data from localStorage
export const getData = (): FinanceData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return initialState;
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return initialState;
  }
};

// Save data to localStorage
export const saveData = (data: FinanceData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Reset to initial state (for testing)
export const resetData = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
};

// Check if localStorage is available
export const isStorageAvailable = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};