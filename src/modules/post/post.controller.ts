import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as postService from './post.services';
import { catchAsync } from '@/common/utils/catchAsync';
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
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

export const getAllPosts: RequestHandler = catchAsync(async (req, res) => {
  const posts = await postService.getAllPosts(req.pageable, req.filters ?? {});
  res.status(200).send({ posts });
});
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await postService.deletePostById(req.params.postId as string);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
