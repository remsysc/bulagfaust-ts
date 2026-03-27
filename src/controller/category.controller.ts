import * as categoryService from "@/services/category.service";
import { RequestHandler } from "express";
import { UUID } from "node:crypto";

export const getCategories: RequestHandler = async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    const categories = await categoryService.findAll();
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
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};

