# CC-001 技術計画: CRUDCRUDからローカルPostgreSQLへの移行

## ゴール
- `crudcrud.com`への依存を完全に排除し、Docker Composeで起動するローカルPostgreSQLに置き換える
- Next.js 16の`use cache`とRoute Handlerを活用したBFFアーキテクチャを維持
- 開発者が`docker compose up -d`と`npm run dev`で即座に開発を開始できる環境を構築

## 制約・前提
- **既存アーキテクチャの維持**: `apis/*.server.ts` → Route Handler → PostgreSQL の流れを維持
- **Result型の継続**: 既存のエラーハンドリング（`types/result.ts`）を遵守
- **`use cache`の活用**: Next.js 16のComponent Cacheを継続利用
- **影響範囲**:
  - 変更予定: `src/app/(private)/todo/_apis/todos.server.ts`（crudcrud.com → Route Handler経由に変更）
  - 新規追加: 
    - `src/app/api/todos/route.ts`（Route Handler）
    - `prisma/schema.prisma`（Prismaスキーマ）
    - `prisma/migrations/`（マイグレーション）
    - `docker-compose.yml`（PostgreSQL起動）
    - `.env.example`（環境変数テンプレート）
    - `src/lib/db.ts`（Prismaクライアント）

## 技術アプローチ (Best-of-N)

### 案 A: PostgreSQL + Prisma + Route Handler（推奨）
- **概要**: Docker ComposeでPostgreSQLを起動。PrismaでORM・マイグレーション管理。Route Handler（`src/app/api/todos/route.ts`）をBFFとして実装。`todos.server.ts`はRoute Handler経由でアクセス。
- **長所**: 
  - Next.js 15/16のベストプラクティス（Route Handler + Server Component）に完全準拠
  - Prismaの型安全性とマイグレーション管理が強力
  - `use cache`をRoute Handler層で活用可能（`fetchTodos`内で`use cache`を使用）
  - 既存のResult型・エラーハンドリングをそのまま維持
  - 本番環境（PostgreSQL）に近い開発環境
- **短所/リスク**: 
  - Docker環境が必要（開発者の環境依存）
  - Prismaの学習コスト（ただしNext.jsエコシステムで標準的）

### 案 B: PostgreSQL + Drizzle + Route Handler
- **概要**: Docker ComposeでPostgreSQLを起動。DrizzleでORM・マイグレーション管理。Route HandlerをBFFとして実装。
- **長所**: 
  - DrizzleはSQLに近い記述で柔軟性が高い
  - バンドルサイズが小さい
- **短所/リスク**: 
  - Prismaと比較してNext.jsエコシステムでの採用率が低い
  - マイグレーション管理がPrismaより手動寄り
  - 型安全性はPrismaと同等だが、開発者体験がやや劣る

### 案 C: PostgreSQL + 生SQL（pgライブラリ直接使用）
- **概要**: Docker ComposeでPostgreSQLを起動。`pg`ライブラリで直接SQLを実行。Route HandlerをBFFとして実装。
- **長所**: 
  - 依存が最小限
  - SQLを直接制御できる
- **短所/リスク**: 
  - 型安全性が低い（手動で型定義が必要）
  - マイグレーション管理が手動
  - エラーハンドリングが複雑
  - プロジェクトルール（保守性重視）に反する

## 選定理由
- **採用案**: 案A（PostgreSQL + Prisma + Route Handler）
- **根拠**: 
  - Next.js 15/16のベストプラクティスに完全準拠（Route Handler + Server Component + `use cache`）
  - PrismaはNext.jsエコシステムで標準的で、型安全性・マイグレーション管理が強力
  - 既存のResult型・エラーハンドリングをそのまま維持できる
  - 本番環境（PostgreSQL）に近い開発環境で、将来の拡張性が高い
  - プロジェクトルール（保守性・型安全性重視）に適合

## 実装詳細

