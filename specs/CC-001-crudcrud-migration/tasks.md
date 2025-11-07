# CC-001 タスク一覧: TODO機能のCrudCrud移行

## ゴール
- CrudCrudをバックエンドとして使用するTODO機能を実装
- 1 タスク = 1 成果物に分解し、レビュー / テストしやすい状態にする
- プロジェクトルールに準拠した実装を維持

## タスク一覧

### Task 1: [環境設定] CrudCrudエンドポイドの設定
- **成果物**: `.env.local`
- **内容**: 
  - CrudCrudで新しいエンドポイドIDを取得
  - `.env.local` に `CRUDCRUD_ENDPOINT_ID` を追加
  - `.env.example` に環境変数の説明を追加（任意）
  - 環境変数が正しく読み込まれることを確認
- **DoD**:
  - [ ] CrudCrudのエンドポイドIDが取得済み
  - [ ] `.env.local` に `CRUDCRUD_ENDPOINT_ID` が設定済み
  - [ ] Next.jsのサーバー側で `process.env.CRUDCRUD_ENDPOINT_ID` が読み込める
  - [ ] `.gitignore` に `.env.local` が含まれている（既存確認）

### Task 2: [型定義] CrudCrud型と変換関数の実装
- **成果物**: `src/app/(private)/todo/_types/todo.ts`
- **内容**: 
  - CrudCrudのレスポンス型 `CrudCrudTodo` を定義
  - `_id` ⇔ `id` の変換関数 `mapFromCrudCrud` / `mapToCrudCrud` を実装
  - 既存の `Todo` 型は維持
  - TypeScriptの型安全性を確保
- **DoD**:
  - [ ] `CrudCrudTodo` 型が定義済み（`_id`, `title`, `isDone`）
  - [ ] `mapFromCrudCrud(crudcrudTodo: CrudCrudTodo): Todo` が実装済み
  - [ ] `mapToCrudCrud(todo: Partial<Todo>)` が実装済み
  - [ ] 型エラーがゼロ
  - [ ] Linter エラーがゼロ

### Task 3: [データ層] API層のCrudCrud統合実装
- **成果物**: `src/app/(private)/todo/_apis/todos.server.ts`
- **内容**: 
  - `fetchTodos()`: CrudCrudからGETリクエストで全TODO取得
  - `createTodoApi()`: CrudCrudへPOSTリクエストでTODO作成
  - `toggleTodoApi()`: CrudCrudへPUTリクエストでTODO更新
  - Data Cacheの設定（`next.tags`, `revalidate`）
  - Result型でのエラーハンドリング
  - 型変換関数の適用
- **依存**: Task 1, Task 2
- **DoD**:
  - [ ] `fetchTodos()` がCrudCrudのGETエンドポイントを呼び出している
  - [ ] Data Cacheが設定済み（`tags: ['todos']`, `revalidate: 3600`）
  - [ ] `createTodoApi()` がCrudCrudのPOSTエンドポイントを呼び出している
  - [ ] `toggleTodoApi()` がCrudCrudのPUTエンドポイントを呼び出している
  - [ ] 全関数でResult型を返している
  - [ ] `mapFromCrudCrud` / `mapToCrudCrud` が適切に使用されている
  - [ ] エラーハンドリングが実装済み
  - [ ] 型エラーがゼロ
  - [ ] Linter エラーがゼロ

### Task 4: [ロジック層] Server Actionsの修正
- **成果物**: 
  - `src/app/(private)/todo/_actions/createTodo.ts`
  - `src/app/(private)/todo/_actions/toggleTodo.ts`
- **内容**: 
  - `revalidateTag('todos', 'max')` を `revalidateTag('todos')` に修正
  - API層の新しい実装に対応
  - エラーハンドリングの確認
- **依存**: Task 3
- **DoD**:
  - [ ] `createTodo.ts` の `revalidateTag` 呼び出しが修正済み
  - [ ] `toggleTodo.ts` の `revalidateTag` 呼び出しが修正済み
  - [ ] 型エラーがゼロ
  - [ ] Linter エラーがゼロ
  - [ ] Server Actionsが正常に動作する（Task 6で確認）

### Task 5: [クリーンアップ] Route Handlerの削除
- **成果物**: 不要ファイルの削除
- **内容**: 
  - `src/app/api/todos/route.ts` を削除
  - `src/app/api/todos/[id]/route.ts` を削除
  - `src/app/api/todos/` ディレクトリ全体を削除
  - 削除後のビルドエラー確認
- **依存**: Task 3, Task 4
- **DoD**:
  - [ ] `src/app/api/todos/route.ts` が削除済み
  - [ ] `src/app/api/todos/[id]/route.ts` が削除済み
  - [ ] `src/app/api/todos/` ディレクトリが削除済み
  - [ ] ビルドが成功（`npm run build`）
  - [ ] 他のコードで削除したファイルへの参照がない

### Task 6: [テスト] 動作確認と統合テスト
- **成果物**: 動作確認済みの機能
- **内容**: 
  - TODO一覧の取得テスト
  - TODO作成テスト
  - TODO完了切り替えテスト
  - エラーハンドリングのテスト
  - Data Cache の動作確認
  - 楽観的更新（`useOptimistic`）の動作確認
  - CrudCrudのエンドポイントに直接アクセスしてデータ確認
  - ブラウザコンソールのエラー確認
