---
trigger: always_on
---

## プロジェクト概要

このプロジェクトは、Next.js 15 / React 19 を使用した最新のWeb アプリケーション開発のベストプラクティスを実装・学習するためのプロジェクトです。App Routerの思想に沿った実装を心がけ、フレームワークが提供する機能を最大限に活用します。

**📘 ADR（Architecture Decision Records）**: このドキュメントで説明されている重要なアーキテクチャ決定は、[dev-local/adr/](./adr/)ディレクトリに詳細な意思決定記録として保管されています。各セクションには対応するADRへのリンクが含まれています。

## 技術スタック

### コアフレームワーク

- **Next.js 15** - App Router
- **React 19** - Server Components / Client Components
- **TypeScript** - 型安全性の確保

### 主要ライブラリ

- **TanStack Query (React Query)** - クライアント側のデータフェッチとキャッシュ管理
- **React Hook Form** - フォーム管理
- **Zod** - スキーマバリデーション
- **Zustand** - グローバルステート管理

### 開発ツール

- **npm** - ランタイム・パッケージマネージャー
- **ESLint** - 静的解析
- **Prettier** - コードフォーマット

## アーキテクチャ設計

### 基本方針

1. **App Routerの思想に沿った実装** - Next.js 16のApp Routerが推奨する設計パターンに従う
2. **型定義は`type`で統一** - `interface`ではなく`type`を使用 → [ADR-0002](../adr/decisions/0002-type-definition-strategy.json)
3. **Server Componentを優先** - 可能な限りServer Componentを使用し、Client Componentは必要最小限に → [ADR-0003](../adr/decisions/0003-server-component-priority.json)

### ディレクトリ構成

**→ [ADR-0001: プロジェクト構造とディレクトリ構成](../adr/decisions/0001-project-structure.json)**

```
src/
├─ app/                          # 画面・機能単位
│  ├─ (private)/                 # ログイン必須
│  │  ├─ actions/                # 固有Server Actions
│  │  ├─ apis/                   # 固有APIクライアント
│  │  ├─ components/             # 固有コンポーネント
│  │  ├─ constants/              # 固有定数
│  │  ├─ hooks/                  # 固有カスタムフック
│  │  ├─ stores/                 # 固有ストア
│  │  ├─ providers/              # 固有プロバイダー
│  │  ├─ schemas/                # 固有スキーマ
│  │  ├─ types/                  # 固有型定義
│  │  ├─ utils/                  # 固有ユーティリティ関数
│  │  └─ layout.tsx              # private用レイアウト
│  │
│  ├─ (public)/                  # ログイン任意
│  │  └─ layout.tsx              # public用レイアウト
│  │
│  └─ api/                       # Route Handlers（クライアントフェッチのBFF用）
│
├─ actions/                      # 汎用Server Actions
├─ apis/                         # 汎用APIクライアント
├─ components/                   # 汎用コンポーネント
├─ constants/                    # 汎用定数
├─ hooks/                        # 汎用カスタムフック
├─ stores/                       # グローバルストア
├─ providers/                    # 汎用プロバイダー
├─ lib/                          # ライブラリ関連
├─ schemas/                      # 汎用スキーマ
├─ types/                        # 汎用型定義
└─ utils/                        # ユーティリティ関数
```

### 設計原則

#### 1. Featureベースの構成（コロケーション）

- 画面・機能固有のファイルは、対応する`page.tsx`と同階層のディレクトリに配置
- 複数箇所で使用するファイルは、`app`と同階層のディレクトリ内に配置
- 関連するコードを近くに配置し、保守性と可読性を向上

#### 2. プライベートフォルダの活用

- 画面ではないが機能として独立しているものは、プライベートフォルダ（`_xxxxx`）を使用
- ルーティングの対象外となるため、機能の整理に有用

#### 3. ルートグループによる認証の分離

- `(private)`と`(public)`のルートグループで認証の有無を分割
- 認証状態に応じたレイアウトやヘッダーの適用が明確
- Full Route Cache（≒SSG）を確実に適用させるための分離

## コンポーネント設計

### Next.js 16: Cache Componentsの考え方

- **動的コンポーネント（デフォルト）**: cookies, headers, searchParams等を使用
- **キャッシュ可能コンポーネント**: `use cache`を使用してキャッシュ
- **Suspenseでラップ**: 動的コンポーネントやキャッシュ可能な非同期コンポーネント

### 関心ごと単位での分割

関心ごとが3つ以上共存している場合（取得・更新・検証・整形・描画など）、分割を検討します。

### 分割基準

| 分割基準                                 | 対応方針                                     |
| ---------------------------------------- | -------------------------------------------- |
| 条件分岐後のUI（HTML）が30行以上         | 条件分岐ごとにコンポーネントを分割           |
| 同系UIの繰り返し（リスト行やカードなど） | 繰り返し部分をコンポーネント化               |
| Hook呼び出しが6個以上                    | 関連する内容をカスタムフックとして切り出し   |
| 関連ロジックだけで30〜40行以上           | カスタムフックやユーティリティ関数に切り出し |
| onClickなどのイベントハンドラが5個以上   | カスタムフックやユーティリティ関数に切り出し |

