export interface BankAccount {
  name: string;
  account: string;
  type: string;
  balance: number;
}

export const USER_BANKS: BankAccount[] = [
  { name: "HDFC Bank", account: "•••• 4421", type: "Savings", balance: 124580.45 },
  { name: "SBI Bank", account: "•••• 9876", type: "Savings", balance: 4520.00 },
  { name: "Axis Bank", account: "•••• 1234", type: "Current", balance: 8210.50 }
];
