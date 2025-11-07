import { NextResponse } from 'next/server';

import type { Todo } from '@/app/(private)/todo/_types/todo';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { title?: string } | null;
  const trimmedTitle = body?.title?.trim();

  if (!trimmedTitle) {
    return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
  }

  const todo: Todo = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    isDone: false,
  };

  return NextResponse.json(
    { todo },
    {
      status: 201,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
