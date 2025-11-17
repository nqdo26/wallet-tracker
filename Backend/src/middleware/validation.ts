import { body, param } from "express-validator";
import { WalletType } from "../models/Wallet";

export const createWalletValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Wallet name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Wallet name must be between 1 and 50 characters"),
  body("type")
    .notEmpty()
    .withMessage("Wallet type is required")
    .isIn(Object.values(WalletType))
    .withMessage("Invalid wallet type"),
  body("initialBalance")
    .notEmpty()
    .withMessage("Initial balance is required")
    .isFloat({ min: 0 })
    .withMessage("Initial balance must be a non-negative number"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
];

export const updateWalletValidation = [
  param("id").isMongoId().withMessage("Invalid wallet ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Wallet name must be between 1 and 50 characters"),
  body("type")
    .optional()
    .isIn(Object.values(WalletType))
    .withMessage("Invalid wallet type"),
];

export const walletIdValidation = [
  param("id").isMongoId().withMessage("Invalid wallet ID"),
];
