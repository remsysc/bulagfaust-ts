import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as postService from './post.services';
import { catchAsync } from '@/common/utils/catchAsync';
import { assertAuthenticated } from '@/common/utils/assertAuthenticated';


export const create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  assertAuthenticated(req);
  const postData = req.body;
    const newPost = await postService.createPost(postData, req.user.userId);
    res.status(201).json(newPost);
});

export const getAllPosts: RequestHandler = catchAsync(async (req, res) => {
  const posts = await postService.getAllPosts(req.pageable, req.filters ?? {});
  res.status(200).send({ posts });
});
export const deletePost = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertAuthenticated(req);
  await postService.deletePostById(req.params.postId as string, req.user.userId);
  res.status(200).send();
});
