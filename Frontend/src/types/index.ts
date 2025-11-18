export const WalletType = {
  BANK: "bank",
  CASH: "cash",
  E_WALLET: "e-wallet",
  CREDIT_CARD: "credit-card",
  OTHER: "other",
} as const;

export type WalletType = typeof WalletType[keyof typeof WalletType];

export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  initialBalance: number;
  balance: number;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note?: string;
  balanceAfter: number;
}

export interface WalletStatement {
  walletId: string;
  walletName: string;
  startDate: string;
  endDate: string;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  transactions: Transaction[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface CreateWalletRequest {
  name: string;
  type: WalletType;
  initialBalance: number;
  startDate?: string;
}

export interface UpdateWalletRequest {
  name?: string;
  type?: WalletType;
}
