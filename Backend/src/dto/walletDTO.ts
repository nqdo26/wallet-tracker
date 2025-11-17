import { WalletType } from "../models/Wallet";

export interface CreateWalletDTO {
  name: string;
  type: WalletType;
  initialBalance: number;
  startDate?: Date;
}

export interface UpdateWalletDTO {
  name?: string;
  type?: WalletType;
}

export interface WalletResponseDTO {
  id: string;
  name: string;
  type: WalletType;
  initialBalance: number;
  balance: number;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
