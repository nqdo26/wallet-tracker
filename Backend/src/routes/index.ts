import { Router } from "express";
import authRoutes from "./authRoutes";
import walletRoutes from "./walletRoutes";
import statementRoutes from "./statementRoutes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/wallets", walletRoutes);
router.use("/statements", statementRoutes);

export default router;
