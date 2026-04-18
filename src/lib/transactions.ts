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

export const addTransaction = (transaction: Omit<Transaction, "id" | "time">) => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: "tx-" + Date.now(),
    time: "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "success"
  };
  
  const updated = [newTransaction, ...transactions];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newTransaction;
};
