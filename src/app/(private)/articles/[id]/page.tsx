import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

import { fetchArticle } from '@/app/(private)/articles/_apis/articles.server';
import ArticleDetail from '@/app/(private)/articles/_components/ArticleDetail';
import type { Article } from '@/app/(private)/articles/_types/article';
import type { Result } from '@/types/result';

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const articlePromise = fetchArticlePromise(params);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Suspense fallback={<p>読み込み中...</p>}>
        <ArticleDetailSection articlePromise={articlePromise} />
      </Suspense>
    </div>
  );
}

// Helper to bridge params promise and data fetch
async function fetchArticlePromise(params: Promise<{ id: string }>) {
  const { id } = await params;
  return fetchArticle(id);
}

function ArticleDetailSection({ articlePromise }: { articlePromise: Promise<Result<Article>> }) {
  const result = use(articlePromise);

  if (!result.isSuccess) {
    if (result.errorMessage === '記事が見つかりません') {
      notFound();
    }
    return <div className="text-red-600">エラーが発生しました: {result.errorMessage}</div>;
  }

  return <ArticleDetail article={result.data} />;
}
