import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * Server Component用のQueryClientを取得
 * Reactのcacheを使用して、同一リクエスト内で同じインスタンスを返す
 */
export const getQueryClient = cache(() => {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        // pending状態のqueryもdehydrate結果に含める
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      queries: {
        staleTime: 60 * 1000, // 1分間キャッシュ
      },
    },
  });
});
