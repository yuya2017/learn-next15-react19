import TodoSearchClient from '@/app/(private)/todo-search/_components/TodoSearchClient';

export default function TodoSearchPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">TODO検索（パターン5）</h1>
        <p className="text-sm text-gray-500">
          Client Component + useQuery + Route Handler によるユーザー操作時のデータ取得パターンです。
          初期表示なしで、検索ボタンをクリックした時のみデータを取得します。
        </p>
      </header>
      <TodoSearchClient />
    </div>
  );
}
