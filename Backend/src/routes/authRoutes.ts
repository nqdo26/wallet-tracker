import { Router } from "express";
import passport from "../config/passport";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=authentication_failed`,
  }),
  AuthController.googleCallback
);

router.get("/me", authenticate, AuthController.getCurrentUser);
router.post("/logout", authenticate, AuthController.logout);

export default router;
