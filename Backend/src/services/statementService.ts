import Transaction, {
  ITransaction,
  TransactionType,
} from "../models/Transaction";
import Wallet from "../models/Wallet";
import { AppError } from "../middleware/errorHandler";
import { WalletService } from "./walletService";

export interface WalletStatementResult {
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  transactions: ITransaction[];
}

export class StatementService {
  static async getWalletStatement(
    walletId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<WalletStatementResult> {
    const wallet = await WalletService.getWalletById(walletId, userId);
    const start = startDate || new Date(wallet.startDate);
    const end = endDate || new Date();

    if (start > end) {
      throw new AppError("Start date cannot be after end date", 400);
    }

    const openingBalance = await this.calculateOpeningBalance(
      walletId,
      userId,
      start
    );

    const transactions = await Transaction.find({
      userId,
      walletId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1, createdAt: 1 });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === TransactionType.INCOME) {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    const closingBalance = openingBalance + totalIncome - totalExpense;

    return {
      openingBalance,
      totalIncome,
      totalExpense,
      closingBalance,
      transactions,
    };
  }

  private static async calculateOpeningBalance(
    walletId: string,
    userId: string,
    startDate: Date
  ): Promise<number> {
    const wallet = await Wallet.findOne({ _id: walletId, userId });

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    if (startDate <= wallet.startDate) {
      return wallet.initialBalance;
    }

    const transactionsBefore = await Transaction.find({
      userId,
      walletId,
      date: { $lt: startDate },
    });

    let balance = wallet.initialBalance;

    transactionsBefore.forEach((transaction) => {
      if (transaction.type === TransactionType.INCOME) {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    });

    return balance;
  }

  static async getAllTransactions(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ITransaction[]> {
    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const transactions = await Transaction.find(query)
      .populate("walletId", "name type")
      .sort({ date: -1, createdAt: -1 });

    return transactions;
  }
}
