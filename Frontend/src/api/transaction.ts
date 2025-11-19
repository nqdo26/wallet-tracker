import api from "./axios";
import type { ApiResponse } from "../types";

export interface Transaction {
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

export interface CreateTransactionRequest {
  walletId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export const transactionApi = {
  getAll: async (
    startDate?: string,
    endDate?: string
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const { data } = await api.get<ApiResponse<Transaction[]>>(
      `/transactions?${params.toString()}`
    );
    return data.data!;
  },

  create: async (
    transaction: CreateTransactionRequest
  ): Promise<Transaction> => {
    const { data } = await api.post<ApiResponse<Transaction>>(
      "/transactions",
      transaction
    );
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
