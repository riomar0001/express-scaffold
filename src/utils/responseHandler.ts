import { Response } from "express";

export const successResponse = (
  res: Response,
  data = {},
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  error: any = "Something Went Wrong",
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message: typeof error === "string" ? error : error.message,
  });
};
