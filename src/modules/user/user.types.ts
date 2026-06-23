import { Prisma } from '@prisma/client';

export const userPublicSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  email: true,
  createdAt: true,
  updatedAt: true,
});

export type UserPublic = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;
