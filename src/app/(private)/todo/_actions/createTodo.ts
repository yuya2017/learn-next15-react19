'use server';

import { updateTag } from 'next/cache';

import { createTodoApi } from '@/app/(private)/todo/_apis/todos.server';
import type { Result } from '@/types/result';
import type { Todo } from '@/app/(private)/todo/_types/todo';

type CreateTodoPayload = {
  title: string;
};

export async function createTodo(payload: CreateTodoPayload): Promise<Result<Todo>> {
  const trimmedTitle = payload.title.trim();

  const result = await createTodoApi({ title: trimmedTitle });

  if (!result.isSuccess) {
    return result;
  }

  // use cacheでキャッシュされたデータを即座に更新
  updateTag('todos');

  return result;
}
