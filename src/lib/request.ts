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

    // レスポンスボディが空の場合（204 No Content など）の対応
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    // Content-Lengthが0、またはContent-Typeがない場合は空のオブジェクトを返す
    if (contentLength === '0' || !contentType) {
      return success({} as T);
    }

    // レスポンステキストを取得して、空の場合は空のオブジェクトを返す
    const text = await response.text();
    if (!text || text.trim() === '') {
      return success({} as T);
    }

    const data = JSON.parse(text) as T;
    return success(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : '予期せぬエラーが発生しました';
    return failure(message);
  }
}
