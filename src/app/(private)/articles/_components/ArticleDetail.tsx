'use client';

import Link from 'next/link';

import type { Article } from '@/app/(private)/articles/_types/article';

type Props = {
  article: Article;
};

export default function ArticleDetail({ article }: Props) {
  return (
    <article className="rounded-lg bg-white p-6 shadow-sm">
      <header className="mb-6 border-b border-slate-100 pb-4">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">{article.title}</h1>
        <div className="text-sm text-slate-500">
          作成日: {new Date(article.createdAt).toLocaleString()}
        </div>
      </header>

      <div className="prose max-w-none whitespace-pre-wrap text-slate-800">{article.content}</div>

      <div className="mt-8 border-t border-slate-100 pt-4">
        <Link href="/articles" className="text-sm font-medium text-blue-600 hover:text-blue-800">
          ← 一覧に戻る
        </Link>
      </div>
    </article>
  );
}
