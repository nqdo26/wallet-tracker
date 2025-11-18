import api from "./axios";
import type {
  Wallet,
  ApiResponse,
  CreateWalletRequest,
  UpdateWalletRequest,
} from "../types";

export const walletApi = {
  getAll: async (): Promise<Wallet[]> => {
    const { data } = await api.get<ApiResponse<Wallet[]>>("/wallets");
    return data.data!;
  },

  getById: async (id: string): Promise<Wallet> => {
    const { data } = await api.get<ApiResponse<Wallet>>(`/wallets/${id}`);
    return data.data!;
  },

  create: async (wallet: CreateWalletRequest): Promise<Wallet> => {
    const { data } = await api.post<ApiResponse<Wallet>>("/wallets", wallet);
    return data.data!;
  },

  update: async (id: string, updates: UpdateWalletRequest): Promise<Wallet> => {
    const { data } = await api.put<ApiResponse<Wallet>>(
      `/wallets/${id}`,
      updates
    );
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/wallets/${id}`);
  },
};
