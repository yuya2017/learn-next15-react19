# Development Workflow

## 標準フロー (SDD ベース)

1. **Phase 1: Specify** – `/specify` コマンドを使ってユーザーストーリーと受け入れ基準を明文化する  
   - 成果物: `specs/<ticket-id>/spec.md`
2. **Phase 2: Plan** – `/plan` で技術的な分解、依存関係、デザイン方針を整理  
   - 成果物: `specs/<ticket-id>/plan.md`
3. **Phase 3: Tasks** – `/tasks` で DoD を付与したタスク一覧を作成  
   - 成果物: `specs/<ticket-id>/tasks.md`
4. **Phase 4: Implement** – タスクごとにブランチを切り、実装 → テスト → PR  
   - 成果物: コードと `docs/` 差分、PR 説明
5. **Phase 5: Knowledge** – `/knowledge` で学びを `docs/knowledge` に追加し、再利用可能な形にする  
   - 成果物: `docs/knowledge/<yyyy-mm-dd>-<topic>.md`

## ブランチ運用

- `main`: デプロイ可能な状態を維持
- `feature/*`: タスク単位。Codex で実装する場合は `/implement` 指示にブランチ名を明記
- `chore/*`: 依存更新や設定変更

## PR Checklist

- [ ] Lint / Build をローカルで通過
- [ ] `specs/<ticket-id>` のドキュメント更新を含む
- [ ] 影響があった `docs/` ファイルの更新
- [ ] スクリーンショットや GIF（UI 変更時）

## レビュー観点

1. 仕様: `/specify` の受け入れ基準を満たしているか
2. 実装: Next.js 15 / React 19 のベストプラクティスに沿っているか
3. テスト: lint/build に加え、影響範囲に応じたテストの有無
4. ナレッジ: 再発防止のための知見が `docs/knowledge` に追加されているか
