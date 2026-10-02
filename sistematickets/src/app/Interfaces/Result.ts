export interface Result<T> {
  Correct: boolean;
  ErrorMessage: string;
  Object: T;
  Objects: T[];
  ex: any;
  StatusCode: number;
}