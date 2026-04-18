import { TRANSACTIONS as MOCK_DATA } from "@/data/mockData";

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'sent' | 'received';
  time: string;
  shielded?: boolean;
}

const STORAGE_KEY = 'trupay_transactions';

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  
  // For the hackathon demo, if we want NO dummy data for new users:
  return [];
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'time'>) => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: Math.random().toString(36).substr(2, 9),
    time: "Just now"
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newTransaction, ...transactions]));
};
