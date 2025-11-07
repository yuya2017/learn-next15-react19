# CC-001 技術計画: TODO機能のCrudCrud移行

## ゴール
- 現在モックデータを使用しているTODO機能を、CrudCrudをバックエンドとして実際に動作するようにする
- プロジェクトルールに準拠した実装を維持しながら、外部APIとの統合を実現する
- Route Handlerを削除し、API層から直接CrudCrudを呼び出すシンプルな構成にする

## 制約・前提

### CrudCrudの仕様
- エンドポイント: `https://crudcrud.com/api/{unique-endpoint-id}/{resource}`
- リソース名: `todos`（任意に設定可能）
- 自動生成フィールド: `_id`（CrudCrudが自動付与するID）
- サポート操作: POST（作成）、GET（取得）、PUT（更新）、DELETE（削除）
- データ形式: JSON
- 認証: 不要（エンドポイドIDが秘密鍵の役割）
- 有効期限: 24時間（無料版）または永続（有料版）

### 現在の実装構成
- **影響範囲**:
  - API層: `src/app/(private)/todo/_apis/todos.server.ts`（変更）
  - Actions層: `src/app/(private)/todo/_actions/createTodo.ts`（変更）
  - Actions層: `src/app/(private)/todo/_actions/toggleTodo.ts`（変更）
  - Route Handler: `src/app/api/todos/route.ts`（削除予定）
  - Route Handler: `src/app/api/todos/[id]/route.ts`（削除予定）
  - 型定義: `src/app/(private)/todo/_types/todo.ts`（変更）
  - 環境変数: `.env.local`（新規追加）

### プロジェクトルール
- Server Componentでのサーバーフェッチを優先
- Data Cacheを活用（`next.tags`と`revalidateTag`）
- エラーハンドリングはResult型を使用
- API層とActions層を分離

## 技術アプローチ (Best-of-N)

### 案 A: Route Handlerを残し、内部でCrudCrudを呼ぶ
- **概要**: 
  - 現在のRoute Handler（`/api/todos`）を残し、その内部でCrudCrudのAPIを呼び出す
  - フロントエンドから見たAPIインターフェースは変更なし
- **長所**: 
  - 既存のAPI層とActions層のコード変更が最小限
  - CrudCrudのエンドポイドIDをサーバー側のみで管理でき、セキュリティが高い
  - 将来的に別のバックエンドに移行しやすい（抽象化層として機能）
- **短所/リスク**: 
  - Route Handlerという余分なレイヤーが残る
  - Next.jsのEdge Runtimeとの互換性を考慮する必要がある
  - サーバー→Route Handler→CrudCrudという2段階のリクエストになり、レイテンシが増加
  - プロジェクトルール「Server Componentで直接外部APIをfetch」に反する

### 案 B: Route Handlerを削除し、API層から直接CrudCrudを呼ぶ（推奨）
- **概要**: 
  - Route Handlerを完全に削除
  - `todos.server.ts`のAPI関数内で直接CrudCrudのエンドポイントを呼び出す
  - Server ActionsはそのままAPI層を経由する構成を維持
- **長所**: 
  - プロジェクトルール「Server Componentで直接外部APIをfetch」に完全準拠
  - アーキテクチャがシンプルになる（不要なレイヤーを削除）
  - レイテンシが最小化される（直接外部APIを呼ぶ）
  - Data Cacheを活用しやすい
  - コード量が削減される
- **短所/リスク**: 
  - CrudCrudのエンドポイドIDを環境変数で管理する必要がある
  - CrudCrudの仕様変更の影響を直接受ける（ただしREST APIは安定）
  - 型定義の調整が必要（`id` → `_id`のマッピング）

### 案 C: クライアント側からCrudCrudを直接呼ぶ
- **概要**: 
  - TanStack QueryとRoute Handlerの組み合わせでクライアントフェッチに移行
  - Server ActionsもRoute Handler経由に変更
