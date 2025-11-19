export interface CreateTransactionDTO {
  walletId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export interface TransactionResponseDTO {
  id: string;
  walletId: string;
  walletName?: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt: string;
}
