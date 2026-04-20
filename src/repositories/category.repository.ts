import prisma from "@/db/prisma";
import { Category } from "@/types/entities";

export const findAll = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({ take: 10 });
  return categories as Category[];
};

export const findById = async (id: string): Promise<Category | null> => {
  const category = await prisma.category.findUnique({ where: { id } });
  return category as Category | null;
};

export const createCategory = async (name: string): Promise<Category> => {
  const category = await prisma.category.create({ data: { name } });
  return category as Category;
};

export const updateCategoryById = async (
  id: string,
  name: string,
): Promise<Category | null> => {
  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });
  return category as Category;
};

export const deleteById = async (id: string): Promise<Category | null> => {
  const category = await prisma.category.delete({ where: { id } });
  return category as Category;
};

export const existsByNameExcludeId = async (
  name: string,
  id?: string,
): Promise<boolean> => {
  const count = await prisma.category.count({
    where: { name, id: id ? { not: id } : undefined },
  });
  return count > 0;
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.category.count({ where: { id } });
  return count > 0;
};

export const existsByName = async (name: string): Promise<boolean> => {
  const count = await prisma.category.count({ where: { name } });
  return count > 0;
};

