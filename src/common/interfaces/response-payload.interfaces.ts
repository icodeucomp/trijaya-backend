export interface ResponsePayload<T> {
  status: string;
  message: string;
  data: T;
}
