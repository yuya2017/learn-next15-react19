'use client';

import { useOptimistic, useState, useTransition } from 'react';
import type { FormEvent } from 'react';

import { createTodo } from '@/app/(private)/todo/_actions/createTodo';
import { toggleTodo as toggleTodoAction } from '@/app/(private)/todo/_actions/toggleTodo';
import type { Todo } from '@/app/(private)/todo/_types/todo';

type TodoAction = { type: 'toggle'; id: string };

export function useTodoList(initialTodos: Todo[]) {
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    initialTodos,
    (currentTodos, action: TodoAction) => {
      return currentTodos.map((todo) =>
        todo.id === action.id ? { ...todo, isDone: !todo.isDone } : todo
      );
    }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed || isPending) {
      return;
    }

    setTitle('');
    setErrorMessage(null);

    startTransition(async () => {
      // Server Actionを実行（updateTagで即座に更新）
      const result = await createTodo({ title: trimmed });

      if (!result.isSuccess) {
        setErrorMessage(result.errorMessage);
        // エラー時は入力値を復元
        setTitle(trimmed);
        return;
      }

      // updateTagによりServer Componentが自動的に再レンダリングされ、
      // initialTodosが更新されるため、ローカルステート更新は不要
    });
  };

  const toggleTodo = (id: string) => {
    startTransition(async () => {
      // 楽観的更新: UIを即座に切り替え
      updateOptimisticTodos({ type: 'toggle', id });

      // 現在のTodoを取得
      const targetTodo = initialTodos.find((todo) => todo.id === id);
      if (!targetTodo) {
        return;
      }

      // Server Actionを実行
      const result = await toggleTodoAction({
        id,
        isDone: !targetTodo.isDone,
        title: targetTodo.title,
      });

      if (!result.isSuccess) {
        setErrorMessage(result.errorMessage);
        return;
      }

      // updateTagによりServer Componentが自動的に再レンダリングされ、
      // initialTodosが更新されるため、ローカルステート更新は不要
    });
  };

  return {
    todos: optimisticTodos,
    title,
    setTitle,
    isSubmitting: isPending,
    errorMessage,
    handleSubmit,
    toggleTodo,
  };
}