- **依存**: Task 1-5すべて
- **DoD**:
  - [ ] ページが正常にレンダリングされる
  - [ ] TODO一覧が取得・表示される
  - [ ] 空の状態でも正常に動作する
  - [ ] TODOの作成が正常に動作する
  - [ ] 作成後、一覧が自動更新される
  - [ ] TODOの完了切り替えが正常に動作する
  - [ ] 楽観的更新が機能している
  - [ ] エラー時に適切なメッセージが表示される
  - [ ] Loading 状態が表示される
  - [ ] ブラウザコンソールにエラーがない
  - [ ] Data Cacheが機能している（2回目のアクセスが高速）
  - [ ] CrudCrudのエンドポイントでデータが確認できる
  - [ ] Build が成功（`npm run build`）
  - [ ] Linter エラーがゼロ（`npm run lint`）

## 全体のDoD（Definition of Done）

すべてのタスクが完了とみなされる条件：

- [ ] すべての個別タスクのDoDが完了
- [ ] コードがプロジェクトルールに準拠
- [ ] TypeScript の型エラーがゼロ
- [ ] Linter エラーがゼロ（`npm run lint`）
- [ ] Build が成功（`npm run build`）
- [ ] ローカルで全機能が動作確認済み
- [ ] エラーハンドリングが適切に実装
- [ ] CrudCrudとの統合が正常に動作
- [ ] Route Handlerが完全に削除
- [ ] モックデータが削除され、実際のAPIを使用

## 依存関係

```
Task 1 (環境設定)
  ↓
Task 2 (型定義)
  ↓
Task 3 (API層) → Task 4 (Server Actions) → Task 5 (Route Handler削除)
                                              ↓
                                          Task 6 (テスト)
```

- **並行可能**: Task 1 と Task 2 は独立して進められる
- **順次実行**: Task 3 → Task 4 → Task 5 → Task 6 の順に実行
- **Task 3が最も重要**: API層の実装が中核となる

## テスト戦略

### 統合テスト（手動）
1. **TODO一覧の取得**
   - 初回アクセス時にCrudCrudからデータを取得
   - 空の状態でも正常に表示
   - 2回目のアクセスでData Cacheが機能

2. **TODO作成**
   - フォームからTODOを作成
   - CrudCrudにPOSTリクエストが送信される
   - 作成後、一覧が自動更新（`revalidateTag`）
   - バリデーションエラーが表示

3. **TODO完了切り替え**
   - チェックボックスで完了/未完了を切り替え
   - CrudCrudにPUTリクエストが送信される
   - 楽観的更新が即座に反映
   - 更新後、Data Cacheが再検証

4. **エラーハンドリング**
   - ネットワークエラー時のエラーメッセージ
   - 無効なエンドポイドIDの場合のエラー
   - CrudCrudのAPI障害時の挙動

### 確認方法

#### ブラウザ開発者ツール
```
1. Network タブで以下を確認:
   - CrudCrudへのリクエストURL
   - レスポンスステータス
   - レスポンスボディ

2. Console タブで以下を確認:
   - エラーログがないこと
   - 警告がないこと
```

#### CrudCrudエンドポイドに直接アクセス
```bash
# 全TODO取得
curl https://crudcrud.com/api/{endpoint-id}/todos

# TODO作成（テスト）
curl -X POST https://crudcrud.com/api/{endpoint-id}/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test TODO","isDone":false}'
```

### テストコマンド
```bash
npm run lint          # Linter チェック
npm run build         # ビルドエラー確認
npm run dev           # ローカル動作確認
```

## 実装時の注意事項

### Task 1: 環境設定
- CrudCrudのエンドポイドIDは無料版だと24時間で失効するため、テスト時は注意
- 必要に応じて複数回取得する可能性がある

### Task 2: 型定義
- `_id` と `id` の変換を確実に行う
- 型定義は厳密にし、`any` は使用しない

### Task 3: API層
- `process.env.CRUDCRUD_ENDPOINT_ID` が `undefined` の場合のエラーハンドリング
- CrudCrudのエンドポイントURLは `https://crudcrud.com/api/{id}/todos` の形式
- `cache: 'no-store'` を作成・更新時に設定し、キャッシュしない

### Task 4: Server Actions
- `revalidateTag` の第2引数 `'max'` を削除（Next.js 15では不要）

### Task 5: Route Handler削除
- 削除前に他のコードで参照されていないか確認
- `src/app/api/todos/` ディレクトリごと削除

### Task 6: テスト
- 実際のCrudCrudエンドポイントを使用するため、データが永続化される
- テスト後、必要に応じてデータをクリーンアップ（DELETEリクエスト）

## メモ
- 各タスクは小さく独立しているため、段階的に実装可能
- Task 1, 2 は準備作業（5-10分）
- Task 3 が最も時間がかかる（30-60分）
- Task 4, 5 は軽微な修正（10-15分）
- Task 6 は動作確認とテスト（20-30分）
- **合計所要時間目安: 1.5-2時間**

## 次のステップ
タスクが承認されたら、以下のコマンドで実装を開始してください：

```bash
# Task 1 から順番に実装
/implement Task 1: 環境設定

# または全タスクを一括で実装
/implement CC-001 全タスク
```

