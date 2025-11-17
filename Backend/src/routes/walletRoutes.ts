import { Router } from "express";
import { WalletController } from "../controllers/walletController";
import { authenticate } from "../middleware/auth";
import {
  createWalletValidation,
  updateWalletValidation,
  walletIdValidation,
} from "../middleware/validation";

const router = Router();

router.use(authenticate);
router.post("/", createWalletValidation, WalletController.createWallet);
router.get("/", WalletController.getWallets);
router.get("/:id", walletIdValidation, WalletController.getWalletById);
router.put("/:id", updateWalletValidation, WalletController.updateWallet);
router.delete("/:id", walletIdValidation, WalletController.deleteWallet);

export default router;
