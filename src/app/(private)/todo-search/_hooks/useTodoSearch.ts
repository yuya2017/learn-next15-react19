'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { createTodo } from '@/app/(private)/todo/_actions/createTodo';
import { toggleTodo as toggleTodoAction } from '@/app/(private)/todo/_actions/toggleTodo';
import {
  searchTodosClient,
  type TodoFilter,
  type TodoSortKey,
  type TodoSortOrder,
} from '@/app/(private)/todo-search/_apis/todos.client';

export function useTodoSearch() {
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sortKey, setSortKey] = useState<TodoSortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<TodoSortOrder>('desc');
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  // useQueryで検索条件に応じてデータを取得（初期表示なし）
  const {
    data: todos = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['todos-search', filter, sortKey, sortOrder],
    queryFn: () => searchTodosClient({ filter, sortKey, sortOrder }),
    enabled: false, // 初期表示なし（パターン5）
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });

  // 検索実行
  const handleSearch = () => {
    setIsSearching(true);
    refetch().finally(() => {
      setIsSearching(false);
    });
  };

  // TODO作成のmutation
  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const result = await createTodo({ title });
      if (!result.isSuccess) {
        throw new Error(result.errorMessage);
      }
      return result.data;
    },
    onSuccess: async () => {
      // キャッシュを無効化
      await queryClient.invalidateQueries({ queryKey: ['todos-search'] });
      // enabled: falseのクエリは明示的にrefetchする必要がある
      // 検索結果が表示されている場合のみ再取得
      if (todos.length > 0) {
        await refetch();
      }
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
    onSuccess: async () => {
      // キャッシュを無効化
      await queryClient.invalidateQueries({ queryKey: ['todos-search'] });
      // enabled: falseのクエリは明示的にrefetchする必要がある
      // 検索結果が表示されている場合のみ再取得
      if (todos.length > 0) {
        await refetch();
      }
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
    isLoading: isLoading || isSearching,
    error,
    handleSearch,
  };
}
