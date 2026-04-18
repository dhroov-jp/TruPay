export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  type: 'Savings' | 'Current';
  isDefault: boolean;
  logo: string;
}

const STORAGE_KEY = 'trupay_bank_accounts';

const DEFAULT_BANKS: BankAccount[] = [
  {
    id: '1',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXX 4589',
    type: 'Savings',
    isDefault: true,
    logo: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/61f4d9b7-1f48-4e89-9a03-72210519a79a?'
  },
  {
    id: '2',
    bankName: 'ICICI Bank',
    accountNumber: 'XXXX 1234',
    type: 'Savings',
    isDefault: false,
    logo: 'https://www.icicibank.com/content/dam/icicibank/india/assets/images/header/logo.png'
  }
];

export const getBankAccounts = (): BankAccount[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_BANKS;
    }
  }
  return DEFAULT_BANKS;
};

export const saveBankAccounts = (accounts: BankAccount[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

export const addBankAccount = (account: Omit<BankAccount, 'id' | 'isDefault'>) => {
  const accounts = getBankAccounts();
  const newAccount: BankAccount = {
    ...account,
    id: Math.random().toString(36).substr(2, 9),
    isDefault: accounts.length === 0
  };
  saveBankAccounts([...accounts, newAccount]);
};

export const removeBankAccount = (id: string) => {
  const accounts = getBankAccounts().filter(acc => acc.id !== id);
  if (accounts.length > 0 && !accounts.some(acc => acc.isDefault)) {
    accounts[0].isDefault = true;
  }
  saveBankAccounts(accounts);
};

export const setDefaultAccount = (id: string) => {
  const accounts = getBankAccounts().map(acc => ({
    ...acc,
    isDefault: acc.id === id
  }));
  saveBankAccounts(accounts);
};
