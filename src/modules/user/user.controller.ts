import * as userService from './user.services';
import { assertAuthenticated } from '../../common/utils/assertAuthenticated';
import { catchAsync } from '@/common/utils/catchAsync';
import { Request, Response } from 'express';

export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  assertAuthenticated(req);
  const user = await userService.getCurrentUser(req.user.userId);
  res.status(200).json({
    user,
  });
});

export const getPublicUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const user = await userService.getPublicUserById(userId);
  res.status(200).json({ user });
});
