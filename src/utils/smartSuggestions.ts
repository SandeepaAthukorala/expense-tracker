import { Transaction, Category, SmartSuggestion, SpendAnalysis } from '../types';
import { startOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const SUBSCRIPTION_KEYWORDS = ['netflix', 'spotify', 'subscription', 'membership'];
const FOOD_DELIVERY_KEYWORDS = ['uber eats', 'doordash', 'grubhub', 'delivery'];
const TRANSPORT_KEYWORDS = ['uber', 'lyft', 'taxi'];

export const generateSmartSuggestions = (
  transactions: Transaction[],
  categories: Category[],
  analysis: SpendAnalysis
): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];

  // Analyze recurring subscriptions
  const subscriptionSuggestions = analyzeSubscriptions(transactions);
  suggestions.push(...subscriptionSuggestions);

  // Analyze food delivery habits
  const foodDeliverySuggestions = analyzeFoodDelivery(transactions);
  suggestions.push(...foodDeliverySuggestions);

  // Analyze transport spending
  const transportSuggestions = analyzeTransport(transactions);
  suggestions.push(...transportSuggestions);

  // Generate savings suggestions based on spending patterns
  const savingsSuggestions = generateSavingsSuggestions(analysis);
  suggestions.push(...savingsSuggestions);

  return suggestions;
};

const analyzeSubscriptions = (transactions: Transaction[]): SmartSuggestion[] => {
  const subscriptionTransactions = transactions.filter(t =>
    SUBSCRIPTION_KEYWORDS.some(keyword =>
      t.notes?.toLowerCase().includes(keyword)
    )
  );

  const totalSubscriptionCost = subscriptionTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  if (totalSubscriptionCost > 50) {
    return [{
      id: uuidv4(),
      type: 'saving',
      title: 'Review Your Subscriptions',
      description: `You're spending $${totalSubscriptionCost.toFixed(2)} monthly on subscriptions. Consider reviewing and canceling unused ones.`,
      potentialSavings: totalSubscriptionCost * 0.3, // Assume 30% can be saved
      confidence: 0.8,
      implementationSteps: [
        'List all your active subscriptions',
        'Identify services you rarely use',
        'Cancel or downgrade unnecessary subscriptions',
        'Consider sharing family plans for better value'
      ]
    }];
  }

  return [];
};

const analyzeFoodDelivery = (transactions: Transaction[]): SmartSuggestion[] => {
  const deliveryTransactions = transactions.filter(t =>
    FOOD_DELIVERY_KEYWORDS.some(keyword =>
      t.notes?.toLowerCase().includes(keyword)
    )
  );

  const totalDeliveryCost = deliveryTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  if (totalDeliveryCost > 100) {
    const weeklyAverage = totalDeliveryCost / 4;
    return [{
      id: uuidv4(),
      type: 'spending',
      title: 'Reduce Food Delivery Expenses',
      description: `You're spending about $${weeklyAverage.toFixed(2)} weekly on food delivery. Cooking at home could save you significantly.`,
      potentialSavings: totalDeliveryCost * 0.7, // Assume 70% can be saved
      category: 'Food',
      confidence: 0.85,
      implementationSteps: [
        'Plan your meals for the week',
        'Buy groceries in bulk',
        'Prepare meals in advance',
        'Limit food delivery to once a week'
      ]
    }];
  }

  return [];
};

const analyzeTransport = (transactions: Transaction[]): SmartSuggestion[] => {
  const transportTransactions = transactions.filter(t =>
    TRANSPORT_KEYWORDS.some(keyword =>
      t.notes?.toLowerCase().includes(keyword)
    )
  );

  const totalTransportCost = transportTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  if (totalTransportCost > 200) {
    return [{
      id: uuidv4(),
      type: 'saving',
      title: 'Optimize Transportation Costs',
      description: `You could save $${(totalTransportCost * 0.4).toFixed(2)} by using public transport or carpooling more often.`,
      potentialSavings: totalTransportCost * 0.4,
      category: 'Transport',
      confidence: 0.75,
      implementationSteps: [
        'Check public transport routes and schedules',
        'Consider monthly transit passes',
        'Look for carpooling opportunities',
        'Plan trips in advance to combine errands'
      ]
    }];
  }

  return [];
};

const generateSavingsSuggestions = (analysis: SpendAnalysis): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];

  // Suggest automatic savings based on spending patterns
  const monthlyIncome = 5000; // This should come from actual data
  const currentSavingsRate = (monthlyIncome - analysis.totalComparison.currentTotal) / monthlyIncome;

  if (currentSavingsRate < 0.2) {
    const recommendedSavings = monthlyIncome * 0.2;
    suggestions.push({
      id: uuidv4(),
      type: 'saving',
      title: 'Boost Your Savings',
      description: `Set up automatic savings of $${(recommendedSavings / 4).toFixed(2)} weekly to reach the recommended 20% savings rate.`,
      potentialSavings: recommendedSavings,
      confidence: 0.9,
      implementationSteps: [
        'Set up automatic transfers to savings',
        'Start with small weekly transfers',
        'Gradually increase the amount',
        'Review and adjust monthly'
      ]
    });
  }

  // Add suggestions for unusual spending categories
  analysis.unusualSpending.forEach(spending => {
    suggestions.push({
      id: uuidv4(),
      type: 'spending',
      title: `High ${spending.name} Spending`,
      description: `Your ${spending.name} spending is ${spending.percentageAboveNormal.toFixed(0)}% higher than usual. Consider setting a budget.`,
      potentialSavings: spending.amount * 0.3,
      category: spending.name,
      confidence: 0.7,
      implementationSteps: [
        `Review your ${spending.name} expenses`,
        'Identify unnecessary purchases',
        'Set a realistic budget',
        'Track spending regularly'
      ]
    });
  });

  return suggestions;
};