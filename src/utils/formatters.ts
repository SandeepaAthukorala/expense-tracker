// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Get today's date in YYYY-MM-DD format for input fields
export const getTodayFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format percentage
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
};

// Generate a random financial tip
export const getRandomTip = (): string => {
  const tips = [
    "Saving $5/day = $150/month 🚀",
    "The 50/30/20 rule: 50% needs, 30% wants, 20% savings 💎",
    "Track every expense for a month to find hidden savings 🔍",
    "Paying yourself first is the best budgeting strategy 💰",
    "Emergency fund goal: 3-6 months of expenses 🛡️",
    "Automate your savings to build wealth on autopilot ⚙️",
    "A latte a day = $1,000+ per year ☕",
    "Review subscriptions monthly to cut unused services 📱",
    "Debt snowball: Pay smallest debts first for motivation 🏂",
    "Increase your income, not just your savings 📈"
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};