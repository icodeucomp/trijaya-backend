import { Pagination } from '@common/interfaces/pagination.interface';

export const generatePagination = (
  page: string,
  limit: string,
): Pagination => ({
  skip: (Number(page) - 1) * Number(limit),
  take: Number(limit),
});
