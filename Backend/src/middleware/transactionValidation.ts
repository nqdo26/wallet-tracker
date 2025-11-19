import { body, param } from "express-validator";

export const createTransactionValidation = [
  body("walletId")
    .notEmpty()
    .withMessage("Wallet ID is required")
    .isMongoId()
    .withMessage("Invalid wallet ID"),
  body("type")
    .notEmpty()
    .withMessage("Transaction type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category must be between 1 and 50 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("note")
    .optional()
    .isString()
    .withMessage("Note must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note must not exceed 500 characters"),
];

export const transactionIdValidation = [
  param("id").isMongoId().withMessage("Invalid transaction ID"),
];
