import prisma from "@/db/prisma";
import {
  Post,
  PageResponse,
  FindAllOptions,
  Pageable,
  Category,
  Tag,
  PostWithRelations,
  UserPublic,
  CreatePostInput,
} from "@/types/entities";

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
}: FindAllOptions): Promise<PageResponse<Post>> => {
  const where: Record<string, unknown> = { deletedAt: null };

  if (filters?.status) where.status = filters.status;
  if (filters?.authorId) where.authorId = filters.authorId;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { content: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const { categoryId, tagId } = filters || {};

  if (categoryId || tagId) {
    const whereWithRelations = {
      ...where,
      ...(categoryId && { postCategories: { some: { categoryId } } }),
      ...(tagId && { postTags: { some: { tagId } } }),
    };
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: whereWithRelations,
        skip: (pageable.page - 1) * pageable.size,
        take: pageable.size,
        orderBy: {
          [pageable.sort?.field || "createdAt"]:
            pageable.sort?.direction || "desc",
        },
      }),
      prisma.post.count({ where: whereWithRelations }),
    ]);
    return buildPageResponse(posts as Post[], pageable, total);
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (pageable.page - 1) * pageable.size,
      take: pageable.size,
      orderBy: {
        [pageable.sort?.field || "createdAt"]:
          pageable.sort?.direction || "desc",
      },
    }),
    prisma.post.count({ where }),
  ]);

  return buildPageResponse(posts as Post[], pageable, total);
};

export const findById = async (id: string): Promise<Post | null> => {
  const post = await prisma.post.findUnique({
    where: { id: id },
  });
  return post;
};

export const findByIdWithRelations = async (
  id: string,
): Promise<PostWithRelations | null> => {
  const post = await prisma.post.findFirst({
    include: {
      author: true,
      categories: true,
      tags: true,
    },
  });
  return post;
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

export const createPost = async (input: CreatePostInput): Promise<Post> => {
  const { title, content, authorId, categoryIds, tagIds } = input;

  return await prisma.post.create({
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
  });
};

export const updatePost = async (input: UpdatePostInput) => {
  const { postId, title, content, categoryIds, tagIds } = input;

  return await prisma.post.update({
    where: {
      id: postId,
      deletedAt: null,
    },
    data: {
      title,
      content,
      updatedAt : new Date(); // manually force the refresh
      postCategories: categoryIds
        ? {
            deleteMany: {}, //wipes the junction table for this post
            create: categoryIds.map((id) => ({
              category: { connect: { id } },
            })),
          }
        : undefined,
    },
    include: {
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
};

