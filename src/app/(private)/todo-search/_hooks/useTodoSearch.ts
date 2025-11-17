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
  const [hasSearched, setHasSearched] = useState(false); // 検索実行済みフラグ
  const queryClient = useQueryClient();

  // useQueryで検索条件に応じてデータを取得
  // 一度検索したら enabled: true になり、フィルター・ソート変更時に自動更新
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['todos-search', filter, sortKey, sortOrder],
    queryFn: () => searchTodosClient({ filter, sortKey, sortOrder }),
    enabled: hasSearched, // 一度検索したら以降は自動更新
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });

  // 検索実行 - invalidateQueriesでキャッシュを無効化して再取得
  const handleSearch = () => {
    setHasSearched(true); // 初回検索時にフラグをON（enabled: true になる）
    queryClient.invalidateQueries({ queryKey: ['todos-search'] }); // キャッシュ無効化
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
      // キャッシュを無効化してqueryKeyの変更により自動再取得
      await queryClient.invalidateQueries({ queryKey: ['todos-search'] });
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
      // キャッシュを無効化してqueryKeyの変更により自動再取得
      await queryClient.invalidateQueries({ queryKey: ['todos-search'] });
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
    handleSearch,
  };
}
