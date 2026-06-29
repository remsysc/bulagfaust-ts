import { Tag } from '@prisma/client';
import * as tagRepository from './tag.repository';
import { NotFoundException } from '@/common/errors/NotFoundException';
import { ConflictException } from '@/common/errors/ConflictException';
import { Pageable, PageResponse } from '@/common/types/entities';
import { Prisma } from '@prisma/client';

export const findAll = async (
  pageable: Pageable,
): Promise<PageResponse<Tag>> => {
  return await tagRepository.findAll(pageable);
};

export const findById = async (id: string): Promise<Tag> => {
  const tag = await tagRepository.findById(id);
  if (!tag) {
    throw new NotFoundException('Tag not found');
  }
  return tag;
};

export const createTag = async (name: string): Promise<Tag> => {
  try {
    const tag = await tagRepository.createTag(name);
    return tag;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      const target = err.meta?.target;
      if (Array.isArray(target) && target.includes('name')) {
        throw new ConflictException(`This name is already taken`);
      }
    }
    throw err;
  }
};

export const deleteById = async (id: string): Promise<void> => {
  if (!(await tagRepository.existsById(id)))
    throw new NotFoundException('Tag not found');
  await tagRepository.deleteById(id);
};
