# CC-001 タスク一覧: CRUDCRUDからローカルPostgreSQLへの移行

## ゴール
- 1タスク = 1成果物に分解し、レビュー/テストしやすい状態にする
- Prisma + PostgreSQL + Route Handlerで段階的に移行を実現

## タスク一覧

### Task 1: [インフラ] Docker Compose + PostgreSQL セットアップ
- **成果物**: `docker-compose.yml`, `.env.example`
- **内容**: 
  - PostgreSQL 15+ のDocker Compose設定を作成
  - データベース名、ユーザー、パスワードを定義
  - `.env.example`に`DATABASE_URL`のテンプレートを追加
  - `docker compose up -d`でPostgreSQLが起動することを確認
- **DoD**:
  - [ ] `docker-compose.yml`が作成され、`docker compose up -d`でPostgreSQLが起動
  - [ ] `.env.example`に`DATABASE_URL`のテンプレートが記載されている
  - [ ] `docker compose ps`でPostgreSQLコンテナが`running`状態であることを確認
  - [ ] `docker compose logs`でエラーが発生していないことを確認

### Task 2: [データ層] Prisma セットアップとスキーマ定義
- **成果物**: `prisma/schema.prisma`, `package.json`（Prisma依存関係追加）
- **内容**: 
  - `@prisma/client`と`prisma`をインストール
  - `prisma/schema.prisma`に`Todo`モデルを定義（`id`, `title`, `isDone`, `createdAt`, `updatedAt`）
  - `DATABASE_URL`を環境変数から読み込む設定
  - 初期マイグレーションを作成（`npx prisma migrate dev --name init`）
- **DoD**:
  - [ ] `package.json`に`@prisma/client`と`prisma`（devDependencies）が追加されている
  - [ ] `prisma/schema.prisma`に`Todo`モデルが正しく定義されている
  - [ ] `npx prisma migrate dev --name init`が成功し、`prisma/migrations/`にマイグレーションファイルが生成される
  - [ ] `npx prisma studio`でPostgreSQLに`todos`テーブルが作成されていることを確認
  - [ ] Linterエラーがゼロ（`npm run lint`）

### Task 3: [データ層] Prismaクライアントの作成
- **成果物**: `src/lib/db.ts`
- **内容**: 
  - Prismaクライアントのシングルトンインスタンスを作成
  - Next.jsの開発環境でのホットリロード対応（Prisma Clientの再生成を防ぐ）
  - 型エクスポート（`PrismaClient`型を必要に応じて）
- **DoD**:
  - [ ] `src/lib/db.ts`が作成され、Prismaクライアントのシングルトンインスタンスが実装されている
  - [ ] 開発環境でのホットリロード時にPrisma Clientが再生成されない実装になっている
  - [ ] `import { db } from '@/lib/db'`でインポート可能
  - [ ] Linterエラーがゼロ（`npm run lint`）

### Task 4: [API層] Route Handler実装（GET /api/todos）
- **成果物**: `src/app/api/todos/route.ts`（GETメソッド）
- **内容**: 
  - `GET /api/todos`エンドポイントを実装
  - Prismaクライアントで`todos`テーブルから全件取得
  - Result型でレスポンスを返す（成功時: `{ isSuccess: true, data: Todo[] }`、失敗時: `{ isSuccess: false, errorMessage: string }`）
  - PrismaのエラーをResult型に変換
- **DoD**:
  - [ ] `GET /api/todos`でTodo一覧が取得できる
  - [ ] レスポンスがResult型で統一されている
  - [ ] エラー時（DB接続エラーなど）に適切なエラーメッセージが返される
  - [ ] `curl http://localhost:3000/api/todos`で動作確認済み
  - [ ] Linterエラーがゼロ（`npm run lint`）

### Task 5: [API層] Route Handler実装（POST /api/todos）
- **成果物**: `src/app/api/todos/route.ts`（POSTメソッド）
- **内容**: 
  - `POST /api/todos`エンドポイントを実装
  - リクエストボディから`title`を取得し、バリデーション（空文字チェック）
  - Prismaクライアントで`todos`テーブルに新規作成（`isDone: false`をデフォルト）
  - Result型でレスポンスを返す（成功時: `{ isSuccess: true, data: Todo }`）
