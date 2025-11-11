'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { createTodo } from '@/app/(private)/todo/_actions/createTodo';
import { toggleTodo as toggleTodoAction } from '@/app/(private)/todo/_actions/toggleTodo';
import {
  fetchTodosClient,
  type TodoFilter,
  type TodoSortKey,
  type TodoSortOrder,
} from '@/app/(private)/todo-filter/_apis/todos.client';

export function useTodoFilter() {
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sortKey, setSortKey] = useState<TodoSortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<TodoSortOrder>('desc');
  const queryClient = useQueryClient();

  // useQueryでフィルタ・ソート条件に応じてデータを取得
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['todos', filter, sortKey, sortOrder],
    queryFn: () => fetchTodosClient({ filter, sortKey, sortOrder }),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    refetchOnMount: false, // 初期データを再利用（パターン6）
  });

  // TODO作成のmutation
  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const result = await createTodo({ title });
      if (!result.isSuccess) {
        throw new Error(result.errorMessage);
      }
      return result.data;
    },
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
      setErrorMessage(null);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  // TODO切り替えのmutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, isDone, title }: { id: string; isDone: boolean; title: string }) => {
      const result = await toggleTodoAction({ id, isDone, title });
      if (!result.isSuccess) {
        throw new Error(result.errorMessage);
      }
      return result.data;
    },
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setErrorMessage(null);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed || createMutation.isPending) {
      return;
    }

    createMutation.mutate(trimmed);
  };

  const toggleTodo = (id: string) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo || toggleMutation.isPending) {
      return;
    }

    toggleMutation.mutate({
      id,
      isDone: !targetTodo.isDone,
      title: targetTodo.title,
    });
  };

  return {
    todos,
    title,
    setTitle,
    isSubmitting: createMutation.isPending,
    errorMessage,
    handleSubmit,
    toggleTodo,
    filter,
    setFilter,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    isLoading,
    error,
  };
}
