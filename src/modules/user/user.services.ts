import { NotFoundException } from '@/common/errors/NotFoundException';
import { findById } from './user.repository';
import { UserPublic } from './user.types';

export const getCurrentUser = async (userId: string): Promise<UserPublic> => {
  const user = await findById(userId);
  if (!user) {
    throw new NotFoundException('User is not found with id: ' + userId);
  }
  return user;
};

export const getPublicUserById = async (
  userId: string,
): Promise<UserPublic> => {
  const user = await findById(userId);
  if (!user)
    throw new NotFoundException('User is not found with id: ' + userId);
  return user;
};