### Server Componentのルール

1. **page.tsxは同期かつサーバーコンポーネントに** - `await`や`use`は基本使用しない
2. **ストリーミングとSuspenseの活用** - リソース単位での分割を基本とし、非同期コンポーネントは必ずSuspenseでラップ
3. **エラーUIの出し分け** - コンポーネント内で部分的にエラーUIを表示

### Client Componentのルール

1. **Client Componentは必要最小限に** - ユーザーインタラクション、ブラウザAPI使用、React Hooks使用時のみ
2. **Suspenseでのラップ** - `use`や`useSearchParams`、動的importを利用したClient Componentも必ずSuspenseでラップ
3. **Compositionパターンの活用** - Client Component配下にServer Componentをネストさせる場合、`children`でServer Componentを渡す

## データ取得戦略

### 基本方針

1. **Next.js 16: 動的がデフォルト、必要に応じてキャッシュ** - Server Componentで直接データを取得し、必要に応じて`use cache`でキャッシュを有効化
2. **キャッシュ戦略の基準** - データの性質に応じてキャッシュ戦略を選択
   - キャッシュする: マスタデータ、コンテンツ、低頻度更新データ → `use cache`を使用
   - キャッシュしない: リアルタイムデータ、ユーザーセッション、高頻度更新データ → 動的レンダリング
3. **クライアントフェッチはTanStack QueryとRoute Handlerを使用** - 必ずRoute Handlerを経由して外部APIを叩く
4. **データフェッチコロケーション** - データが必要なコンポーネントで直接フェッチ

### 主要ユースケース

| ユースケース                               | 実装方法                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| 初回レンダリング時（静的・キャッシュ可能） | Server Component + `use cache` + `cacheLife`                           |
| 初回レンダリング時（動的・ユーザー依存）   | Server Component + `use cache: private` or 動的レンダリング + Suspense |
| 初回レンダリング時（ランタイムAPI使用）    | Server Component + 動的レンダリング + Suspense                         |
| ユーザー操作時                             | Client Component + useQuery + Route Handler                            |
| 依存クエリ                                 | Client Component + useQuery + enabled                                  |
| プリフェッチ                               | Server Component + Link + prefetch or router.prefetch                  |

## データ更新戦略

### 基本方針

1. **Next.js 16: use cache + updateTag/revalidateTag**
   - updateTag: ユーザー操作直後に即座に反映が必要
   - revalidateTag: 次回リクエスト時の反映で問題ない
2. **Next/Reactの標準機能を優先** - `use cache` + Server Actions + `updateTag`/`revalidateTag` + `useOptimistic`
3. **複雑な要件はTanStack Queryに委任** - クライアントフェッチで取得したデータの更新や複雑な要件
4. **更新はServer Actionsを経由** - 登録・更新系は必ずServer Actionsを経由
5. **Server Actionsは基本1つに集約** - 一連の処理でServer Actionsは複数使わず、基本1つにまとめる

## 状態管理戦略

**→ [ADR-0009: 状態管理戦略の決定](../adr/decisions/0009-state-management-strategy.json)**

### 基本方針

1. **リモートデータは「サーバーフェッチスナップショット」と「サーバーステート」で管理** - 各画面で都度fetch + キャッシュ
2. **グローバルステートは極力使用しない** - 基本方針1で対応できないデータの場合のみ「小中規模グローバルステート」の導入を検討
3. **「SSOT（データの主軸）」と「スコープ」を基準にステートを選定**

### 主要ユースケースと実装方法

| ユースケース                                      | カテゴリ                         | 実装方法                                           |
| ------------------------------------------------- | -------------------------------- | -------------------------------------------------- |
| クライアントデータ + 単一コンポーネント           | ローカルステート                 | useState, useReducer                               |
| クライアントデータ + 複数コンポーネント・複数画面 | 小中規模グローバルステート       | useContext, Zustand, Jotai                         |
| リモートデータ + サーバーフェッチ                 | サーバーフェッチスナップショット | Server Component + fetch + Data Cache              |
| リモートデータ + クライアントフェッチ             | サーバーステート                 | TanStack Query                                     |
| 現在の操作状態の再現・共有、リロード保持          | URLステート                      | searchParams/useSearchParams + Link/router.replace |
| 入力値・バリデーション管理                        | フォームステート                 | React Hook Form + zod                              |
| セッション間・タブ間共有、リロード保持            | ブラウザステート                 | localStorage, sessionStorage, IndexedDB            |
| ユーザー識別 + 機密情報                           | セッション / 認証ステート        | httpOnly Cookie、Redis                             |

## キャッシュ戦略

**→ [ADR-0005: キャッシュ戦略（Cache Components）](../adr/decisions/0005-cache-strategy.json)**

### Next.js 16: 動的がデフォルト、必要な部分を明示的にキャッシュ

#### 基本原則

