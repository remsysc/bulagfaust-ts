import { AppError } from "../errors/AppError";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
  console.error("Unhandled error: ", err);
  return res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong",
  });
};
