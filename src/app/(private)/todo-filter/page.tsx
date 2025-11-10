import TodoFilterClient from '@/app/(private)/todo-filter/_components/TodoFilterClient';

export default function TodoFilterPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">TODOフィルタ・ソート（パターン5）</h1>
        <p className="text-sm text-gray-500">
          Client Component + useQuery + Route Handler によるユーザー操作時のデータ取得パターンです。
        </p>
      </header>
      <TodoFilterClient />
    </div>
  );
}
