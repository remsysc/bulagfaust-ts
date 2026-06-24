import { NextFunction, Request, Response } from 'express';
import { setPriority } from 'os';
import { z } from 'zod';

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().default(10),

  sortField: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

export const extractPageable = (defaultSize = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = paginationQuerySchema.parse({
      page: req.query.page,
      size: req.query.size ?? defaultSize,
      sortField: req.query.sortField,
      sortDir: req.query.sortDir,
    });

    req.pageable = {
      page: parsed.page,
      size: parsed.size,
      ...(parsed.sortField && {
        sort: {
          field: parsed.sortField,
          direction: parsed.sortDir || 'asc',
        },
      }),
    };

    next();
  };
};
