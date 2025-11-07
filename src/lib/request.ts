import { failure, success } from '@/lib/result';
import type { Result } from '@/types/result';

export async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<Result<T>> {
  const requestInit: RequestInit = {
    cache: 'no-store',
    ...init,
  };

  try {
    const response = await fetch(input, requestInit);

    if (!response.ok) {
      return failure(`HTTP ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as T;
    return success(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return failure(message);
  }
}
