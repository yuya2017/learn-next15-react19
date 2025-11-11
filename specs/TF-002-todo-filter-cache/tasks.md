# /tasks TF-002 Todo Filter Cache Component

## Task 1: 動的フェッチの追加と streaming prefetch
- **Description**: `fetchTodos()` とは別にキャッシュしないフェッチ関数を `src/app/(private)/todo/_apis/todos.server.ts` に追加し、`TodoFilterPage` で `headers()` → `getQueryClient()` → `prefetchQuery`（await なし）→ `dehydrate` → `HydrationBoundary` の順で実装する。`prefetchQuery` の `queryFn` では新関数を利用し、失敗時は `throw` してクライアントの ErrorBoundary へ伝播させる。
- **Definition of Done**:
  - 新しい動的フェッチ関数が Result<Todo[]> を返し、`use cache` を使用しない。
  - `TodoFilterPage` で `headers()` を QueryClient 生成前に呼び、`prefetchQuery` によって pending クエリを `dehydrate` へ含めている（`void queryClient.prefetchQuery(...)`）。
  - UI（`HydrationBoundary` + `TodoFilterClient`）の構造とテキストは維持されている。
  - ESLint/TypeScript エラーが発生していない。

## Task 2: 動作確認とナレッジ更新
- **Description**: `/todo-filter` の動作確認を行い、`next-prerender-current-time` エラーが消えていること、UI とフィルタ操作が維持されていることを確認。必要に応じて `docs/knowledge` へ学びを整理。
- **Definition of Done**:
  - `npm run lint` または該当スクリプトで静的チェックを実行し成功（もしくは理由付きで未実施を報告）。
  - 手動または自動テストで `/todo-filter` がエラーなく描画されることを確認し、結果を記録。
  - 変更点が再発防止に価値があれば `docs/knowledge/<date>-todo-filter-cache.md` を作成し、今回の streaming 方針をまとめる（必要性が低ければ理由を記載して割愛）。