- **DoD**:
  - [ ] `POST /api/todos`でTodoが作成できる
  - [ ] 空文字の`title`でリクエストした場合、適切なエラーメッセージが返される
  - [ ] レスポンスがResult型で統一されている
  - [ ] `curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title":"test"}'`で動作確認済み
  - [ ] Linterエラーがゼロ（`npm run lint`）

### Task 6: [API層] Route Handler実装（PUT /api/todos/[id]）
- **成果物**: `src/app/api/todos/[id]/route.ts`（PUTメソッド）
- **内容**: 
  - `PUT /api/todos/[id]`エンドポイントを実装
  - パスパラメータから`id`を取得
  - リクエストボディから`title`と`isDone`を取得
  - Prismaクライアントで`todos`テーブルを更新
  - 存在しない`id`の場合は適切なエラーメッセージを返す
  - Result型でレスポンスを返す（成功時: `{ isSuccess: true, data: Todo }`）
- **DoD**:
  - [ ] `PUT /api/todos/[id]`でTodoが更新できる
  - [ ] 存在しない`id`でリクエストした場合、適切なエラーメッセージが返される
  - [ ] レスポンスがResult型で統一されている
  - [ ] `curl -X PUT http://localhost:3000/api/todos/{id} -H "Content-Type: application/json" -d '{"title":"updated","isDone":true}'`で動作確認済み
  - [ ] Linterエラーがゼロ（`npm run lint`）

### Task 7: [API層] todos.server.tsの修正（Route Handler経由に変更）
- **成果物**: `src/app/(private)/todo/_apis/todos.server.ts`
- **内容**: 
  - `getCrudCrudBaseUrl()`関数を削除
  - `fetchTodos()`を修正: `crudcrud.com`への直接アクセス → `/api/todos`へのfetchに変更
  - `createTodoApi()`を修正: `crudcrud.com`への直接アクセス → `/api/todos`へのfetchに変更
  - `toggleTodoApi()`を修正: `crudcrud.com`への直接アクセス → `/api/todos/[id]`へのfetchに変更
  - `use cache`の設定を維持（`cacheTag('todos')`, `cacheLife('minutes')`）
  - `mapFromCrudCrud`と`mapToCrudCrud`の変換ロジックを削除（Prismaの型をそのまま使用）
  - `CrudCrudTodo`型を削除（不要になる）
- **DoD**:
  - [ ] `crudcrud.com`へのHTTPリクエストがコード上でゼロ（`grep -r "crudcrud" src/`で確認）
  - [ ] `fetchTodos()`, `createTodoApi()`, `toggleTodoApi()`がRoute Handler経由で動作する
  - [ ] `use cache`の設定が維持されている
  - [ ] 既存のServer Actions（`createTodo.ts`, `toggleTodo.ts`）がそのまま動作する
  - [ ] Linterエラーがゼロ（`npm run lint`）
  - [ ] Buildが成功（`npm run build`）

### Task 8: [型定義] Todo型の整理
- **成果物**: `src/app/(private)/todo/_types/todo.ts`
- **内容**: 
  - `CrudCrudTodo`型を削除
  - `mapFromCrudCrud`と`mapToCrudCrud`関数を削除
  - `Todo`型はそのまま維持（Prismaの型と互換性を確認）
  - 必要に応じてPrismaの型から`Todo`型への変換関数を追加
- **DoD**:
  - [ ] `CrudCrudTodo`型と変換関数が削除されている
  - [ ] `Todo`型がPrismaの型と互換性があることを確認
  - [ ] 型エラーが発生していない
  - [ ] Linterエラーがゼロ（`npm run lint`）

### Task 9: [ドキュメント] READMEと環境変数の更新
- **成果物**: `README.md`（セットアップ手順追加）, `.env.local`のテンプレート更新
- **内容**: 
  - READMEにDocker Compose + PostgreSQLのセットアップ手順を追加
  - Prismaのマイグレーション手順を記載
  - トラブルシューティング（接続エラー、マイグレーション失敗など）を記載
  - `.env.local`の設定例を追加
- **DoD**:
  - [ ] READMEにセットアップ手順が記載されている
  - [ ] `docker compose up -d` → `npx prisma migrate dev` → `npm run dev`の流れが明確
  - [ ] トラブルシューティングが記載されている
  - [ ] `.env.example`が更新されている