- **長所**: 
  - リアルタイム性の高いUI実装が可能
  - TanStack Queryのキャッシュ機能を活用できる
- **短所/リスク**: 
  - プロジェクトルール「Server Componentでのデータ取得を第一優先」に反する
  - CrudCrudのエンドポイドIDがクライアント側に露出する（セキュリティリスク）
  - 初回レンダリングのパフォーマンスが低下（クライアントフェッチのため）
  - 実装の大幅な変更が必要（コンポーネント構成の見直し）
  - TODO機能程度の要件にはオーバースペック

## 選定理由

**採用案: 案B（Route Handlerを削除し、API層から直接CrudCrudを呼ぶ）**

### 根拠
1. **プロジェクトルールへの準拠**: 
   - 「Server Componentで直接外部APIをfetch」という基本方針に完全に沿っている
   - API層とActions層の分離というアーキテクチャパターンを維持できる

2. **シンプルさとパフォーマンス**: 
   - 不要なRoute Handlerレイヤーを削除し、アーキテクチャがシンプルになる
   - サーバー→CrudCrudという直接的な通信でレイテンシが最小化される

3. **保守性**: 
   - コード量が削減され、理解しやすくなる
   - Data Cacheの活用がしやすく、パフォーマンス最適化が容易

4. **セキュリティ**: 
   - CrudCrudのエンドポイドIDを環境変数で管理すれば、クライアント側に露出しない
   - サーバーサイドでのみ機密情報を扱える

5. **スケーラビリティ**: 
   - 将来的にCrudCrudから別のバックエンド（Supabase、Firebase等）に移行する場合も、API層の関数のみを変更すれば良い
   - インターフェース（Result型、型定義）は維持できる

## 実装詳細

### 環境変数
`.env.local` に以下を追加:
```env
CRUDCRUD_ENDPOINT_ID=your-unique-endpoint-id
```

### 型定義の調整
CrudCrudは `_id` フィールドを使用するため、内部的に `_id` と `id` のマッピングを行う:

```typescript
// CrudCrudのレスポンス型
type CrudCrudTodo = {
  _id: string;
  title: string;
  isDone: boolean;
};

// アプリケーション内部で使用する型（既存）
export type Todo = {
  id: string;
  title: string;
  isDone: boolean;
};

// 変換関数
function mapFromCrudCrud(crudcrudTodo: CrudCrudTodo): Todo {
  return {
    id: crudcrudTodo._id,
    title: crudcrudTodo.title,
    isDone: crudcrudTodo.isDone,
  };
}

function mapToCrudCrud(todo: Partial<Todo>): Omit<Partial<CrudCrudTodo>, '_id'> {
  const { id, ...rest } = todo;
  return rest;
}
```

### API層の実装方針

