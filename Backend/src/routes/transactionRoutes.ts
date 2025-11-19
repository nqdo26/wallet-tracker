import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";
import { authenticate } from "../middleware/auth";
import {
  createTransactionValidation,
  transactionIdValidation,
} from "../middleware/transactionValidation";

const router = Router();

router.post(
  "/",
  authenticate,
  createTransactionValidation,
  TransactionController.createTransaction
);

router.get("/", authenticate, TransactionController.getTransactions);

router.delete(
  "/:id",
  authenticate,
  transactionIdValidation,
  TransactionController.deleteTransaction
);

export default router;
