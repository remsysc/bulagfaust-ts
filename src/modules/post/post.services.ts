import { Post } from '@prisma/client';
import * as postRepository from './post.repository';
import { CreatePostInput } from './post.schema';

export const createPost = async (
  data: CreatePostInput,
  authorId: string,
): Promise<Post> => {
  return postRepository.createPost({ ...data, authorId });
};