#### fetchTodos()
```typescript
export async function fetchTodos(): Promise<Result<Todo[]>> {
  const endpoint = `https://crudcrud.com/api/${process.env.CRUDCRUD_ENDPOINT_ID}/todos`;
  
  const response = await request<CrudCrudTodo[]>(endpoint, {
    next: {
      tags: ['todos'],
      revalidate: 3600, // 1時間キャッシュ
    },
  });
  
  if (!response.isSuccess) {
    return failure(response.errorMessage);
  }
  
  const todos = response.data.map(mapFromCrudCrud);
  return success(todos);
}
```

#### createTodoApi()
```typescript
export async function createTodoApi(payload: { title: string }): Promise<Result<Todo>> {
  const endpoint = `https://crudcrud.com/api/${process.env.CRUDCRUD_ENDPOINT_ID}/todos`;
  
  const response = await request<CrudCrudTodo>(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: payload.title, isDone: false }),
    cache: 'no-store', // 作成処理はキャッシュしない
  });
  
  if (!response.isSuccess) {
    return failure(response.errorMessage);
  }
  
  const todo = mapFromCrudCrud(response.data);
  return success(todo);
}
```

#### toggleTodoApi()
```typescript
export async function toggleTodoApi(payload: {
  id: string;
  isDone: boolean;
  title: string;
}): Promise<Result<Todo>> {
  const endpoint = `https://crudcrud.com/api/${process.env.CRUDCRUD_ENDPOINT_ID}/todos/${payload.id}`;
  
  const response = await request<CrudCrudTodo>(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: payload.title, isDone: payload.isDone }),
    cache: 'no-store', // 更新処理はキャッシュしない
  });
  
  if (!response.isSuccess) {
    return failure(response.errorMessage);
  }
  
  const todo = mapFromCrudCrud(response.data);
  return success(todo);
}
```

### Server Actionsの変更
- 現在の `revalidateTag('todos', 'max')` を `revalidateTag('todos')` に修正
- その他の変更は不要（API層の実装が変わるだけで、インターフェースは同じ）

### 削除対象
- `src/app/api/todos/route.ts`
- `src/app/api/todos/[id]/route.ts`

## リスク分析と緩和策

### リスク1: CrudCrudのエンドポイドIDが24時間で失効する（無料版の場合）
- **影響**: 毎日エンドポイドIDを更新する必要がある
- **緩和策**: 
  - 環境変数で管理し、更新を容易にする
  - 必要に応じて有料版への移行を検討（永続エンドポイド）
  - 開発中は毎回新しいエンドポイドを生成する運用でも問題なし

### リスク2: CrudCrudのAPIレート制限
- **影響**: リクエストが過多になると制限される可能性
- **緩和策**: 
  - Data Cacheを適切に設定し、不要なリクエストを削減
  - `revalidate: 3600`（1時間）を設定し、キャッシュを活用

### リスク3: CrudCrudのサービス停止や障害
- **影響**: TODO機能が使用できなくなる
- **緩和策**: 
  - エラーハンドリングを適切に実装し、ユーザーフレンドリーなエラーメッセージを表示
  - 将来的に別のバックエンドに移行する場合も、API層のみの変更で対応可能

### リスク4: 型マッピングのバグ
- **影響**: `_id`と`id`の変換ミスによるデータ不整合
- **緩和策**: 
  - 変換関数を明確に定義し、一箇所に集約
  - 型定義を厳密にし、TypeScriptの型チェックを活用

## テスト戦略

### 動作確認項目
1. **TODO一覧の取得**
   - 初回アクセス時にCrudCrudからデータを取得できる
   - 空の状態でも正常に動作する
   - Data Cacheが適切に機能する

2. **TODO作成**
   - フォームからTODOを作成できる
   - CrudCrudに正しくPOSTリクエストが送信される
   - 作成後、`revalidateTag`により一覧が更新される
   - バリデーションエラーが適切に表示される

3. **TODO完了切り替え**
   - チェックボックスで完了/未完了を切り替えられる
   - CrudCrudに正しくPUTリクエストが送信される
   - 楽観的更新（`useOptimistic`）が正常に動作する
   - 更新後、`revalidateTag`により状態が同期される

4. **エラーハンドリング**
   - ネットワークエラー時に適切なエラーメッセージが表示される
   - CrudCrudのエンドポイドIDが無効な場合のエラーハンドリング
   - タイムアウト時の挙動

### 確認方法
- ブラウザの開発者ツールでネットワークタブを確認
- CrudCrudのエンドポイドに直接GETリクエストを送り、データを確認
- エラーケースを意図的に発生させて動作を検証

## 参考リソース
- CrudCrud公式: https://crudcrud.com
- プロジェクトルール: `.cursor/rules/01-architecture.mdc`, `.cursor/rules/03-data-fetching.mdc`
- 既存実装: `src/app/(private)/todo/`
- 共通ライブラリ: `src/lib/request.ts`, `src/lib/result.ts`

