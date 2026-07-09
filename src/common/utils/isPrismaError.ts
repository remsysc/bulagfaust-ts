import { Prisma } from '@prisma/client';
export const isPrismaError = (
  err: unknown,
  code: Prisma.PrismaClientKnownRequestError['code'],
): err is Prisma.PrismaClientKnownRequestError => {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === code
  );
};
