import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { headers } from 'next/headers';

import { fetchTodos } from '@/app/(private)/todo/_apis/todos.server';
import TodoFilterClient from '@/app/(private)/todo-filter/_components/TodoFilterClient';
import { getQueryClient } from '@/lib/queryClient';

const TODO_QUERY_KEY = ['todos', 'all', 'createdAt', 'desc'] as const;

export default async function TodoFilterDehydratedState() {
  await headers();

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: TODO_QUERY_KEY,
    queryFn: async () => {
      const result = await fetchTodos();
      if (!result.isSuccess) {
        throw new Error(result.errorMessage);
      }
      return result.data;
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TodoFilterClient />
    </HydrationBoundary>
  );
}
