import { Prisma, Post as PrismaPost } from '@prisma/client';
import { Pageable } from '@/types/entities';

export interface PostFilters {
  status?: PrismaPost['status'];
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
}

export interface FindAllOptions {
  filters?: PostFilters;
  pageable: Pageable;
}

export const postResponseSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  content: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
  postCategories: {
    include: {
      category: true,
    },
  },
  postTags: {
    include: {
      tag: true,
    },
  },
});

export const postWithRelationsArgs = Prisma.validator<Prisma.PostDefaultArgs>()(
  {
    include: {
      author: true,
      postCategories: {
        include: {
          category: true,
        },
      },
      postTags: {
        include: {
          tag: true,
        },
      },
    },
  },
);

export type PostWithRelations = Prisma.PostGetPayload<
  typeof postWithRelationsArgs
>;

export type PostResponseDTO = Prisma.PostGetPayload<{
  select: typeof postResponseSelect;
}>;
