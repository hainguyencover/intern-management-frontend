export class ApiError<T = Record<string, string>> extends Error {
  public status: number;
  public errors?: T;
  public code?: string;

  constructor(status: number, message: string, errors?: T, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}
