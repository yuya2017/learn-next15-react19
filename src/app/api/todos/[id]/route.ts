import { NextResponse } from 'next/server';

import type { Todo } from '@/app/(private)/todo/_types/todo';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    isDone?: boolean;
    title?: string;
  } | null;

  if (typeof body?.isDone !== 'boolean') {
    return NextResponse.json(
      { error: 'isDone は boolean 型である必要があります' },
      { status: 400 }
    );
  }

  if (!body?.title?.trim()) {
    return NextResponse.json({ error: 'title は必須です' }, { status: 400 });
  }

  const todo: Todo = {
    id,
    title: body.title,
    isDone: body.isDone,
  };

  return NextResponse.json(
    { todo },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
