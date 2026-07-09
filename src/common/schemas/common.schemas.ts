import { z } from 'zod';

export const uuidRule = z.uuid('Must be a valid UUID');
export const paramsIdSchema = (key: string) =>
  z.object({
    params: z.object({
      [key]: uuidRule,
    }),
  });

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),

  sortField: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

const transformToPageable = (query: z.infer<typeof paginationQuerySchema>) => ({
  page: query.page,
  size: query.limit,
  ...(query.sortField && {
    sort: {
      field: query.sortField,
      direction: query.sortDir ?? 'asc',
    },
  }),
});

export const paginationSchema = z
  .object({
    query: paginationQuerySchema,
  })
  .transform((data) => ({
    pageable: transformToPageable(data.query),
  }));

export const usePaginatedParams = (paramKey: string) => {
  return z
    .object({
      params: z.object({
        [paramKey]: z.uuid(`Invalid UUID format ${paramKey}`),
      }),
      query: paginationQuerySchema,
    })
    .transform((data) => ({
      params: data.params,
      pageable: transformToPageable(data.query),
    }));
};
