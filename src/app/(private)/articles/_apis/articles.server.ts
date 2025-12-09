import { db } from '@/lib/db';
import { failure, success } from '@/lib/result';
import type { Result } from '@/types/result';

import type { Article } from '@/app/(private)/articles/_types/article';

/**
 * 記事一覧を取得
 * キャッシュを使用せず、常に最新のデータを取得
 */
export async function fetchArticles(): Promise<Result<Article[]>> {
  try {
    console.log('[fetchArticles] DBから直接取得 (No Cache)');

    const articles = await db.article.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result: Article[] = articles.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));

    return success(result);
  } catch (error) {
    console.error('[fetchArticles] エラー:', error);
    return failure(error instanceof Error ? error.message : '記事一覧の取得に失敗しました');
  }
}

/**
 * 記事詳細を取得
 * キャッシュを使用せず、常に最新のデータを取得
 */
export async function fetchArticle(id: string): Promise<Result<Article>> {
  try {
    console.log(`[fetchArticle] DBから直接取得 id=${id} (No Cache)`);

    const article = await db.article.findUnique({
      where: { id },
    });

    if (!article) {
      return failure('記事が見つかりません');
    }

    const result: Article = {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };

    return success(result);
  } catch (error) {
    console.error(`[fetchArticle] エラー id=${id}:`, error);
    return failure(error instanceof Error ? error.message : '記事詳細の取得に失敗しました');
  }
}

/**
 * 記事を作成（テスト用）
 */
export async function createArticleApi(payload: {
  title: string;
  content: string;
}): Promise<Result<Article>> {
  try {
    console.log('[createArticleApi] 作成開始', payload);

    const article = await db.article.create({
      data: {
        title: payload.title,
        content: payload.content,
      },
    });

    const result: Article = {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };

    return success(result);
  } catch (error) {
    console.error('[createArticleApi] エラー:', error);
    return failure(error instanceof Error ? error.message : '記事の作成に失敗しました');
  }
}
