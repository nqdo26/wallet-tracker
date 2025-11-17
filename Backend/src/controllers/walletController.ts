import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { WalletService } from "../services/walletService";
import { IUser } from "../models/User";
import {
  CreateWalletDTO,
  UpdateWalletDTO,
  WalletResponseDTO,
} from "../dto/walletDTO";
import { IWallet } from "../models/Wallet";

export class WalletController {
  static createWallet = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const user = req.user as IUser;
      const { name, type, initialBalance, startDate }: CreateWalletDTO =
        req.body;

      const wallet = await WalletService.createWallet(
        user._id.toString(),
        name,
        type,
        initialBalance,
        startDate ? new Date(startDate) : undefined
      );

      const response: WalletResponseDTO = {
        id: wallet._id.toString(),
        name: wallet.name,
        type: wallet.type,
        initialBalance: wallet.initialBalance,
        balance: wallet.balance,
        startDate: wallet.startDate,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      };

      res.status(201).json({
        success: true,
        message: "Wallet created successfully",
        data: response,
      });
    }
  );

  static getWallets = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = req.user as IUser;

      const wallets = await WalletService.getWalletsByUserId(
        user._id.toString()
      );

      const response: WalletResponseDTO[] = wallets.map((wallet: IWallet) => ({
        id: wallet._id.toString(),
        name: wallet.name,
        type: wallet.type,
        initialBalance: wallet.initialBalance,
        balance: wallet.balance,
        startDate: wallet.startDate,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      }));

      res.status(200).json({
        success: true,
        data: response,
      });
    }
  );

  static getWalletById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const user = req.user as IUser;
      const { id } = req.params;

      const wallet = await WalletService.getWalletById(id, user._id.toString());

      const response: WalletResponseDTO = {
        id: wallet._id.toString(),
        name: wallet.name,
        type: wallet.type,
        initialBalance: wallet.initialBalance,
        balance: wallet.balance,
        startDate: wallet.startDate,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      };

      res.status(200).json({
        success: true,
        data: response,
      });
    }
  );

  static updateWallet = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const user = req.user as IUser;
      const { id } = req.params;
      const updates: UpdateWalletDTO = req.body;

      const wallet = await WalletService.updateWallet(
        id,
        user._id.toString(),
        updates
      );

      const response: WalletResponseDTO = {
        id: wallet._id.toString(),
        name: wallet.name,
        type: wallet.type,
        initialBalance: wallet.initialBalance,
        balance: wallet.balance,
        startDate: wallet.startDate,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      };

      res.status(200).json({
        success: true,
        message: "Wallet updated successfully",
        data: response,
      });
    }
  );

  static deleteWallet = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const user = req.user as IUser;
      const { id } = req.params;

      await WalletService.deleteWallet(id, user._id.toString());

      res.status(200).json({
        success: true,
        message: "Wallet deleted successfully",
      });
    }
  );
}
