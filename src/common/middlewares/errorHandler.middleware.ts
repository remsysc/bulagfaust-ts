import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = err.meta?.target;

      if (Array.isArray(target) && target.includes('email')) {
        return res.status(409).json({
          message: `An account with this email already exists.`,
        });
      }
      if (Array.isArray(target) && target.includes('username')) {
        return res.status(409).json({
          message: `This username is already taken.`,
        });
      }
      return res.status(409).json({
        message: `Unique constraint violated`,
      });
    }
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
};
