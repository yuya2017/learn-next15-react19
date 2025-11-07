'use server';

import { revalidateTag } from 'next/cache';

import { toggleTodoApi } from '@/app/(private)/todo/_apis/todos.server';
import type { Result } from '@/types/result';
import type { Todo } from '@/app/(private)/todo/_types/todo';

type ToggleTodoPayload = {
  id: string;
  isDone: boolean;
  title: string;
};

export async function toggleTodo(payload: ToggleTodoPayload): Promise<Result<Todo>> {
  const result = await toggleTodoApi(payload);

  if (!result.isSuccess) {
    return result;
  }

  // Data Cacheを再検証して画面を自動更新
  revalidateTag('todos', 'max');

  return result;
}
