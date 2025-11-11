# /specify TF-002 Todo Filter Cache Component

## ゴール
- /todo-filter ルートで React Query の QueryClient 生成に伴う `Date.now()` 参照を Server Component 制約に抵触させず、初回描画と操作時のデータ取得が安定して行われる状態にする。
- 既存の Todo フィルタ UI／UX（prefetch + Hydration + useQuery）を維持しつつ、Next.js 公式推奨の「prefetchQuery + Hydration」パターンを streaming 対応で実装する。

## コンテキスト
- Next.js 15 + React 19 の Server Component では、`Date.now()` などの Clock API をリクエストデータ/IO に先行して呼ぶと `next-prerender-current-time` エラーになる。
- `src/app/(private)/todo-filter/page.tsx` が `getQueryClient()` を即時呼び出す構造のため、`QueryClient` 生成時に内部で `Date.now()` が実行され、Cache/Request 依存データを読む前に現在時刻へアクセスしている。
- 本ルートは社内研修用途のデモであり、SSR + React Query Hydration のベストプラクティスを示す必要がある。
- `.cursor/rules/02-data-fetching.mdc` の方針に従い、`use cache` を使うサーバー関数と React Query のハイブリッドは避ける必要があり、キャッシュ無しのフェッチ関数を用意する。

## ユーザーストーリー
- As a 研修受講者, When /todo-filter ページで React Query を用いたデータ操作パターンを確認するとき, I want the page to render without Next.js の現在時刻制約エラー so that I can学習を中断せずに動作を把握できる。

## 解決案（Best-of-N）
### 案A: `prefetchQuery` + 動的フェッチの streaming パターン（採用）
- `fetchTodos()` とは別にキャッシュしない `fetchTodosDynamic()` を追加し、`prefetchQuery` の `queryFn` で利用する。
- `TodoFilterPage` で `headers()` を先に読むことで Date.now 制約を満たし、その後 `getQueryClient()` → `prefetchQuery`（await しない）→ `dehydrate` → `HydrationBoundary` の順で実装する。
- 利点: Next.js 公式サンプルに沿った streaming パターンを示せる。追加コンポーネント不要でシンプル。

### 案B: Cache Component を新設し、その内部で QueryClient 生成と `fetchTodos()` 実行
- `TodoFilterPage` から QueryClient 生成と prefetch/Dehydrate を切り出し、`Cache` ディレクティブ付きの子コンポーネントへ移管する。
- 利点: Server Component のまま構造維持。欠点: `.cursor/rules` の「`use cache` と React Query を混在させない」という指針に反するため追加設計が必要。

**採用案: 案A** – streaming 対応のハイブリッドパターンを教材として示せるうえ、Cache Component を追加せずに Date.now 制約を解消できる。

## 機能要件
- [ ] `fetchTodos()` とは別にキャッシュを使わないフェッチ関数を追加し、React Query の `queryFn` で利用できるようにする。
- [ ] `TodoFilterPage` でリクエスト依存データ（例: `headers()`）を先に読み、続けて `prefetchQuery`（非同期）→`dehydrate`→`HydrationBoundary` の流れを構築する。
- [ ] 既存の `HydrationBoundary` + `TodoFilterClient` 構造を保持し、UI レイアウトやコピーを変えない。
- [ ] エラー発生時にはこれまでと同じく例外を投げ、Next.js のエラーハンドリングに委譲する。

## 非機能要件
- `'use cache'` + TanStack Query の併用を避けるため、キャッシュ無しフェッチは別関数に閉じ込める。
- 追加するロジックには型安全性を確保し、不要な console.log を増やさない。
- 単体/結合テストは既存と同等のカバレッジを保ち、最低限手動で /todo-filter がエラーなく開けることを確認する。

## 受け入れ基準（テスト観点）
- [ ] `npm run dev` で `/todo-filter` にアクセスしても `next-prerender-current-time` エラーが出ない。
- [ ] 初回描画で TODO 一覧がこれまで通り表示される。
- [ ] フィルタ/ソート操作後も React Query の再取得が正しく行われる。

## 曖昧さ・前提
- [NEEDS CLARIFICATION] Cache Component のキャッシュ期間や invalidation ポリシーをどこまで細かく設定するか（現状は `fetchTodos()` 自体が `cacheLife('minutes')` を持つ）。
- [NEEDS CLARIFICATION] Cache Component を `/todo-filter` 専用とするか、他ルート（例: `/todo-search`）でも再利用するユーティリティとして抽象化するか。
