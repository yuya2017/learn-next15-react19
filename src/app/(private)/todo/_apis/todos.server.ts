import { cacheLife, cacheTag } from 'next/cache';

import { db } from '@/lib/db';
import { failure, success } from '@/lib/result';
import type { Result } from '@/types/result';

import type { Todo } from '@/app/(private)/todo/_types/todo';

/**
 * TODO一覧を取得（キャッシュされたバージョン）
 * use cacheを使ってデータをキャッシュ
 */
async function getCachedTodos() {
  'use cache';
  cacheTag('todos');
  cacheLife('minutes'); // 5分キャッシュ

  console.log('[getCachedTodos] Prismaから直接取得');

  const todos = await db.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Prismaの型をTodo型に変換（id, title, isDoneのみ）
  const result: Todo[] = todos.map((todo: { id: string; title: string; isDone: boolean }) => ({
    id: todo.id,
    title: todo.title,
    isDone: todo.isDone,
  }));

  console.log('[getCachedTodos] 取得成功:', result.length, '件');

  return result;
}

/**
 * TODO一覧を取得
 * Prismaから直接取得し、use cacheでキャッシュ
 */
export async function fetchTodos(): Promise<Result<Todo[]>> {
  try {
    const todos = await getCachedTodos();
    return success(todos);
  } catch (error) {
    console.error('[fetchTodos] 例外:', error);
    return failure(
      error instanceof Error ? error.message : 'TODOの取得中に予期しないエラーが発生しました'
    );
  }
}

/**
 * TODOを作成
 * Prismaから直接作成
 */
export async function createTodoApi(payload: { title: string }): Promise<Result<Todo>> {
  try {
    const trimmedTitle = payload.title.trim();

    if (!trimmedTitle) {
      return failure('タイトルは必須です');
    }

    console.log('[createTodoApi] Prismaから直接作成:', trimmedTitle);

    // TODOを作成
    const todo = await db.todo.create({
      data: {
        title: trimmedTitle,
        isDone: false,
      },
    });

    // Prismaの型をTodo型に変換
    const result: Todo = {
      id: todo.id,
      title: todo.title,
      isDone: todo.isDone,
    };

    console.log('[createTodoApi] 作成成功:', result);

    return success(result);
  } catch (error) {
    console.error('[createTodoApi] 例外:', error);
    return failure(
      error instanceof Error ? error.message : 'TODOの作成中に予期しないエラーが発生しました'
    );
  }
}

/**
 * TODOの完了状態を切り替え
 * Prismaから直接更新
 */
export async function toggleTodoApi(payload: {
  id: string;
  isDone: boolean;
  title: string;
}): Promise<Result<Todo>> {
  try {
    const { id, title, isDone } = payload;

    console.log('[toggleTodoApi] Prismaから直接更新:', { id, title, isDone });

    // TODOを更新
    try {
      const todo = await db.todo.update({
        where: { id },
        data: {
          title: title.trim(),
          isDone,
        },
      });

      // Prismaの型をTodo型に変換
      const result: Todo = {
        id: todo.id,
        title: todo.title,
        isDone: todo.isDone,
      };

      console.log('[toggleTodoApi] 更新成功:', result);

      return success(result);
    } catch (error) {
      // Prismaのエラーをチェック（レコードが見つからない場合）
      if (error instanceof Error && error.message.includes('Record to update does not exist')) {
        return failure(`ID "${id}" のTODOが見つかりません`);
      }
      throw error;
    }
  } catch (error) {
    console.error('[toggleTodoApi] 例外:', error);
    return failure(
      error instanceof Error ? error.message : 'TODOの更新中に予期しないエラーが発生しました'
    );
  }
}
