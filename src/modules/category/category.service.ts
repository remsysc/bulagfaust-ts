import { Category } from '@prisma/client';
import * as categoryRepository from './category.repository';
import { ConflictException } from '@/common/errors/ConflictException';
import { NotFoundException } from '@/common/errors/NotFoundException';

export const findAll = async (): Promise<Category[]> => {
  return await categoryRepository.findAll();
};

export const findById = async (id: string): Promise<Category> => {
  const category = await categoryRepository.findById(id);
  if (!category) throw new NotFoundException('Category not found');
  return category;
};

export const createCategory = async (name: string): Promise<Category> => {
  if (await categoryRepository.existsByName(name)) {
    throw new ConflictException(name + ' category already exists');
  }
  return await categoryRepository.createCategory(name);
};

export const updateCategoryById = async (
  id: string,
  name: string,
): Promise<Category> => {
  if (await categoryRepository.existsByNameExcludeId(name, id)) {
    throw new ConflictException(name + ' category already exists');
  }
  const category = await categoryRepository.updateCategoryById(id, name);
  if (!category) {
    throw new NotFoundException('Category not found');
  }

  return category;
};

export const deleteCategoryById = async (id: string): Promise<void> => {
  if (!(await categoryRepository.existsById(id)))
    throw new NotFoundException('Category not found');

  await categoryRepository.deleteById(id);
};
