import { Router } from 'express';
import * as tagController from './tag.controller';
import { authenticateToken } from '@/common/middlewares/auth.middleware';
import { requireRole } from '@/common/middlewares/requireRole.middleware';
import { validate_uuid } from '@/common/middlewares/validator.middleware';
const router = Router();

router.get('/', tagController.getTags);
router.get('/:tagId', validate_uuid('tagId'), tagController.getTagById);
router.post(
  '/',
  authenticateToken,
  requireRole('ROLE_ADMIN'),
  tagController.createTag,
);
router.delete(
  '/:tagId',
  authenticateToken,
  validate_uuid('tagId'),
  tagController.deleteById,
);

export default router;
