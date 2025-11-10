import type { Todo } from '@/app/(private)/todo/_types/todo';

export type TodoFilter = 'all' | 'active' | 'completed';

export type TodoSortKey = 'createdAt' | 'title';

export type TodoSortOrder = 'asc' | 'desc';

export type FetchTodosParams = {
  filter?: TodoFilter;
  sortKey?: TodoSortKey;
  sortOrder?: TodoSortOrder;
};

/**
 * TODO一覧を取得（クライアント用）
 * Route Handlerを経由して外部APIを叩く
 */
export async function fetchTodosClient(params: FetchTodosParams = {}): Promise<Todo[]> {
  const { filter = 'all', sortKey = 'createdAt', sortOrder = 'desc' } = params;

  const searchParams = new URLSearchParams({
    filter,
    sortKey,
    sortOrder,
  });

  const res = await fetch(`/api/todos?${searchParams.toString()}`);

  if (!res.ok) {
    throw new Error('TODOの取得に失敗しました');
  }

  const data = await res.json();

  // Result型のレスポンスを想定
  if (data.isSuccess) {
    return data.data;
  }

  throw new Error(data.errorMessage || 'TODOの取得に失敗しました');
}
