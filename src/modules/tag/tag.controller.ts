import { RequestHandler } from 'express';
import * as tagService from './tag.service';

export const getTags: RequestHandler = async (req, res, next) => {
  try {
    const tags = await tagService.findAll(req.pageable);
    res.status(200).json({ tags });
  } catch (err) {
    next(err);
  }
};

export const getTagById: RequestHandler = async (req, res, next) => {
  try {
    const tag = await tagService.findById(req.params.tagId as string);
    res.status(200).json({ tag });
  } catch (err) {
    next(err);
  }
};

export const createTag: RequestHandler = async (req, res, next) => {
  try {
    const tag = await tagService.createTag(req.body.tagName);
    res.status(201).json({ tag });
  } catch (err) {
    next(err);
  }
};

export const deleteById: RequestHandler = async (req, res, next) => {
  try {
    await tagService.deleteById(req.params.tagId as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
