import { Parser } from 'json2csv';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { Transaction, Category, FinanceData } from '../types';
import { formatCurrency, formatDate } from './formatters';

export const exportToCSV = (data: FinanceData) => {
  const transactions = data.transactions.map(transaction => {
    const category = data.categories.find(c => c.categoryId === transaction.categoryId);
    return {
      Date: formatDate(transaction.date),
      Type: transaction.type,
      Category: category?.name || 'Unknown',
      Amount: transaction.amount,
      Notes: transaction.notes,
      'Is Recurring': transaction.isRecurring ? 'Yes' : 'No',
      'Recurring Period': transaction.recurringPeriod || '',
      'Next Due Date': transaction.nextDueDate ? formatDate(transaction.nextDueDate) : '',
    };
  });

  const parser = new Parser();
  const csv = parser.parse(transactions);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `darkmoney_export_${formatDate(new Date().toISOString())}.csv`);
};

export const exportToPDF = (data: FinanceData) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Title
  doc.setFontSize(20);
  doc.text('DarkMoney Financial Report', 20, yPos);
  yPos += 20;

  // Summary
  doc.setFontSize(16);
  doc.text('Transaction Summary', 20, yPos);
  yPos += 10;

  // Group transactions by type
  const expenses = data.transactions.filter(t => t.type === 'expense');
  const income = data.transactions.filter(t => t.type === 'income');

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  doc.setFontSize(12);
  doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 20, yPos);
  yPos += 10;
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 20, yPos);
  yPos += 10;
  doc.text(`Net Balance: ${formatCurrency(totalIncome - totalExpenses)}`, 20, yPos);
  yPos += 20;

  // Recent Transactions
  doc.setFontSize(16);
  doc.text('Recent Transactions', 20, yPos);
  yPos += 10;

  const recentTransactions = [...data.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  doc.setFontSize(10);
  recentTransactions.forEach(transaction => {
    const category = data.categories.find(c => c.categoryId === transaction.categoryId);
    const text = `${formatDate(transaction.date)} - ${category?.name}: ${
      transaction.type === 'income' ? '+' : '-'
    }${formatCurrency(transaction.amount)}`;
    
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(text, 20, yPos);
    yPos += 7;
  });

  const blob = doc.output('blob');
  saveAs(blob, `darkmoney_report_${formatDate(new Date().toISOString())}.pdf`);
};