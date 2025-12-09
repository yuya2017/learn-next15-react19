'use server';

import { revalidatePath } from 'next/cache';

import { createArticleApi } from '@/app/(private)/articles/_apis/articles.server';
import { failure, success } from '@/lib/result';
import type { Result } from '@/types/result';

/**
 * ランダムな記事を作成するServer Action
 */
export async function createRandomArticleAction(): Promise<Result<void>> {
  const randomId = Math.floor(Math.random() * 1000);
  const title = `テスト記事 ${randomId}`;
  const content = `これはテスト記事 ${randomId} の本文です。\nキャッシュされずに即座に表示されることを確認します。`;

  const result = await createArticleApi({ title, content });

  if (!result.isSuccess) {
    return failure(result.errorMessage);
  }

  // 一覧ページを再検証（念のためだが、No Cacheなら不要かもしれない。しかし仕様として入れておく）
  // "Use cache"を使っていないので、動的レンダリングされるはずだが、
  // revalidatePathを入れることでRouter Cacheをクリアする効果がある。
  revalidatePath('/articles');

  return success(undefined);
}
