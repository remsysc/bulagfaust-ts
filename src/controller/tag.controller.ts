import { RequestHandler } from "express";
import * as tagService from "@/services/tag.service";

export const getTags: RequestHandler = async (req, res, next) => {
  try {
    const tags = await tagService.findAll();
    res.status(200).json({
      tags,
    });
  } catch (err) {
    next(err);
  }
};

export const getTagById: RequestHandler = async (req, res, next) => {
  try {
    const tagId = req.params.tagId as string;
    const tag = await tagService.findById(tagId);
    res.status(200).json({
      tag,
    });
  } catch (err) {
    next(err);
  }
};

export const createTag: RequestHandler = async (req, res, next) => {
  try {
    const tagName = req.body.name as string;
    const tag = await tagService.createTag(tagName);
    res.status(201).json({
      tag,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteById: RequestHandler = async (req, res, next) => {
  try {
    const tagId = req.params.tagId as string;
    await tagService.deleteById(tagId);
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};
