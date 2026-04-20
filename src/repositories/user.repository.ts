import prisma from "@/db/prisma";
import { User, UserPublic } from "@/types/entities";
import { RegisterCredentials } from "@/validator/auth.validator";
import bcrypt from "bcrypt";

export const findByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user as User | null;
};

export const findByUsername = async (
  username: string,
): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { username } });
  return user as User | null;
};

export const createUser = async (data: RegisterCredentials): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
  });
  return user as User;
};

export const findById = async (id: string): Promise<UserPublic | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user as UserPublic | null;
};

