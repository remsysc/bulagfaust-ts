import { Pageable, PageResponse } from '../types/entities';

export const buildPageResponse = <T>(
  content: T[],
  pageable: Pageable,
  total: number,
): PageResponse<T> => {
  const totalPages = Math.ceil(total / pageable.size);
  return {
    content,
    page: pageable.page,
    size: pageable.size,
    totalElements: total,
    totalPages,
    last: pageable.page >= totalPages,
    first: pageable.page === 1,
    numberOfElements: content.length,
  };
};
