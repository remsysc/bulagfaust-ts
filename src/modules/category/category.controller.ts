import * as categoryService from './category.service';
import { RequestHandler, Request, Response } from 'express';
import { UUID } from 'node:crypto';

export const getCategories: RequestHandler = async (
  req: Request,
  res: Response,
  next,
): Promise<void> => {
  try {
    if (!req.pageable) {
      res.status(500).json({ message: 'Pagination middleware missing' });
      return;
    }
    const categories = await categoryService.findAll(req.pageable);
    res.status(200).json({
      categories,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId as string;
    const category = await categoryService.findById(categoryId);
    res.status(200).json({
      category,
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body.name);
    res.status(201).json({
      category,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId as string;
    const category = await categoryService.updateCategoryById(
      categoryId,
      req.body.name,
    );
    res.status(200).json({
      category,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId as UUID;
    await categoryService.deleteCategoryById(categoryId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
