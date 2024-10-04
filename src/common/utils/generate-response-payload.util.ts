import { ResponsePayload } from '@common/interfaces';

export function successResponsePayload<T>(
  message: string,
  data: T,
  total?: number,
): ResponsePayload<T> {
  return {
    status: 'success',
    message,
    total: total ?? 1,
    data,
  };
}
