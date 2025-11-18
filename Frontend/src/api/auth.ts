import api from "./axios";
import type { User, ApiResponse } from "../types";

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
  },

  loginWithGoogle: (): void => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },
};
