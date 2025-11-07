'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = {
  children: React.ReactNode;
};

export default function ReactQueryProvider({ children }: Props) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          dehydrate: {
            // pending状態のqueryもdehydrate結果に含めるようにする
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
