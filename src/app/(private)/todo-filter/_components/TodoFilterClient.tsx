'use client';

import { useTodoFilter } from '@/app/(private)/todo-filter/_hooks/useTodoFilter';

export default function TodoFilterClient() {
  const {
    todos,
    title,
    setTitle,
    isSubmitting,
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
  } = useTodoFilter();

  return (
    <section className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="タスクを追加"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? '送信中…' : '追加'}
        </button>
      </form>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {/* フィルタ・ソートUI */}
      <div className="flex flex-wrap gap-4 rounded border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">
            フィルタ:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="active">未完了</option>
            <option value="completed">完了</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sortKey" className="text-sm font-medium text-gray-700">
            ソート:
          </label>
          <select
            id="sortKey"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="createdAt">作成日</option>
            <option value="title">タイトル</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>
      </div>

      {/* ローディング状態 */}
      {isLoading && <p className="text-center text-sm text-gray-500">読み込み中...</p>}

      {/* エラー状態 */}
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          エラーが発生しました: {error instanceof Error ? error.message : '不明なエラー'}
        </div>
      )}

      {/* TODOリスト */}
      {!isLoading && !error && (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded border border-gray-200 px-3 py-2"
            >
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={todo.isDone} onChange={() => toggleTodo(todo.id)} />
                <span className={todo.isDone ? 'text-gray-400 line-through' : ''}>
                  {todo.title}
                </span>
              </label>
            </li>
          ))}
          {todos.length === 0 && (
            <li className="rounded border border-dashed border-gray-300 px-3 py-8 text-center text-sm text-gray-500">
              {filter === 'all'
                ? 'まだタスクがありません。上部のフォームから追加してください。'
                : filter === 'active'
                  ? '未完了のタスクがありません。'
                  : '完了したタスクがありません。'}
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
