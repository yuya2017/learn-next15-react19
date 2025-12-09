import { Suspense, use } from 'react';

import { fetchArticles } from '@/app/(private)/articles/_apis/articles.server';
import ArticleList from '@/app/(private)/articles/_components/ArticleList';
import type { Article } from '@/app/(private)/articles/_types/article';
import type { Result } from '@/types/result';

export default function Page() {
  const articlesPromise = fetchArticles();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">記事アプリ（No Cache）</h1>
        <p className="text-slate-600">
          このページはキャッシュを使用せず、常に最新のデータを取得します。
        </p>
      </header>

      <Suspense fallback={<p>読み込み中...</p>}>
        <ArticleListSection articlesPromise={articlesPromise} />
      </Suspense>
    </div>
  );
}

function ArticleListSection({ articlesPromise }: { articlesPromise: Promise<Result<Article[]>> }) {
  const result = use(articlesPromise);

  if (!result.isSuccess) {
    return <div className="p-6 text-red-600">エラーが発生しました: {result.errorMessage}</div>;
  }

  return <ArticleList articles={result.data} />;
}
