import Transaction, { ITransaction } from "../models/Transaction";
import { AppError } from "../middleware/errorHandler";
import { WalletService } from "./walletService";

export class TransactionService {
  static async createTransaction(
    userId: string,
    walletId: string,
    type: "income" | "expense",
    amount: number,
    category: string,
    date: Date,
    note?: string
  ): Promise<ITransaction> {
    const wallet = await WalletService.getWalletById(walletId, userId);

    const balanceChange = type === "income" ? amount : -amount;
    const newBalance = wallet.balance + balanceChange;

    if (newBalance < 0) {
      throw new AppError(
        `Số dư ví không đủ! Số dư hiện tại: ${wallet.balance.toLocaleString(
          "vi-VN"
        )}₫`,
        400
      );
    }

    const transaction = await Transaction.create({
      userId,
      walletId,
      type,
      amount,
      category,
      date,
      note,
    });

    await WalletService.updateBalance(walletId, userId, balanceChange);

    return transaction;
  }

  static async getTransactionsByDateRange(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ITransaction[]> {
    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = startDate;
      }
      if (endDate) {
        query.date.$lte = endDate;
      }
    }

    const transactions = await Transaction.find(query)
      .populate("walletId", "name")
      .sort({ date: -1, createdAt: -1 });

    return transactions;
  }

  static async deleteTransaction(
    transactionId: string,
    userId: string
  ): Promise<void> {
    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    });

    if (!transaction) {
      throw new AppError("Không tìm thấy giao dịch", 404);
    }

    const balanceChange =
      transaction.type === "income" ? -transaction.amount : transaction.amount;

    await WalletService.updateBalance(
      transaction.walletId.toString(),
      userId,
      balanceChange
    );

    await Transaction.deleteOne({ _id: transactionId });
  }
}
