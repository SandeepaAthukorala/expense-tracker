import React from 'react';
import DashboardSummary from './DashboardSummary';
import ExpensePieChart from './ExpensePieChart';
import RecentTransactions from './RecentTransactions';
import FinancialTip from './FinancialTip';

const Dashboard: React.FC = () => {
  return (
    <div className="px-4 pt-4">
      <DashboardSummary />
      <ExpensePieChart />
      <RecentTransactions />
      <FinancialTip />
    </div>
  );
};

export default Dashboard;