export interface Result<T> {
  Correct: boolean;
  ErrorMessage: string;
  object: T;
  Objects: T[];
  ex: any;
  StatusCode: number;
}