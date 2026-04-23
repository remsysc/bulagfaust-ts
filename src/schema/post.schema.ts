import { z } from "zod";

export const updatePostSchema = z.object({
  postId: z.uuid("Invalid Post ID"),
  title: z.string().min(5).optional(),
  content: z.string().min(10).optional(),
  categoryIds: z.array(z.uuid()).optional(),
  tagIds: z.array(z.uuid()).optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  categoryIds: z.array(z.uuid()).optional(),
  tagIds: z.array(z.uuid()).optional(),
});

export const getPostSchema = z.object({
  postId: z.uuid("Invalid Post ID"),
});
