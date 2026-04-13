import { ConflictException } from "@/errors/ConflictException";
import { NotFoundException } from "@/errors/NotFoundException";
import * as tagRepository from "@/repositories/tag.repository";
import { Tag } from "@/types/entities";

export const findAll = async (): Promise<Tag[]> => {
  return await tagRepository.findAll();
};

export const findById = async (id: string): Promise<Tag> => {
  const tag = tagRepository.findById(id);
  if (!tag) {
    throw new NotFoundException("Tag not found");
  }
  return tag;
};

export const createTag = async (name: string): Promise<Tag> => {
  if (await tagRepository.existsByNameExcludeId(name)) {
    throw new ConflictException("Tag name is already exists");
  }
  const tag = await tagRepository.createTag(name);
  return tag;
};

export const deleteById = async (id: string): Promise<void> => {
  if (!(await tagRepository.existsById(id)))
    throw new NotFoundException("Tag not found");
  await tagRepository.deleteById(id);
};
