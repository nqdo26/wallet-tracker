import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { AuthService } from "../services/authService";
import { IUser } from "../models/User";

export class AuthController {
  static googleCallback = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = req.user as IUser;

      if (!user) {
        res.redirect(
          `${process.env.FRONTEND_URL}/login?error=authentication_failed`
        );
        return;
      }

      const token = AuthService.generateToken(user);

      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
  );

  static getCurrentUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = req.user as IUser;

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      });
    }
  );

  static logout = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }
  );
}
