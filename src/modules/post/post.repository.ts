import { PageResponse } from '@/types/entities';
import { CreatePostInput, UpdatePostInput } from './post.schema';
import {
  FindAllOptions,
  PostResponseDTO,
  postResponseSelect,
  PostWithRelations,
  postWithRelationsArgs,
} from './post.types';
import { Pageable } from '@/types/entities';
import { Post, Category, Tag } from '@prisma/client';
import prisma from '@/common/db/prisma';

const buildPageResponse = <T>(
  content: T[],
  pageable: Pageable,
  total: number,
): PageResponse<T> => {
  const totalPages = Math.ceil(total / pageable.size);
  return {
    content,
    page: pageable.page,
    size: pageable.size,
    totalElements: total,
    totalPages,
    last: pageable.page >= totalPages,
    first: pageable.page === 1,
    numberOfElements: content.length,
  };
};

export const findAll = async ({
  filters,
  pageable,
}: FindAllOptions): Promise<PageResponse<PostResponseDTO>> => {
  // 1. Initialize the base where clause
  const where: Record<string, unknown> = { deletedAt: null };

  // 2. Conditionally append scalar filters
  if (filters?.status) where.status = filters.status;
  if (filters?.authorId) where.authorId = filters.authorId;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // 3. Conditionally append relation filters directly into the same object
  if (filters?.categoryId) {
    where.postCategories = { some: { categoryId: filters.categoryId } };
  }
  if (filters?.tagId) {
    where.postTags = { some: { tagId: filters.tagId } };
  }

  // 4. Run exactly ONE Promise.all block with the compiled where clause
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: postResponseSelect,
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
      orderBy: {
        [pageable.sort?.field || 'createdAt']:
          pageable.sort?.direction || 'desc',
      },
    }),
    prisma.post.count({ where }),
  ]);

  return buildPageResponse(posts, pageable, total);
};

export const findById = async (id: string): Promise<Post | null> => {
  const post = await prisma.post.findUnique({
    where: { id: id },
  });

  if (!post) return null;

  return post as Post;
};

export const findByIdWithRelations = async (
  id: string,
): Promise<PostWithRelations | null> => {
  const post = await prisma.post.findFirst({
    where: { id: id },
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
  });
  if (!post) return null;

  return {
    ...post,
    categories: post.postCategories.map((pc) => pc.category),
    tags: post.postTags.map((pc) => pc.tag),
  } as PostWithRelations;
};

export const findCategoriesByPostId = async (
  postId: string,
): Promise<Category[]> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      postCategories: {
        include: {
          category: true,
        },
      },
    },
  });
  return post?.postCategories.map((pc) => pc.category) ?? [];
};

export const findTagsByPostId = async (postId: string): Promise<Tag[]> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      postTags: {
        include: {
          tag: true,
        },
      },
    },
  });
  return post?.postTags.map((pc) => pc.tag) ?? [];
};

export const createPost = async (
  input: CreatePostInput & { authorId: string },
): Promise<Post> => {
  const { title, content, authorId, categoryIds = [], tagIds = [] } = input;

  return (await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: { id: authorId },
      },
      postCategories: {
        create: categoryIds.map((id) => ({
          category: { connect: { id } },
        })),
      },
      postTags: {
        create: tagIds.map((id) => ({
          tag: { connect: { id } },
        })),
      },
    },
  })) as Post;
};

export const updatePost = async (
  input: UpdatePostInput,
): Promise<PostWithRelations> => {
  const { postId, title, content, categoryIds, tagIds } = input;

  return await prisma.post.update({
    where: {
      id: postId,
      deletedAt: null,
    },
    data: {
      title,
      content,
      postCategories: categoryIds
        ? {
            deleteMany: {}, //wipes the junction cleanly
            create: categoryIds.map((id: string) => ({
              category: {
                connect: { id },
              },
            })),
          }
        : undefined,
      postTags: tagIds
        ? {
            deleteMany: {},
            create: tagIds.map((id: string) => ({
              tag: { connect: { id } },
            })),
          }
        : undefined,
    },
    include: postWithRelationsArgs.include,
  });
};

export const deleteById = async (id: string): Promise<void> => {
  await prisma.post.update({
    where: { id: id, deletedAt: null },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const attachCategories = async (
  postId: string,
  categoryIds: string[],
): Promise<void> => {
  if (categoryIds.length === 0) return;
  await prisma.postCategory.createMany({
    data: categoryIds.map((categoryId) => ({
      postId,
      categoryId,
    })),
  });
};

export const attachTags = async (
  postId: string,
  tagIds: string[],
): Promise<void> => {
  if (tagIds.length === 0) return;
  await prisma.postTag.createMany({
    data: tagIds.map((tagId) => ({
      postId,
      tagId,
    })),
  });
};
