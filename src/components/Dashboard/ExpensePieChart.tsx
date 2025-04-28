import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { getExpensesByCategory } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/Card';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { category: { name: string; emoji: string }; amount: number };
  }>;
}

const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-700">
        <p className="flex items-center gap-1 font-medium">
          {data.category.emoji} {data.category.name}
        </p>
        <p className="text-pink-500 font-bold">{formatCurrency(data.amount)}</p>
      </div>
    );
  }
  return null;
};

const ExpensePieChart: React.FC = () => {
  const { data } = useFinance();
  const { transactions, categories } = data;

  const expensesByCategory = getExpensesByCategory(transactions, categories, 'month');
  
  // Convert to pie chart data
  const chartData = expensesByCategory.map(item => ({
    name: item.category.name,
    value: item.amount,
    category: item.category,
  }));

  if (chartData.length === 0) {
    return (
      <Card className="h-64 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>No expenses this month</p>
          <p className="text-sm">Add expenses to see the breakdown</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-64">
      <h3 className="text-white font-medium mb-2">Monthly Expenses</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={750}
            animationBegin={0}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.category.color || '#FF3C78'} 
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ExpensePieChart;