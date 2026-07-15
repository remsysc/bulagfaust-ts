import { Post } from '@prisma/client';
import * as postRepository from './post.repository';
import { CreatePostInput, UpdatePostInput } from './post.schema';
import { isPrismaError } from '@/common/utils/isPrismaError';
import { NotFoundException } from '@/common/errors/NotFoundException';
import { Pageable } from '@/common/types/entities';
import { PostFilters } from './post.types';
import prisma from '@/common/db/prisma';

export const createPost = async (
  data: CreatePostInput,
  authorId: string,
): Promise<Post> => {
  return await postRepository.createPost({ ...data, authorId });
};

export const updatePost = async (data: UpdatePostInput): Promise<Post> => {
  try {
    return await postRepository.updatePost(data);
  } catch (err) {
    if (isPrismaError(err, 'P2025')) {
      throw new NotFoundException('Post not found');
    }
    throw err;
  }
};

export const deletePostById = async (postId: string, authorId:string) => {
  try {
    return await postRepository.deleteById(postId, authorId);
  } catch (err) {
    if (isPrismaError(err, 'P2025')) {
      throw new NotFoundException('Post not found');
    }
    throw err;
  }
};

export const getAllPosts = async (pageable: Pageable, filters: PostFilters) => {
  return await postRepository.findAll({ pageable, filters });
};
