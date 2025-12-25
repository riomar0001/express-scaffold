import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/types/error";
import { env } from "@/configs/env.config";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || res.statusCode || 500;

  const isDev = env.NODE_ENV === "DEVELOPMENT";

  const response = {
    success: false,
    message: isDev ? err.message : "Something went wrong. Please try again later.",
    ...(isDev && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  next(error);
};