### Task 10: [テスト] 統合テストと動作確認
- **成果物**: 動作確認済みの機能
- **内容**: 
  - UIからTodoのCRUD操作が成功することを確認
  - `crudcrud.com`へのHTTPリクエストがゼロであることを確認（コード検索）
  - API直叩きでCRUDが成功することを確認
  - エラーハンドリング（存在しないID、空文字など）が適切に動作することを確認
  - `use cache`と`updateTag`によるキャッシュ更新が動作することを確認
- **DoD**:
  - [ ] UIからTodoの新規作成→一覧反映→トグル→削除が成功
  - [ ] `grep -r "crudcrud" src/`で検索結果がゼロ
  - [ ] `curl`コマンドで各APIエンドポイントが正常に動作
  - [ ] エラーハンドリングが適切に動作（存在しないID、空文字など）
  - [ ] `use cache`と`updateTag`によるキャッシュ更新が動作（作成・更新後に即座に反映）
  - [ ] Linterエラーがゼロ（`npm run lint`）
  - [ ] Buildが成功（`npm run build`）
  - [ ] 受け入れ基準をすべて満たしている

## DoD（Definition of Done）

各タスクが完了とみなされる条件：

- [ ] コードが実装され、プロジェクトルールに準拠
- [ ] Linterエラーがゼロ（`npm run lint`）
- [ ] Buildが成功（`npm run build`）（該当タスクのみ）
- [ ] ローカルで動作確認済み（該当タスクのみ）
- [ ] エラーハンドリングが適切に実装（該当タスクのみ）
- [ ] 必要なコメント/ドキュメントが追加
- [ ] 該当する受け入れ基準を満たす

## 依存関係

```
Task 1 (Docker Compose)
  ↓
Task 2 (Prisma セットアップ)
  ↓
Task 3 (Prismaクライアント)
  ↓
Task 4 (GET Route Handler)
  ↓
Task 5 (POST Route Handler) ──┐
  ↓                            │
Task 6 (PUT Route Handler) ────┼──→ Task 7 (todos.server.ts修正)
  ↓                            │
Task 8 (型定義整理) ────────────┘
  ↓
Task 9 (README更新)
  ↓
Task 10 (統合テスト)
```

- **Task 1 → Task 2**: Docker ComposeでPostgreSQLが起動している必要がある
- **Task 2 → Task 3**: Prismaスキーマが定義されている必要がある
- **Task 3 → Task 4, 5, 6**: Prismaクライアントが利用可能である必要がある
- **Task 4, 5, 6 → Task 7**: Route Handlerが実装されている必要がある
- **Task 7 → Task 8**: `todos.server.ts`の修正後に型定義を整理
- **Task 1-9 → Task 10**: すべての実装が完了してから統合テスト

## テスト戦略

### 単体テスト
- Route Handlerの各エンドポイント（GET/POST/PUT）の正常系・異常系
- Prismaクライアントの接続確認
- Result型のエラーハンドリング

### 統合テスト
- `docker compose up -d` → `npx prisma migrate dev` → `npm run dev` → UIからCRUD操作が成功
- `crudcrud.com`へのHTTPリクエストがコード上でゼロ（`grep -r "crudcrud" src/`）
- API直叩き（`curl`）でCRUDが成功
- `use cache`と`updateTag`によるキャッシュ更新が動作

### 手動テスト
- ブラウザでの動作確認（Todoの作成→一覧反映→トグル→削除）
- エッジケース（存在しないID、空文字、DB接続エラーなど）
- 受け入れ基準の項目チェック

### テストコマンド
```bash
# Docker Compose起動
docker compose up -d

# Prismaマイグレーション
npx prisma migrate dev

# Linterチェック
npm run lint

# ビルドエラー確認
npm run build

# ローカル動作確認
npm run dev

# crudcrud.comへの参照確認
grep -r "crudcrud" src/

# API動作確認
curl http://localhost:3000/api/todos
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title":"test"}'
curl -X PUT http://localhost:3000/api/todos/{id} -H "Content-Type: application/json" -d '{"title":"updated","isDone":true}'
```

## メモ
- 各タスクはできるだけ小さく独立させる
- 1タスクの実装時間目安: 30分〜2時間
- Task 7は既存の`todos.server.ts`を大幅に変更するため、慎重に実装
- Task 10では受け入れ基準をすべて満たすことを確認
- Prismaの型生成は`npx prisma generate`で実行（`prisma migrate dev`でも自動実行される）
