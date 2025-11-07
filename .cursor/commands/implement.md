# /implement コマンド

## 目的
Phase 4: Implement — タスク単位で実装を行い、テスト・動作確認を完了させます。

## 前提条件
- `specs/<ticket-id>-<slug>/spec.md`, `plan.md`, `tasks.md` が作成済み
- 実装するタスクが決定済み
- 開発ブランチが作成済み

## 実行内容
1. 指定されたタスクの実装を行う
2. プロジェクトルール（`.cursor/rules/`）に準拠した実装
3. Linter / Build エラーの解消
4. ローカルでの動作確認
5. 実装内容の要約とテスト結果をまとめる

## 使用方法

```
/implement Task 1: API クライアント実装
```

または、タスクIDを指定：

```
/implement task-1
```

## 実装の進め方

### 1. タスク内容の確認
- `specs/<ticket-id>-<slug>/tasks.md` から該当タスクの詳細を確認
- 成果物、実装内容、DoDを把握

### 2. 実装
以下のプロジェクトルールを遵守して実装してください：

#### アーキテクチャ（`.cursor/rules/01-architecture.mdc`）
- Feature ベースの構成（コロケーション）
- ルートレイアウトで動的APIを使用しない
- APIクライアントはサーバー用とクライアント用で分離

#### コンポーネント設計（`.cursor/rules/02-components.mdc`）
- `page.tsx` は同期かつサーバーコンポーネント
- Server Component で直接外部APIをfetch
- Client Component は必要最小限に
- default export で統一

#### データ取得（`.cursor/rules/03-data-fetching.mdc`）
- Server Component で直接外部APIをfetch（第一優先）
- クライアントフェッチは TanStack Query + Route Handler
- データフェッチコロケーション（必要な場所で取得）

#### データ更新（`.cursor/rules/04-data-mutation.mdc`）
- 更新は必ず Server Actions を経由
- Result型でエラーハンドリング
- revalidateTag でキャッシュを再検証

#### 状態管理（`.cursor/rules/05-state-management.mdc`）
- リモートデータはサーバーフェッチ or TanStack Query
- ローカルステートは useState / useReducer
- グローバルステートは極力使用しない

#### キャッシュ戦略（`.cursor/rules/06-caching.mdc`）
- Data Cache を積極的に使用
- revalidateTag で細かく再検証
- すべてのfetchに `next.tags` を付与

#### エラーハンドリング（`.cursor/rules/07-error-handling.mdc`）
- 想定済みエラーは Result型で返す（throwしない）
- コンポーネントで部分的にエラーUIを表示
- エラー内容をサーバー側で正規化

### 3. テスト

#### Linter チェック
```bash
npm run lint
```

#### ビルドチェック
```bash
npm run build
```

#### ローカル動作確認
```bash
npm run dev
```

以下を確認：
- [ ] ページが正常にレンダリングされる
- [ ] データが正しく表示される
- [ ] CRUD操作が正常に動作する
- [ ] エラー時に適切なメッセージが表示される
- [ ] Loading 状態が表示される
- [ ] ブラウザコンソールにエラーがない

### 4. DoD の確認

`tasks.md` に記載された DoD をすべてクリアしていることを確認：

- [ ] コードが実装され、プロジェクトルールに準拠
- [ ] Linter エラーがゼロ
- [ ] Build が成功
- [ ] ローカルで動作確認済み
- [ ] エラーハンドリングが適切に実装
- [ ] 必要なコメント/ドキュメントが追加
- [ ] 該当する受け入れ基準を満たす

## 成果物

実装完了後、以下の情報をまとめてください：

### 実装内容の要約

```markdown
## Task [N]: [タスク名]

### 実装したファイル
- 新規作成: `src/...`
- 変更: `src/...`

### 実装内容
- [実装した内容1]
- [実装した内容2]
- [実装した内容3]

### テスト結果
- ✅ Linter: エラーなし
- ✅ Build: 成功
- ✅ 動作確認: 正常

### スクリーンショット（必要に応じて）
[動作確認のスクリーンショット]

### 備考
- [特記事項や課題]
```

## 実装時の注意事項

### ファイル命名規則
- `app` 配下のルーティングディレクトリ: ケバブケース（`user-profile/`）
- コンポーネントファイル: アッパーキャメルケース（`UserProfile.tsx`）
- その他のファイル: キャメルケース（`fetchUser.ts`）

### コロケーション
- 画面・機能固有のファイルは `page.tsx` と同階層に配置
- 複数箇所で使用するファイルは `app` と同階層に配置

### Server vs Client Component
- 基本は Server Component
- インタラクション、ブラウザAPI、React Hooks が必要な場合のみ Client Component
- Client Component には `'use client'` を明記

### エラーハンドリング
- サーバーフェッチは Result型を返す
- Server Actions も Result型を返す
- クライアントフェッチはエラーをthrowし、useQuery の error に委任

### キャッシュ設定
- Data Cache を使用する場合は `next.tags` と `revalidate` を設定
- Server Actions での更新後は `revalidateTag` で再検証

## トラブルシューティング

### 型エラーが発生する
```bash
# TypeScript の型チェック
npx tsc --noEmit
```

### キャッシュの問題
```bash
# .next ディレクトリを削除
rm -rf .next
npm run dev
```

### 環境変数が反映されない
- `.env.local` を確認
- サーバーを再起動
