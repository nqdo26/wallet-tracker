import Wallet, { IWallet, WalletType } from "../models/Wallet";
import Transaction from "../models/Transaction";
import { AppError } from "../middleware/errorHandler";
import mongoose from "mongoose";

export class WalletService {
  static async createWallet(
    userId: string,
    name: string,
    type: WalletType,
    initialBalance: number,
    startDate?: Date
  ): Promise<IWallet> {
    if (initialBalance < 0) {
      throw new AppError("Initial balance cannot be negative", 400);
    }

    const wallet = await Wallet.create({
      userId,
      name,
      type,
      initialBalance,
      balance: initialBalance,
      startDate: startDate || new Date(),
    });

    return wallet;
  }

  static async getWalletsByUserId(userId: string): Promise<IWallet[]> {
    const wallets = await Wallet.find({ userId }).sort({ createdAt: -1 });
    return wallets;
  }

  static async getWalletById(
    walletId: string,
    userId: string
  ): Promise<IWallet> {
    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      throw new AppError("Invalid wallet ID", 400);
    }

    const wallet = await Wallet.findOne({ _id: walletId, userId });

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    return wallet;
  }

  static async updateWallet(
    walletId: string,
    userId: string,
    updates: { name?: string; type?: WalletType }
  ): Promise<IWallet> {
    const wallet = await this.getWalletById(walletId, userId);

    if (updates.name !== undefined) {
      wallet.name = updates.name;
    }

    if (updates.type !== undefined) {
      wallet.type = updates.type;
    }

    await wallet.save();
    return wallet;
  }

  static async deleteWallet(walletId: string, userId: string): Promise<void> {
    const wallet = await this.getWalletById(walletId, userId);

    await Transaction.deleteMany({ walletId: wallet._id });

    await wallet.deleteOne();
  }

  static async updateBalance(
    walletId: string,
    userId: string,
    amount: number
  ): Promise<IWallet> {
    const wallet = await this.getWalletById(walletId, userId);

    const newBalance = wallet.balance + amount;

    if (newBalance < 0) {
      throw new AppError(
        "Insufficient balance. Transaction would result in negative balance",
        400
      );
    }

    wallet.balance = newBalance;
    await wallet.save();

    return wallet;
  }

  static async getUserWalletCount(userId: string): Promise<number> {
    return await Wallet.countDocuments({ userId });
  }

  static async hasWallets(userId: string): Promise<boolean> {
    const count = await this.getUserWalletCount(userId);
    return count > 0;
  }
}
