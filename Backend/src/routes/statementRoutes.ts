import { Router } from "express";
import { StatementController } from "../controllers/statementController";
import { authenticate } from "../middleware/auth";
import { param } from "express-validator";

const router = Router();

router.use(authenticate);

router.get(
  "/wallet/:walletId",
  [param("walletId").isMongoId().withMessage("Invalid wallet ID")],
  StatementController.getWalletStatement
);

router.get("/transactions", StatementController.getAllTransactions);

export default router;
