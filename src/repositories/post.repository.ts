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
    where: { id, deletedAt: null },
  });
  return post as Post | null;
};

export const findByIdWithRelations = async (
  id: string,
): Promise<PostWithRelations | null> => {
  const post = await prisma.post.findUnique({
    where: { id, deletedAt: null },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      postCategories: { include: { category: true } },
      postTags: { include: { tag: true } },
    },
  });
  if (!post) return null;
  return {
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    content: post.content,
    status: post.status as "draft" | "published" | "archived",
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    deletedAt: post.deletedAt,
    author: post.author as UserPublic,
    categories: post.postCategories.map((pc) => pc.category) as Category[],
    tags: post.postTags.map((pt) => pt.tag) as Tag[],
  };
};

export const create = async (data: {
  title: string;
  content: string;
  authorId: string;
  status?: string;
}): Promise<Post> => {
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      status: data.status || "draft",
    },
  });
  return post as Post;
};

export const update = async (
  id: string,
  data: { title?: string; content?: string; status?: string },
): Promise<Post | null> => {
  const post = await prisma.post.update({
    where: { id },
    data,
  });
  return post as Post;
};

export const deleteById = async (id: string): Promise<void> => {
  await prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const attachCategories = async (
  postId: string,
  categoryIds: string[],
): Promise<void> => {
  await prisma.postCategory.deleteMany({ where: { postId } });
  await prisma.postCategory.createMany({
    data: categoryIds.map((categoryId) => ({ postId, categoryId })),
  });
};

export const attachTags = async (
  postId: string,
  tagIds: string[],
): Promise<void> => {
  await prisma.postTag.deleteMany({ where: { postId } });
  await prisma.postTag.createMany({
    data: tagIds.map((tagId) => ({ postId, tagId })),
  });
};

export const findCategoriesByPostId = async (
  postId: string,
): Promise<Category[]> => {
  const postCategories = await prisma.postCategory.findMany({
    where: { postId },
    include: { category: true },
  });
  return postCategories.map((pc) => pc.category) as Category[];
};

export const findTagsByPostId = async (postId: string): Promise<Tag[]> => {
  const postTags = await prisma.postTag.findMany({
    where: { postId },
    include: { tag: true },
  });
  return postTags.map((pt) => pt.tag) as Tag[];
};