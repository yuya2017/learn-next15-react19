import type { ErrorResult, SuccessResult } from '@/types/result';

export function success<T>(data: T): SuccessResult<T> {
  return { isSuccess: true, data };
}

export function failure(errorMessage: string): ErrorResult {
  return { isSuccess: false, errorMessage };
}
