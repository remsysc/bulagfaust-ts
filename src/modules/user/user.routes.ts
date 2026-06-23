import { Router } from 'express';
import * as userController from './user.controller';
import { authenticateToken } from '@/common/middlewares/auth.middleware';

const router = Router();

router.get('/me', authenticateToken, userController.getCurrentUser);
router.get('/:userId', userController.getPublicUser);

export default router;
