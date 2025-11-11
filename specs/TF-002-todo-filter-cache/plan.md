# /plan TF-002 Todo Filter Cache Component

## システム影響範囲
- `src/app/(private)/todo-filter/page.tsx`
  - ページ直下で `headers()` を先に読み、`prefetchQuery`（非await）→`dehydrate`→`HydrationBoundary` の streaming パターンに再構築する。
- `src/app/(private)/todo/_apis/todos.server.ts`
  - `'use cache'` を含まないフェッチ関数（例: `fetchTodosDynamic`）を追加し、React Query の `queryFn` で利用できるようにする。
- `src/lib/queryClient.ts`
  - 既存の `getQueryClient` をそのまま使用。

## 技術案（Best-of-N）
1. **案A: streaming prefetch + dynamic fetch（採用）**
   - `headers()` を先に呼んで Date.now 制約を満たし、`prefetchQuery` では `'use cache'` を使わない `fetchTodosDynamic` を利用。`prefetchQuery` は await せず pending を Hydration に含める。
   - 理由: `.cursor/rules` の方針に沿い、公式サンプルと同じパターンを教材にできる。
2. 案B: Cache Component で QueryClient を隔離
   - 以前の案。追加コンポーネントや `'use cache'` 使用が必要になるため、教材方針から外れる。

## 変更ファイル/ディレクトリ見積もり
1. `src/app/(private)/todo-filter/page.tsx`
2. `src/app/(private)/todo/_apis/todos.server.ts`
3. `.cursor/rules/02-data-fetching.mdc` への追記は不要（既存方針に従うため）

## リスクと緩和策
- **`prefetchQuery` で非同期エラーが握りつぶされる**: `queryFn` 内で Result をチェックし、明示的に `throw`。Client 側の ErrorBoundary で検知できるようにする。
- **Date.now 制約の再発**: `headers()` をページ先頭で呼び、QueryClient 生成より前にリクエストデータへアクセスする。
- **`use cache` 併用リスク**: dynamic フェッチ用関数を完全に分離し、`prefetchQuery` ではキャッシュを使わないデータソースのみを呼ぶ。
