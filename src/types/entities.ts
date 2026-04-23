interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPublic {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Role {
  id: string;
  name: string;
}

interface UserWithRoles extends User {
  roles: Role[];
}

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

type PostStatus = "draft" | "published" | "archived";

interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface PostWithRelations extends Omit<Post, "authorId"> {
  author: UserPublic;
  categories: Category[];
  tags: Tag[];
}

interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Tag {
  id: string;
  name: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
}
interface Pageable {
  page: number;
  size: number;
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface PostFilters {
  status?: PostStatus;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
}
export interface FindAllOptions {
  filters?: PostFilters;
  pageable: Pageable;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  categoryIds: string[];
  tagIds: string[];
}

export interface UpdatePostInput {
  postId: string;
  title?: string;
  content?: string;
  categoryIds?: string[];
  tagIds?: string[];
}

export type {
  User,
  UserPublic,
  UserWithRoles,
  Role,
  PostStatus,
  Post,
  PostWithRelations,
  Category,
  Tag,
  ApiResponse,
  PageResponse,
  Pageable,
};
