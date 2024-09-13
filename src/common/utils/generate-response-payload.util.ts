import { ResponsePayload } from '../interfaces';

export function successResponsePayload<T>(
  message: string,
  data: T,
): ResponsePayload<T> {
  return {
    status: 'success',
    message,
    data,
  };
}