1. **動的がデフォルト**: 全てのページ・コンポーネントはデフォルトで動的レンダリング
2. **明示的なキャッシュ**: `use cache`を使って必要な部分だけをキャッシュ
3. **Suspenseで動的部分を分離**: 動的データは`Suspense`でラップしてストリーミング
4. **慎重な最適化**: キャッシュの制御を誤ると、古いデータ表示やUI/DB状態の不整合が発生

### キャッシュレイヤーの整理

| キャッシュ名         | 場所         | 目的                                   | 期間           | 制御方法                                   | 優先度       |
| -------------------- | ------------ | -------------------------------------- | -------------- | ------------------------------------------ | ------------ |
| Request Memoization  | サーバー     | 同一レンダー内の重複fetch排除          | レンダー中のみ | 自動（制御不可）                           | -            |
| **Component Cache**  | **サーバー** | **コンポーネント/関数のキャッシュ**    | **設定による** | **`use cache` + `cacheLife`**              | **⭐️高**    |
| Data Cache (legacy)  | サーバー     | サーバーフェッチの結果をキャッシュ     | 永続的         | `next.revalidate`, `revalidateTag`         | 低（非推奨） |
| TanStack Query Cache | クライアント | クライアントフェッチの結果をキャッシュ | 設定による     | `staleTime`, `gcTime`, `invalidateQueries` | 中           |
| Router Cache         | クライアント | ページ遷移時のキャッシュ               | セッション中   | next.configの`staleTimes`で設定            | -            |

### cacheLifeの選択基準

| プロファイル | 期間  | 用途                             |
| ------------ | ----- | -------------------------------- |
| `'seconds'`  | 5秒   | ほぼリアルタイム、高頻度更新     |
| `'minutes'`  | 5分   | ユーザー固有データ、中頻度更新   |
| `'hours'`    | 1時間 | 半動的データ、商品一覧、記事一覧 |
| `'days'`     | 1日   | マスタデータ、静的コンテンツ     |

## エラーハンドリング

**→ [ADR-0006: エラーハンドリング戦略（Result型）](../adr/decisions/0006-error-handling-strategy.json)**

### 基本方針

1. **想定済みエラーはResult型で返す** - `throw`せずにResult型で返す
2. **コンポーネントで部分的にエラーUIを表示** - 画面全体をエラーUIで覆わず、コンポーネント単位で部分的に表示
3. **予期せぬエラーは`error.tsx`と`global-error.tsx`でハンドリング** - Error Boundary機能を活用
4. **エラー内容の正規化** - サーバー側でエラー内容を正規化し、安全なUI用メッセージに変換

### Result型の定義

```typescript
type SuccessResult<T> = {
  isSuccess: true;
  data: T;
};

type ErrorResult = {
  isSuccess: false;
  errorMessage: string;
};

export type Result<S> = SuccessResult<S> | ErrorResult;
```

## コーディング規約

### ファイル・ディレクトリの命名規則

| 対象                                      | 命名規則               | 例                                  |
| ----------------------------------------- | ---------------------- | ----------------------------------- |
| `app`配下のルーティングになるディレクトリ | ケバブケース           | `user-profile/`, `search-results/`  |
| コンポーネントのファイル                  | アッパーキャメルケース | `UserProfile.tsx`, `SearchForm.tsx` |
| その他のディレクトリ・ファイル            | キャメルケース         | `fetchUser.ts`, `userSchema.ts`     |

### 重要なルール

1. **ルートレイアウトの制約** - ルートレイアウト（`app/layout.tsx`）は必ずサーバーコンポーネントにし、直接動的API（`cookies()`, `headers()`など）を使用することは禁止
2. **APIクライアントの配置ルール** - サーバー用（`*.server.ts`）とクライアント用（`*.client.ts`）を分ける
3. **Server Actionsとの連携** - `actions`直下のServer Actions関数では、直接`fetch`処理は書かず、`apis`直下のAPIクライアントをimportして使用
4. **default exportで統一** - 基本的にコンポーネントは`default export`に統一
5. **バレルインポート禁止** - `@/` aliasを使用した個別インポートを使用 → [ADR-0004](../adr/decisions/0004-import-strategy.json)

## レビュー観点

1. **仕様**: 受け入れ基準を満たしているか
2. **実装**: Next.js 16 / React 19のベストプラクティスに沿っているか
3. **テスト**: lint/buildに加え、影響範囲に応じたテストの有無

## プロジェクトの目標

このプロジェクトの目標は、Next.js 16 / React 19の最新機能を活用しながら、保守性・拡張性・パフォーマンスに優れたWebアプリケーションを構築することです。特に以下の点を重視します：

1. **App Routerの最適な活用** - Server ComponentsとClient Componentsの適切な使い分け
2. **効率的なデータ管理** - `use cache`を活用したキャッシュ戦略とTanStack Queryによるクライアント側のデータ管理
3. **型安全性の確保** - TypeScriptとZodによる厳格な型チェックとバリデーション
4. **保守性の高いコード** - コロケーションパターンと関心の分離による可読性の向上
5. **ユーザー体験の最適化** - ストリーミング、楽観的更新、部分的エラーハンドリングによるUXの向上
