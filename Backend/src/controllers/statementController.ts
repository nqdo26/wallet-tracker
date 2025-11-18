import { Request, Response } from "express";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { StatementService } from "../services/statementService";
import { WalletService } from "../services/walletService";
import { IUser } from "../models/User";
import { WalletStatementDTO, TransactionItemDTO } from "../dto/statementDTO";
import { TransactionType } from "../models/Transaction";

export class StatementController {
  static getWalletStatement = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = req.user as IUser;
      const { walletId } = req.params;
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

      const wallet = await WalletService.getWalletById(
        walletId,
        user._id.toString()
      );

      const statement = await StatementService.getWalletStatement(
        walletId,
        user._id.toString(),
        start,
        end
      );

      let runningBalance = statement.openingBalance;
      const transactions: TransactionItemDTO[] = statement.transactions.map(
        (transaction) => {
          if (transaction.type === TransactionType.INCOME) {
            runningBalance += transaction.amount;
          } else {
            runningBalance -= transaction.amount;
          }

          return {
            id: transaction._id.toString(),
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            note: transaction.note,
            balanceAfter: runningBalance,
          };
        }
      );

      const response: WalletStatementDTO = {
        walletId: wallet._id.toString(),
        walletName: wallet.name,
        startDate: start || wallet.startDate,
        endDate: end || new Date(),
        openingBalance: statement.openingBalance,
        totalIncome: statement.totalIncome,
        totalExpense: statement.totalExpense,
        closingBalance: statement.closingBalance,
        transactions,
      };

      res.status(200).json({
        success: true,
        data: response,
      });
    }
  );

  static getAllTransactions = asyncHandler(
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

      const transactions = await StatementService.getAllTransactions(
        user._id.toString(),
        start,
        end
      );

      res.status(200).json({
        success: true,
        data: transactions,
      });
    }
  );
}
