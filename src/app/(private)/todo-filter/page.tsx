import { Suspense } from 'react';

import TodoFilterDehydratedState from '@/app/(private)/todo-filter/_components/TodoFilterDehydratedState';

export default function TodoFilterPage() {
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
        <TodoFilterDehydratedState />
      </Suspense>
    </div>
  );
}
