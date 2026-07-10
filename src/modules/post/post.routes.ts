import { useBody, validate } from '@/common/middlewares/validator.middleware';
import { Router } from 'express';
import { createPostSchema } from './post.schema';
import * as postController from './post.controller';
import { authenticateToken } from '@/common/middlewares/auth.middleware';
import {
  paramsIdSchema,
  usePostListQuery,
} from '@/common/schemas/common.schemas';

const router = Router();

router.post(
  '/',
  authenticateToken,
  validate(useBody(createPostSchema)),
  postController.create,
);

router.get(
  '/',
  authenticateToken,
  validate(usePostListQuery()),
  postController.getAllPosts,
);

router.delete(
  '/:postId',
  authenticateToken,
  validate(paramsIdSchema('postId')),
  postController.deletePost,
);

export default router;
