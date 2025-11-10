import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { failure, success } from '@/lib/result';
import type { Result } from '@/types/result';
import type { Todo } from '@/app/(private)/todo/_types/todo';

/**
 * GET /api/todos
 * TODO一覧を取得
 */
export async function GET(): Promise<NextResponse<Result<Todo[]>>> {
  try {
    const todos = await db.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Prismaの型をTodo型に変換（id, title, isDoneのみ）
    const result: Todo[] = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      isDone: todo.isDone,
    }));

    return NextResponse.json(success(result));
  } catch (error) {
    console.error('[GET /api/todos] エラー:', error);
    return NextResponse.json(
      failure(
        error instanceof Error ? error.message : 'TODOの取得中に予期しないエラーが発生しました'
      ),
      { status: 500 }
    );
  }
}

/**
 * POST /api/todos
 * TODOを作成
 */
export async function POST(request: NextRequest): Promise<NextResponse<Result<Todo>>> {
  try {
    const body = await request.json();
    const { title } = body;

    // バリデーション
    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    if (!trimmedTitle) {
      return NextResponse.json(failure('タイトルは必須です'), { status: 400 });
    }

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

    return NextResponse.json(success(result), { status: 201 });
  } catch (error) {
    console.error('[POST /api/todos] エラー:', error);
    return NextResponse.json(
      failure(
        error instanceof Error ? error.message : 'TODOの作成中に予期しないエラーが発生しました'
      ),
      { status: 500 }
    );
  }
}
