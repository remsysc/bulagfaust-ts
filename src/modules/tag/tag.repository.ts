import prisma from '@/common/db/prisma';
import { Tag } from '@prisma/client';

export const findAll = async (): Promise<Tag[]> => {
  const tags = await prisma.tag.findMany({ take: 10 });
  return tags as Tag[];
};

export const findById = async (id: string): Promise<Tag | null> => {
  const tag = await prisma.tag.findUnique({ where: { id } });
  return tag as Tag | null;
};

export const createTag = async (name: string): Promise<Tag> => {
  const tag = await prisma.tag.create({ data: { name } });
  return tag as Tag;
};

export const deleteById = async (id: string): Promise<void> => {
  await prisma.tag.delete({ where: { id } });
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.tag.count({ where: { id } });
  return count > 0;
};
