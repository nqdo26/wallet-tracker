import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { AuthService } from "../services/authService";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.substring(7);

    const decoded = AuthService.verifyToken(token);

    const user = await AuthService.getUserById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Invalid or expired token", 401));
    }
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = AuthService.verifyToken(token);
      const user = await AuthService.getUserById(decoded.userId);
      req.user = user || undefined;
    }

    next();
  } catch (error) {
    next();
  }
};
