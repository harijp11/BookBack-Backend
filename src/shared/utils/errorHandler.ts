import { Request, Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants"
import errorLogger from "../../shared/utils/error-logger";

export function handleErrorResponse(res: Response, error: unknown): void {
  console.error(error);
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      message: err.message,
    }));

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors,
    });
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
  errorLogger.error(`[${(error as Error).message}`, { stack: (error as Error).stack });
  console.log("Unhandled error:", error);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.SERVER_ERROR,
  });
}