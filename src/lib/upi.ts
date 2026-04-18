/**
 * Triggers a real UPI payment using the device's installed UPI apps (GPay, PhonePe, etc.)
 */
export const triggerUpiIntent = (vpa: string, name: string, amount: number, note: string) => {
  const upiUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  
  // Attempt to open the UPI link
  window.location.href = upiUrl;
};

/**
 * Manages the user's local balance (demo purposes)
 */
export const getBalance = (): number => {
  const saved = localStorage.getItem("trupay_balance");
  return saved ? parseFloat(saved) : 124580.45;
};

export const updateBalance = (amount: number, type: "debit" | "credit"): number => {
  const current = getBalance();
  const next = type === "debit" ? current - amount : current + amount;
  localStorage.setItem("trupay_balance", next.toString());
  return next;
};
