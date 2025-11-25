# 開発ワークフロー

このファイルは、AIアシスタントを使用した開発ワークフローの標準手順を定義します。
新機能の追加やバグ修正を行う際は、以下のフローに従ってください。

## 重要なドキュメント

開発を始める前に、必ず以下のドキュメントを確認してください：

- **[dev-local/frontend-rules.md](./dev-local/frontend-rules.md)**: フロントエンド開発ルール（必読）
  - プロジェクト構造、コーディング規約、Next.js/Reactのベストプラクティスがすべて記載されています
  - 実装前に必ず確認し、ルールに従って実装してください

## 基本フロー

### 1. 調査（Investigation）

実装を始める前に、既存のコードベースとルールを確認します。

#### (1) フロントエンド開発ルールを確認【必須】

`dev-local/frontend-rules.md`を読んで、以下を確認してください：
- プロジェクト構造とディレクトリ構成
- コーディング規約（`type`で統一、バレルインポート禁止など）
- Next.js/Reactのベストプラクティス（Server Component優先、`use cache`など）
- データ取得・更新戦略
- 状態管理戦略
- エラーハンドリング戦略

#### (2) Kiri MCPで既存コードを調査

既存の実装パターンを確認するために、Kiri MCPを使用します：

```
mcp__kiri__context_bundle
goal: '具体的なキーワード（関数名、コンポーネント名、機能名など）'
limit: 10
compact: true
```

**主なKiri MCPツール:**
- `mcp__kiri__context_bundle`: 関連コードを自動でランク付けして取得
- `mcp__kiri__files_search`: キーワードで検索
- `mcp__kiri__deps_closure`: 依存関係を分析
- `mcp__kiri__snippets_get`: コードの詳細を取得

#### (3) Serena MCPでシンボル解析

既存の関数、クラス、コンポーネントを詳しく調べる場合、Serena MCPを使用します：

```
mcp__serena__find_symbol
name_path: 'MyComponent'
relative_path: 'src/components/MyComponent.tsx'
include_body: false
depth: 1
```

**主なSerena MCPツール:**
- `mcp__serena__find_symbol`: シンボル（関数、クラス、コンポーネント）を検索
- `mcp__serena__find_referencing_symbols`: シンボルの使用箇所を確認
- `mcp__serena__get_symbols_overview`: ファイルのシンボル一覧を取得

#### (4) Context7 MCPでライブラリドキュメントを確認

Next.js、React、その他ライブラリの最新ドキュメントを確認する場合：

```
mcp__context7__resolve-library-id
libraryName: 'next.js'
```

その後、`mcp__context7__get-library-docs`で詳細を取得

---

### 2. 計画（Planning）

新機能や大きな変更の場合は、`specs/`フォルダに計画を作成します。

**specsフォルダの構成:**
```
specs/
├── [feature-name]/
│   ├── spec.md    # 機能仕様（ゴール、要件、受け入れ基準）
│   ├── plan.md    # 技術計画（アプローチ、データモデル、UI変更点）
│   └── tasks.md   # タスクリスト（実装タスク、DoD、依存関係）
└── templates/     # テンプレートファイル
```

**計画作成時の確認事項:**
- `dev-local/frontend-rules.md`に記載されているルールに従っているか
- 既存のパターンと一貫性があるか
- `type`で型定義を統一しているか
- バレルインポートを使用していないか（`@/` aliasで個別インポート）
- Server Component優先になっているか

**小規模な変更の場合**: この手順はスキップ可能

---

### 3. 実装（Implementation）

以下のルールに従って実装してください：

#### (1) frontend-rules.mdのルールを遵守【必須】

実装前に、`dev-local/frontend-rules.md`を再確認し、以下の重要なルールを遵守してください：
- **型定義は`type`で統一**（`interface`は使わない）
- **コンポーネントは`default export`で統一**（Named Exportは使わない）
- **バレルインポート禁止**（`@/` aliasで個別インポート）
- **Server Componentを優先**（Client Componentは必要最小限）
- **`use cache`でキャッシュを明示的に制御**
- **Suspenseで非同期コンポーネントをラップ**
- **クライアントフェッチはTanStack Query + Route Handler**（useEffectでのフェッチは禁止）
- **Result型でエラーハンドリング**（想定済みエラーは`throw`しない）

#### (2) Serena MCPでシンボルベース編集

Serena MCPを使って、シンボル（関数、クラス、コンポーネント）を正確に編集します。

**主な操作:**
- **シンボルの置換**: `mcp__serena__replace_symbol_body`
- **コードの挿入**: `mcp__serena__insert_after_symbol` / `mcp__serena__insert_before_symbol`
- **シンボルのリネーム**: `mcp__serena__rename_symbol`
- **参照の確認**: `mcp__serena__find_referencing_symbols`

#### (3) コーディング規約

**ファイル命名:**
- **コンポーネント**: `PascalCase.tsx`（例: `UserProfile.tsx`）
- **ルーティング用ディレクトリ**: `kebab-case/`（例: `user-profile/`）
- **その他のファイル**: `camelCase.ts`（例: `fetchUser.ts`, `userSchema.ts`）

**APIファイルの分離:**
- **Server用**: `*.server.ts`（例: `userApi.server.ts`）
- **Client用**: `*.client.ts`（例: `userApi.client.ts`）
- 必ず用途に応じて分離すること

