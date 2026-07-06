import { Router } from 'express';
import * as authController from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';
import { useBody, validate } from '@/common/middlewares/validator.middleware';

const router = Router();

router.post(
  '/register',
  validate(useBody(registerSchema)),
  authController.register,
);
router.post('/login', validate(useBody(loginSchema)), authController.login);

export default router;
