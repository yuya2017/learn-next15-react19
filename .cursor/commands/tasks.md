# /tasks コマンド

## 目的
Phase 3: Tasks — 実装を小さく独立したタスクに分解し、DoD（完了定義）を明確にします。

## 前提条件
- `specs/<ticket-id>-<slug>/spec.md` と `plan.md` が作成済み
- 技術アプローチが決定済み

## 実行内容
1. 実装を「1タスク = 1成果物」に分解
2. 各タスクにDoD（Definition of Done）を付与
3. タスク間の依存関係を明確化
4. テスト戦略を定義

## 成果物
`specs/<ticket-id>-<slug>/tasks.md` を以下の構造で作成してください：

```markdown
# [チケットID] タスク一覧

## ゴール
- 1 タスク = 1 成果物に分解し、レビュー / テストしやすい状態にする

## タスク一覧

### Task 1: [データ層] API クライアント実装
- **成果物**: `src/apis/xxx.server.ts`
- **内容**: 
  - fetchXXX 関数を実装
  - Result型でエラーハンドリング
  - Data Cacheの設定（tags, revalidate）

### Task 2: [ロジック層] Server Actions 実装
- **成果物**: `src/actions/xxx.ts`
- **内容**: 
  - createXXX / updateXXX アクション実装
  - revalidateTag による再検証
  - バリデーション追加

### Task 3: [UI層] Server Component 実装
- **成果物**: `src/app/.../page.tsx`
- **内容**: 
  - データ取得とエラーハンドリング
  - Suspense でのストリーミング対応
  - loading.tsx の追加

### Task 4: [UI層] Client Component 実装
- **成果物**: `src/app/.../_components/XXXForm.tsx`
- **内容**: 
  - フォーム UI の実装
  - useTransition でのローディング状態管理
  - Server Actions の呼び出し

### Task 5: [テスト] 動作確認とリファクタリング
- **成果物**: 動作確認済みの機能
- **内容**: 
  - 受け入れ基準の確認
  - Linter / Build エラーの解消
  - パフォーマンスチェック

## DoD（Definition of Done）

各タスクが完了とみなされる条件：

- [ ] コードが実装され、プロジェクトルールに準拠
- [ ] Linter エラーがゼロ（`npm run lint`）
- [ ] Build が成功（`npm run build`）
- [ ] ローカルで動作確認済み
- [ ] エラーハンドリングが適切に実装
- [ ] 必要なコメント/ドキュメントが追加
- [ ] 該当する受け入れ基準を満たす

## 依存関係

```
Task 1 (API Client)
  ↓
Task 2 (Server Actions) ← Task 3 (Server Component)
  ↓                          ↓
Task 4 (Client Component) ←──┘
  ↓
Task 5 (テスト)
```

- Task 1 → Task 2: APIクライアントが必要
- Task 2, 3 → Task 4: データ取得とアクションが必要
- 並行可能: Task 3 と Task 2 は独立して進められる

## テスト戦略

### 単体テスト
- Result型の正常/異常系テスト
- ユーティリティ関数の検証

### 統合テスト
- Server Actions の呼び出しフロー
- データ取得 → 表示 → 更新のサイクル

### 手動テスト
- ブラウザでの動作確認
- 受け入れ基準の項目チェック
- エッジケース（エラー時の挙動）

### テストコマンド
```bash
npm run lint          # Linter チェック
npm run build         # ビルドエラー確認
npm run dev           # ローカル動作確認
```

## メモ
- 各タスクはできるだけ小さく独立させる
- 1タスクの実装時間目安: 30分〜2時間
- 大きすぎる場合はさらに分割を検討
```

## 注意事項
- タスクは「レイヤー単位」で分割（データ層 → ロジック層 → UI層）
- 各タスクが独立してテスト・レビューできるように
- DoD を明確にし、完了条件を曖昧にしない

## 次のステップ
タスクが承認されたら、`/implement [task-id]` で実装を開始してください。
実装前に `/quickstart` で開発環境のセットアップを確認することを推奨します。

