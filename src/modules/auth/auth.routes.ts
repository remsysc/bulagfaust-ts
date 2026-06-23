import { Router } from 'express';
import * as authController from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';
import { validate } from '@/common/middlewares/validator.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
