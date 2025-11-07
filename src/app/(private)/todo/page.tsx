import { Suspense, use } from 'react';

import { fetchTodos } from '@/app/(private)/todo/_apis/todos.server';
import TodoClient from '@/app/(private)/todo/_components/TodoClient';
import type { Todo } from '@/app/(private)/todo/_types/todo';
import type { Result } from '@/types/result';

export default function Page() {
  const todosPromise = fetchTodos();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">TODOプレイグラウンド</h1>
        <p className="text-sm text-gray-500">
          Server Component と Client Component の連携を確認するためのダミー画面です。
        </p>
      </header>
      <Suspense fallback={<p className="text-gray-500">TODOを読み込み中です…</p>}>
        <TodoListSection todosPromise={todosPromise} />
      </Suspense>
    </div>
  );
}

function TodoListSection({ todosPromise }: { todosPromise: Promise<Result<Todo[]>> }) {
  const result = use(todosPromise);

  if (!result.isSuccess) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        TODOの取得に失敗しました: {result.errorMessage}
      </div>
    );
  }

  return <TodoClient initialTodos={result.data} />;
}
