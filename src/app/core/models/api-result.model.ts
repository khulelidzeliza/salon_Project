export interface Result<T> {
  isSuccess: boolean;
  value?: T | null;
  error?: {
    code: string;
    message: string;
  } | null;
}
