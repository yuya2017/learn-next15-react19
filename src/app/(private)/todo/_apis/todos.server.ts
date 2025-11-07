import { request } from '@/lib/request';
import { failure, success } from '@/lib/result';
import type { Result } from '@/types/result';

import type { Todo } from '@/app/(private)/todo/_types/todo';

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN ?? process.env.APP_ORIGIN ?? 'http://localhost:3000';

export async function fetchTodos(): Promise<Result<Todo[]>> {
  // 実際のAPI実装時は以下のようにData Cacheを使用
  // return await request<Todo[]>('/api/todos', {
  //   next: {
  //     tags: ['todos'],
  //     revalidate: 3600,
  //   },
  // });

  // 現在はモックデータを返す（Data Cache適用のため一旦fetchでラップ）
  const mockData = [
    { id: '1', title: 'プロジェクト構成を確認する', isDone: true },
    { id: '2', title: 'スタイルのたたきを整える', isDone: false },
    { id: '3', title: 'データ取得ユーティリティを確認する', isDone: false },
  ];

  return success(mockData);
}

export async function createTodoApi(payload: { title: string }): Promise<Result<Todo>> {
  const trimmedTitle = payload.title.trim();

  if (!trimmedTitle) {
    return failure('タイトルは必須です');
  }

  const response = await request<{ todo: Todo }>(new URL('/api/todos', APP_ORIGIN).toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: trimmedTitle }),
  });

  if (!response.isSuccess) {
    return failure(response.errorMessage);
  }

  const created = response.data.todo;

  return created ? success(created) : failure('TODOの作成レスポンスが不正です');
}

export async function toggleTodoApi(payload: {
  id: string;
  isDone: boolean;
  title: string;
}): Promise<Result<Todo>> {
  const response = await request<{ todo: Todo }>(
    new URL(`/api/todos/${payload.id}`, APP_ORIGIN).toString(),
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isDone: payload.isDone, title: payload.title }),
    }
  );

  if (!response.isSuccess) {
    return failure(response.errorMessage);
  }

  const updated = response.data.todo;

  return updated ? success(updated) : failure('TODOの更新レスポンスが不正です');
}
