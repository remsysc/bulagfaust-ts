import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { RegisterCredentials } from '../auth/auth.schema';
import { UserPublic, userPublicSelect } from './user.types';
import prisma from '@/common/db/prisma';

export const findByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findByUsername = async (
  username: string,
): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { username } });
};

export const createUser = async (data: RegisterCredentials): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
  });
};

export const findById = async (id: string): Promise<UserPublic | null> => {
  return await prisma.user.findUnique({
    where: { id },
    select: userPublicSelect,
  });
};
