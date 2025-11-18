import { TransactionType } from "../models/Transaction";

export interface WalletStatementDTO {
  walletId: string;
  walletName: string;
  startDate: Date;
  endDate: Date;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  transactions: TransactionItemDTO[];
}

export interface TransactionItemDTO {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: Date;
  note?: string;
  balanceAfter: number;
}

export interface StatementQueryDTO {
  startDate?: string;
  endDate?: string;
}
