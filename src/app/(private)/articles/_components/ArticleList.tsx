'use client';

import Link from 'next/link';
import { useTransition } from 'react';

import { createRandomArticleAction } from '@/app/(private)/articles/actions/article';
import type { Article } from '@/app/(private)/articles/_types/article';

type Props = {
  articles: Article[];
};

export default function ArticleList({ articles }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createRandomArticleAction();
      if (!result.isSuccess) {
        alert(result.errorMessage);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-900">記事一覧（{articles.length}件）</h2>
        <button
          onClick={handleCreate}
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? '作成中...' : 'ランダム記事作成'}
        </button>
      </div>

      <div className="grid gap-4">
        {articles.length === 0 ? (
          <p className="text-gray-500">記事がありません。</p>
        ) : (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:shadow-sm"
              prefetch={false} // No cache requirement implies we might want to fetch fresh data on navigation
            >
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{article.title}</h3>
              <p className="line-clamp-2 text-sm text-slate-600">{article.content}</p>
              <div className="mt-2 text-xs text-slate-400">
                作成日: {new Date(article.createdAt).toLocaleString()}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
