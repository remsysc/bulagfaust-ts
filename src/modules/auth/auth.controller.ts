import { RequestHandler } from 'express';

import * as authService from './auth.service';
import { catchAsync } from '@/common/utils/catchAsync';

export const register = catchAsync(async (req, res) => {
  const token = await authService.register(req.body);
  res.status(201).json({
    token,
  });
});

export const login: RequestHandler = catchAsync(async (req, res) => {
  const token = await authService.login(req.body);
  res.status(201).json({
    token,
  });
});
