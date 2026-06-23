import prisma from '@/common/db/prisma';
import { RouteNotFoundException } from '@/common/errors/RouteNotFoundException';
import { errorHandler } from '@/common/middlewares/errorHandler.middleware';
import authRoutes from '@/modules/auth/auth.routes';
import categoryRoutes from '@/modules/category/category.routes';
import tagRoutes from '@/modules/tag/tag.routes';
import userRoutes from '@/modules/user/user.routes';
import express, { NextFunction, Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET is not defined');

prisma.$connect().then(() => console.log('Database connected'));

// Parse incoming JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/tag', tagRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new RouteNotFoundException(`Cannot ${req.method} ${req.path}`);
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//TODO: REWRITE ALL SCHEMA VALIDATOR SERVICES to use prisma specific, create a utility helper for try catch for service