**その他の規約:**
- TypeScriptの型定義は厳密に（**`type`で統一**）
- コンポーネントは**`default export`で統一**
- 日本語コメントで意図を明確に
- ESLint、Prettierの設定に従う
- 既存パターンに準拠

---

### 4. テスト実行（Quality Checks）【必須】

実装完了後、以下のチェックを必ず実行してください：

```bash
# 型チェック
npm run type-check

# Lint
npm run lint

# テスト実行（ある場合）
npm run test

# ビルド確認
npm run build
```

**すべてのチェックがパスするまで修正してください。**

---

### 5. 動作確認（Browser Verification）

開発サーバーで動作確認を行ってください：

```bash
# 開発サーバー起動
npm run dev
```

#### (1) Next.js MCPでランタイムエラー確認【推奨】

開発サーバーが起動したら、Next.js MCPでランタイムエラーを確認してください：

```
mcp__next-devtools__nextjs_index
```
でサーバーを検出し、

```
mcp__next-devtools__nextjs_call
port: '3000'
toolName: 'get_errors'
```
でエラーを確認してください。

**注意:**
- ツール名はアンダースコア（`get_errors`）を使用
- ブラウザでページを開いた後に確認すると正確

#### (2) Chrome DevTools MCPでブラウザ確認【任意】

複雑なUIやパフォーマンス測定が必要な場合は、Chrome DevTools MCPを使用してください：

- `mcp__chrome-devtools__take_snapshot`: ページ構造確認
- `mcp__chrome-devtools__list_console_messages`: コンソールエラー確認
- `mcp__chrome-devtools__list_network_requests`: ネットワークリクエスト確認

---

## クイックリファレンス

| 変更タイプ | 調査 | 計画作成 | 実装 | チェック |
|-----------|------|----------|------|----------|
| **新機能追加** | Kiri + frontend-rules.md | `specs/[feature-name]/` | Serena | type-check, lint, test, build, Next.js MCP |
| **バグ修正** | Kiri + frontend-rules.md | 不要（小規模） | Serena | type-check, lint, test, build |
| **リファクタリング** | Kiri + frontend-rules.md | `specs/[feature-name]/`（推奨） | Serena | type-check, lint, test, build |
| **ドキュメント更新** | - | 不要 | - | - |

---

## MCP使い分けまとめ

| フェーズ | 使用MCP | 主な用途 |
|---------|---------|---------|
| **調査** | Kiri MCP | コードベース検索、コンテキスト抽出、依存関係分析 |
| **調査** | Serena MCP | シンボル解析、参照確認 |
| **調査** | Context7 MCP | ライブラリドキュメント取得 |
| **実装** | Serena MCP | シンボルベース編集、リネーム、挿入・置換 |
| **動作確認** | Next.js MCP | ランタイムエラー確認、ルート確認 |
| **詳細検証** | Chrome DevTools MCP | ブラウザ検証、パフォーマンス測定（任意） |

**Kiri vs Serenaの使い分け**:
- **調査（読み取り）**: Kiri → セマンティック検索、自動ランク付け、依存関係分析
- **詳細分析**: Serena → シンボル解析、参照確認
- **実装（書き込み）**: Serena → シンボル編集、リネーム、挿入・置換

---

## 重要な確認事項

### 実装前の必須チェック

- [ ] `dev-local/frontend-rules.md`を確認済み
- [ ] 型定義は`type`で統一（`interface`未使用）
- [ ] コンポーネントは`default export`で統一（Named Export未使用）
- [ ] ファイル命名規則を遵守（コンポーネント: PascalCase、ディレクトリ: kebab-case、その他: camelCase）
- [ ] APIファイルは`*.server.ts` / `*.client.ts`で分離
- [ ] バレルインポート未使用（`@/` aliasで個別インポート）
- [ ] Server Component優先（Client Componentは必要最小限）
- [ ] クライアントフェッチはTanStack Query + Route Handler（useEffect未使用）
- [ ] 既存パターンと一貫性がある

### 実装後の必須チェック

- [ ] `npm run type-check`が通る
- [ ] `npm run lint`が通る
- [ ] `npm run test`が通る（テストがある場合）
- [ ] `npm run build`が成功
- [ ] Next.js MCPでランタイムエラーがない

---

## 注意事項

1. **frontend-rules.mdは必読**: 実装前に必ず`dev-local/frontend-rules.md`を確認すること
2. **typeで型定義を統一**: `interface`ではなく`type`を使用すること（frontend-rules.mdのルール）
3. **default exportで統一**: コンポーネントは`default export`を使用し、Named Exportは使わない
4. **ファイル命名規則を厳守**: コンポーネント（PascalCase）、ルーティング（kebab-case）、その他（camelCase）を区別
5. **APIファイルを分離**: Server用（`*.server.ts`）とClient用（`*.client.ts`）を必ず分ける
6. **MCPツールを積極的に活用**: 調査はKiri、実装はSerena、動作確認はNext.js MCPを使用
7. **エラーは必ず修正**: チェックでエラーが出たら必ず修正してから次に進むこと
8. **段階的にコミット**: 大きすぎる変更は避け、小さく区切ってコミットすること
9. **不明点は質問**: わからないことがあれば、実装前に質問すること
