'use client';

import type { Todo } from '@/app/(private)/todo/_types/todo';

import { useTodoList } from '@/app/(private)/todo/_hooks/useTodoList';

type Props = {
  initialTodos: Todo[];
};

export default function TodoClient({ initialTodos }: Props) {
  const { todos, title, setTitle, isSubmitting, errorMessage, handleSubmit, toggleTodo } =
    useTodoList(initialTodos);

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
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded border border-gray-200 px-3 py-2"
          >
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={todo.isDone} onChange={() => toggleTodo(todo.id)} />
              <span className={todo.isDone ? 'text-gray-400 line-through' : ''}>{todo.title}</span>
            </label>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="rounded border border-dashed border-gray-300 px-3 py-8 text-center text-sm text-gray-500">
            まだタスクがありません。上部のフォームから追加してください。
          </li>
        )}
      </ul>
    </section>
  );
}
