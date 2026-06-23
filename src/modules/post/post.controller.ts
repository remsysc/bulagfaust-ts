import { Request, Response } from 'express';

import * as postRepository from './post.repository';

export const create = async (req: Request, res: Response) => {
  const authorId = req.user?.userId;
  const newPost = await postRepository.createPost({
    ...req.body,
    authorId,
  });

  return res.status(201).json(newPost);
};
