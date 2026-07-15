import * as tagService from './tag.service';
import { catchAsync } from '@/common/utils/catchAsync';
import { Request, Response } from 'express';

export const getTags = catchAsync(async (req: Request, res: Response) => {
  const tags = await tagService.findAll(req.pageable);
  res.status(200).json({ tags });
});

export const getTagById = catchAsync(async (req: Request, res: Response) => {
  const tag = await tagService.findById(req.params.tagId as string);
  res.status(200).json({ tag });
});

export const createTag = catchAsync(async (req: Request, res: Response) => {
  const tag = await tagService.createTag(req.body.tagName);
  res.status(201).json({ tag });
});

export const deleteById = catchAsync(async (req: Request, res: Response) => {
  await tagService.deleteById(req.params.tagId as string);
  res.status(204).send();
});
