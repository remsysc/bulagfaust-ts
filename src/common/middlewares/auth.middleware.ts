import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../errors/UnauthorizedException';
import { JWTPayload } from '../types/entities';
import { config, JWT_SECRET } from '@/config/config';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedException('Invalid credentials'));
  }


  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err || !decoded)
      return next(new UnauthorizedException('Invalid or expired token'));
    const payload = decoded as JWTPayload;
    req.user = {
      userId: payload.userId,
      roles: payload.roles,
      email: payload.email,
    };
    next();
  });
};

/**
 * Optional authentication — attaches req.user if a valid token is present,
 * but does NOT reject requests that have no token. Use this on public routes
 * where authenticated users may get additional access (e.g. seeing their own drafts).
 */
export const optionalAuthenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next();

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      const payload = decoded as JWTPayload;
      req.user = {
        userId: payload.userId,
        roles: payload.roles,
        email: payload.email,
      };
    }
    next();
  });
};
