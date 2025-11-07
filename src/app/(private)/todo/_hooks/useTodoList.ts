'use client';

import { useEffect, useOptimistic, useState, useTransition } from 'react';
import type { FormEvent } from 'react';

import { createTodo } from '@/app/(private)/todo/_actions/createTodo';
import { toggleTodo as toggleTodoAction } from '@/app/(private)/todo/_actions/toggleTodo';
import type { Todo } from '@/app/(private)/todo/_types/todo';

type TodoAction = { type: 'toggle'; id: string };

export function useTodoList(initialTodos: Todo[]) {
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 実際のAPI実装時は、以下のuseStateとuseEffectは不要になります。
  // revalidateTagによるData Cache再検証で、Server Componentが自動的に
  // 最新データを取得し、useOptimisticが自動的に更新されるため。
  const [todos, setTodos] = useState(initialTodos);

  // モックデータ使用時はローカルステートのみで管理
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
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
      // Server Actionを実行（revalidateTagで自動更新）
      const result = await createTodo({ title: trimmed });

      if (!result.isSuccess) {
        setErrorMessage(result.errorMessage);
        // エラー時は入力値を復元
        setTitle(trimmed);
        return;
      }

      // モックデータ使用時はローカルステートのみで管理
      setTodos((current) => [result.data, ...current]);
    });
  };

  const toggleTodo = (id: string) => {
    startTransition(async () => {
      // 楽観的更新: UIを即座に切り替え
      updateOptimisticTodos({ type: 'toggle', id });

      // 現在のTodoを取得
      const targetTodo = todos.find((todo) => todo.id === id);
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

      // モックデータ使用時はローカルステートのみで管理
      setTodos((current) => current.map((todo) => (todo.id === id ? result.data : todo)));
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
