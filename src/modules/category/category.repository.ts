import prisma from '@/common/db/prisma';
import { Category } from '@prisma/client';
import { Pageable, PageResponse } from '@/common/types/entities';
import { buildPageResponse } from '@/common/utils/pageResponse';

export const findAll = async (
  pageable: Pageable,
): Promise<PageResponse<Category>> => {
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
      orderBy: {
        [pageable.sort?.field || 'createdAt']:
          pageable.sort?.direction || 'desc',
      },
    }),

    prisma.category.count(),
  ]);

  return buildPageResponse(categories, pageable, total);
};

export const findById = async (id: string): Promise<Category | null> => {
  return await prisma.category.findUnique({ where: { id } });
};

export const createCategory = async (name: string): Promise<Category> => {
  return await prisma.category.create({ data: { name } });
};

export const updateCategoryById = async (
  id: string,
  name: string,
): Promise<Category> => {
  return await prisma.category.update({
    where: { id },
    data: { name },
  });
};

export const deleteById = async (id: string): Promise<Category | null> => {
  return await prisma.category.delete({ where: { id } });
};

export const existsByNameExcludeId = async (
  name: string,
  id?: string,
): Promise<boolean> => {
  const count = await prisma.category.count({
    where: { name, id: id ? { not: id } : undefined },
  });
  return count > 0;
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.category.count({ where: { id } });
  return count > 0;
};

export const existsByName = async (name: string): Promise<boolean> => {
  const count = await prisma.category.count({ where: { name } });
  return count > 0;
};
