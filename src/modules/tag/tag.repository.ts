import prisma from '@/common/db/prisma';
import { Pageable, PageResponse } from '@/common/types/entities';
import { buildPageResponse } from '@/common/utils/pageResponse';
import { Tag } from '@prisma/client';

export const findAll = async (
  pageable: Pageable,
): Promise<PageResponse<Tag>> => {
  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
      orderBy: {
        [pageable.sort?.field || 'createdAt']:
          pageable.sort?.direction || 'desc',
      },
    }),
    prisma.tag.count(),
  ]);
  return buildPageResponse(tags, pageable, total);
};

export const findById = async (id: string): Promise<Tag> => {
  return await prisma.tag.findUniqueOrThrow({ where: { id } });
};

export const createTag = async (name: string): Promise<Tag> => {
  return await prisma.tag.create({ data: { name } });
};

export const deleteById = async (id: string): Promise<void> => {
  await prisma.tag.delete({ where: { id } });
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.tag.count({ where: { id } });
  return count > 0;
};
