export type SuccessResult<T> = {
  isSuccess: true;
  data: T;
};

export type ErrorResult = {
  isSuccess: false;
  errorMessage: string;
};

export type Result<T> = SuccessResult<T> | ErrorResult;
