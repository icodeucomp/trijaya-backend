export interface ResponsePayload<T> {
  status: string;
  message: string;
  total: number;
  data: T;
}
