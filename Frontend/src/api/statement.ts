import api from "./axios";
import type { WalletStatement, ApiResponse } from "../types";

export const statementApi = {
  getWalletStatement: async (
    walletId: string,
    startDate?: string,
    endDate?: string
  ): Promise<WalletStatement> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const { data } = await api.get<ApiResponse<WalletStatement>>(
      `/statements/wallet/${walletId}?${params.toString()}`
    );
    return data.data!;
  },

  getAllTransactions: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const { data } = await api.get(
      `/statements/transactions?${params.toString()}`
    );
    return data.data;
  },
};
