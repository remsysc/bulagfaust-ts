import { Post } from '@prisma/client';
import * as postRepository from './post.repository';
import { CreatePostInput, UpdatePostInput } from './post.schema';
import { isPrismaError } from '@/common/utils/isPrismaError';
import { NotFoundException } from '@/common/errors/NotFoundException';
import { Pageable } from '@/common/types/entities';
import { PostFilters } from './post.types';

export const createPost = async (
  data: CreatePostInput,
  authorId: string,
): Promise<Post> => {
  return postRepository.createPost({ ...data, authorId });
};

export const updatePost = async (data: UpdatePostInput): Promise<Post> => {
  try {
    return postRepository.updatePost(data);
  } catch (err) {
    if (isPrismaError(err, 'P2025')) {
      throw new NotFoundException('Post not found');
    }
    throw err;
  }
};

export const deletePostById = async (postId: string) => {
  try {
    return postRepository.deleteById(postId);
  } catch (err) {
    if (isPrismaError(err, 'P2025')) {
      throw new NotFoundException('Post not found');
    }
    throw err;
  }
};

export const getAllPosts = async (pageable: Pageable, filters: PostFilters) => {
  return postRepository.findAll({ pageable, filters });
};
