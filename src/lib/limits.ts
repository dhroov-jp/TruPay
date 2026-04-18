import { getTransactions } from "./transactions";

const LIMIT_KEY = "trupay_daily_limit";

export const getDailyLimit = (): number => {
  const saved = localStorage.getItem(LIMIT_KEY);
  return saved ? parseInt(saved, 10) : 100000; // Default 1 Lakh
};

export const setDailyLimit = (limit: number) => {
  localStorage.setItem(LIMIT_KEY, limit.toString());
};

export const getTodaySpent = (): number => {
  const transactions = getTransactions();
  const today = new Date().toLocaleDateString();
  
  return transactions
    .filter(t => t.time.includes("Today") || t.time.includes(today)) // Simple check for today
    .filter(t => t.type === "sent")
    .reduce((sum, t) => sum + t.amount, 0);
};

export const canMakePayment = (amount: number): { canPay: boolean; remaining: number } => {
  const limit = getDailyLimit();
  const spent = getTodaySpent();
  const remaining = limit - spent;
  
  return {
    canPay: amount <= remaining,
    remaining
  };
};
