import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  if (process.env.NODE_ENV === "development") {
    response.data = { stack: err.stack };
  }

  res.status(statusCode).json(response);
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
