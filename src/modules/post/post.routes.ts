import { useBody, validate } from '@/common/middlewares/validator.middleware';
import { Router } from 'express';
import { createPostSchema } from './post.schema';
import * as postController from './post.controller';
import {
  authenticateToken,
  optionalAuthenticateToken,
} from '@/common/middlewares/auth.middleware';
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

// Public: unauthenticated users see only published posts.
// Authenticated users can also see their own non-published posts when filtering by their authorId.
router.get(
  '/',
  optionalAuthenticateToken,
  validate(usePostListQuery()),
  postController.getAllPosts,
);

// Public: unauthenticated users can fetch any published post.
// Authors can fetch their own non-published posts.
router.get(
  '/:postId',
  optionalAuthenticateToken,
  validate(paramsIdSchema('postId')),
  postController.getPostById,
);

router.delete(
  '/:postId',
  authenticateToken,
  validate(paramsIdSchema('postId')),
  postController.deletePost,
);

export default router;
