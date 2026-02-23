import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Operation successful",
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = "Internal Server Error",
  statusCode: number = 500,
  errors: any = null,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
