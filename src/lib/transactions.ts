import { Transaction, TRANSACTIONS } from "@/data/mockData";

const STORAGE_KEY = "trupay_transactions";

export const getTransactions = (): Transaction[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    // Initialize with mock data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(TRANSACTIONS));
    return TRANSACTIONS;
  }
  return JSON.parse(saved);
};

export const addTransaction = (transaction: Omit<Transaction, "id" | "time" | "status"> & { status?: string }) => {
  const transactions = getTransactions();
  const now = new Date();
  
  // Generate a realistic UPI Transaction ID
  const txnId = Math.random().toString().slice(2, 14);
  
  const newTransaction: Transaction = {
    ...transaction,
    id: txnId,
    time: now.toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    status: transaction.status || "Success"
  };
  
  const updated = [newTransaction, ...transactions];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newTransaction;
};
