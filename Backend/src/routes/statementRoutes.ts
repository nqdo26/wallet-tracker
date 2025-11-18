import { Router } from "express";
import { StatementController } from "../controllers/statementController";
import { authenticate } from "../middleware/auth";
import { param } from "express-validator";

const router = Router();

// All statement routes require authentication
router.use(authenticate);

// Get wallet statement with date range
router.get(
  "/wallet/:walletId",
  [param("walletId").isMongoId().withMessage("Invalid wallet ID")],
  StatementController.getWalletStatement
);

// Get all transactions across all wallets
router.get("/transactions", StatementController.getAllTransactions);

export default router;
