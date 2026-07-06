import { z } from 'zod';

export const uuidRule = z.uuid('Must be a valid UUID');
export const paginationQuer = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export const useParamsId = (key: string) =>
  z.object({
    params: z.object({
      [key]: uuidRule,
    }),
  });

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().default(10),

  sortField: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

const transformToPageable = (query: z.infer<typeof paginationQuerySchema>) => ({
  page: query.page,
  size: query.size,
  ...(query.sortField && {
    sort: {
      field: query.sortField,
      direction: query.sortField || 'asc',
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
