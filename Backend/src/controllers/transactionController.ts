import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { TransactionService } from "../services/transactionService";
import { IUser } from "../models/User";
import {
  CreateTransactionDTO,
  TransactionResponseDTO,
} from "../dto/transactionDTO";

export class TransactionController {
  static createTransaction = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const user = req.user as IUser;
      const {
        walletId,
        type,
        amount,
        category,
        date,
        note,
      }: CreateTransactionDTO = req.body;

      const transaction = await TransactionService.createTransaction(
        user._id.toString(),
        walletId,
        type,
        amount,
        category,
        new Date(date),
        note
      );

      const response: TransactionResponseDTO = {
        id: transaction._id.toString(),
        walletId: transaction.walletId.toString(),
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date.toISOString(),
        note: transaction.note,
        createdAt: transaction.createdAt.toISOString(),
      };

      res.status(201).json({
        success: true,
        data: response,
      });
    }
  );

  static getTransactions = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = req.user as IUser;
      const { startDate, endDate } = req.query;

      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate) {
        start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
          throw new AppError("Invalid start date format", 400);
        }
      }

      if (endDate) {
        end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
          throw new AppError("Invalid end date format", 400);
        }
      }

      const transactions = await TransactionService.getTransactionsByDateRange(
        user._id.toString(),
        start,
        end
      );

      const response: TransactionResponseDTO[] = transactions.map((t) => {
        const walletData = t.walletId as any;
        return {
          id: t._id.toString(),
          walletId:
            typeof walletData === "object"
              ? walletData._id.toString()
              : t.walletId.toString(),
          walletName:
            typeof walletData === "object" ? walletData.name : undefined,
          type: t.type,
          amount: t.amount,
          category: t.category,
          date: t.date.toISOString(),
          note: t.note,
          createdAt: t.createdAt.toISOString(),
        };
      });

      res.status(200).json({
        success: true,
        data: response,
      });
    }
  );

  static deleteTransaction = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = req.user as IUser;
      const { id } = req.params;

      await TransactionService.deleteTransaction(id, user._id.toString());

      res.status(200).json({
        success: true,
        message: "Xóa giao dịch thành công",
      });
    }
  );
}
