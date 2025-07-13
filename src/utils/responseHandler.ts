import { Response } from "express";

interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
): Response<SuccessResponse> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  error: any
): Response<ErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    message: error,
  });
};