### 1. データベース設計
- **スキーマ**: `todos`テーブル
  - `id`: UUID（主キー、自動生成）
  - `title`: VARCHAR(255)（NOT NULL）
  - `isDone`: BOOLEAN（NOT NULL、デフォルト: false）
  - `createdAt`: TIMESTAMP（NOT NULL、デフォルト: NOW()）
  - `updatedAt`: TIMESTAMP（NOT NULL、デフォルト: NOW()、自動更新）

### 2. アーキテクチャフロー
```
[Server Component] 
  → fetchTodos() (todos.server.ts)
    → use cache でキャッシュ
      → fetch('/api/todos') (Route Handler)
        → Prisma Client
          → PostgreSQL
```

### 3. Route Handler設計
- **エンドポイント**: `GET /api/todos`, `POST /api/todos`, `PUT /api/todos/[id]`
- **レスポンス**: Result型で統一（成功時: `{ isSuccess: true, data: Todo[] }`、失敗時: `{ isSuccess: false, errorMessage: string }`）
- **エラーハンドリング**: PrismaのエラーをResult型に変換

### 4. キャッシュ戦略
- `todos.server.ts`の`fetchTodos()`内で`use cache`を使用
- Route Handlerは`cache: 'no-store'`で常に最新データを取得
- Server Actions（`createTodo`, `toggleTodo`）で`updateTag('todos')`を呼び出し

### 5. 環境変数管理
- `.env.local`: `DATABASE_URL=postgresql://user:password@localhost:5432/todos_db`
- `.env.example`: テンプレートを提供
- `docker-compose.yml`: PostgreSQLの接続情報を定義

## TODO / 開発メモ

### データモデル
- Prismaスキーマ: `prisma/schema.prisma`に`Todo`モデルを定義
- マイグレーション: `npx prisma migrate dev --name init`で初期マイグレーション作成
- 型定義: Prismaが自動生成する`@prisma/client`の型を使用（`todos.server.ts`で型変換不要）

### UI変更点
- **変更なし**: 既存の`page.tsx`、`TodoClient.tsx`はそのまま動作
- `todos.server.ts`の内部実装のみ変更（外部インターフェースは維持）

### テスト観点
- **単体テスト**: Route Handlerの各エンドポイント（GET/POST/PUT）の正常系・異常系
- **統合テスト**: 
  - `docker compose up -d` → `npm run dev` → UIからCRUD操作が成功
  - `crudcrud.com`へのHTTPリクエストがコード上でゼロ（grep検索で確認）
- **マイグレーション**: 新規環境で`npx prisma migrate deploy`が成功

### リスク緩和策
- **Docker環境未整備**: READMEにDocker Desktopのインストール手順を記載
- **マイグレーション失敗**: `prisma migrate reset`でリセット可能な手順をREADMEに記載
- **接続エラー**: `.env.local`の`DATABASE_URL`が正しいか確認するエラーメッセージを表示
- **既存データの移行**: 本タスクでは対象外（新規環境での動作確認を優先）

## 参考リソース
- 既存実装: 
  - `src/app/(private)/todo/_apis/todos.server.ts`（crudcrud.comへの直接アクセス）
  - `src/app/(private)/todo/_actions/createTodo.ts`（Server Actions）
  - `src/lib/request.ts`（Result型でのエラーハンドリング）
- プロジェクトルール: 
  - `.cursor/rules/01-architecture.mdc`（App Router、コロケーション）
  - `.cursor/rules/03-data-fetching.mdc`（データ取得、`use cache`）
  - `.cursor/rules/04-data-update.mdc`（データ更新、`updateTag`）
  - `.cursor/rules/06-error-handling.mdc`（Result型でのエラーハンドリング）

## 依存関係
- **新規追加パッケージ**:
  - `@prisma/client`: Prismaクライアント
  - `prisma`: Prisma CLI（devDependencies）
- **Docker Compose**: PostgreSQL 15+ のイメージを使用
