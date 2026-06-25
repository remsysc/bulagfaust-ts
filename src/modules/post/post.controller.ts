import { NextFunction, Request, Response } from 'express';
import * as postService from './post.services';
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const postData = req.body;
    const newPost = await postService.createPost(postData, req.user.userId);

    return res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};
