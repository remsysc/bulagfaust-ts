import { BadRequestException } from '../errors/BadRequestException';
import { NextFunction, Request, Response } from 'express';
import z from 'zod';
export const validate =
  (schema: z.ZodType<any, any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      params: req.params,
      body: req.body,
      query: req.query,
    });

    if (!parsed.success) {
      const pretty = z.prettifyError(parsed.error);
      return next(new BadRequestException(pretty));
    }

    if (parsed.data.params) req.params = parsed.data.params as any;
    if (parsed.data.body) req.body = parsed.data.body as any;
    if (parsed.data.query) req.query = parsed.data.query as any;
    if (parsed.data.pageable) {
      (req as any).pageable = parsed.data.pageable;
    }
    next();
  };
