import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { fetchTodos } from '@/app/(private)/todo/_apis/todos.server';
import { getQueryClient } from '@/lib/queryClient';
import TodoFilterClient from '@/app/(private)/todo-filter/_components/TodoFilterClient';

export default async function TodoFilterPage() {
  const queryClient = getQueryClient();

  // 初期データをprefetch（awaitしない＝pendingのままdehydrateに含める）
  queryClient.prefetchQuery({
    queryKey: ['todos', 'all', 'createdAt', 'desc'],
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
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">TODOフィルタ・ソート（パターン6）</h1>
        <p className="text-sm text-gray-500">
          Server Component + prefetchQuery + HydrationBoundary + useQuery による初回レンダリング時 +
          ユーザー操作時のデータ取得パターンです。
        </p>
      </header>
      <Suspense fallback={<p className="text-gray-500">初期データを読み込み中...</p>}>
        <HydrationBoundary state={dehydratedState}>
          <TodoFilterClient />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}
