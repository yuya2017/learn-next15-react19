# Specs Workspace

`specs/` 配下はタスク単位の成果物を保存する場所です。`/specify`, `/plan`, `/tasks`, `/implement`, `/knowledge` の各フェーズで生成されるドキュメントを格納します。

## 命名規則

- ディレクトリ: `specs/<ticket-id>-<short-slug>/`
  - 例: `specs/FD-1234-add-dashboard/`
- ファイル:
  - `spec.md` – フェーズ 1 の仕様定義
  - `plan.md` – フェーズ 2 の技術計画
  - `tasks.md` – フェーズ 3 のタスク分解
  - `quickstart.md` – 初期セットアップや実装開始時のメモ（任意）

## 運用フロー

1. ブランチ作成時に `specs/<ticket-id>-<slug>/` を作成
2. Codex に `/specify` `/plan` `/tasks` を依頼し、生成結果を保存
3. 実装後に `/knowledge` を実行し、差分があれば `docs/` へ反映
4. 完了後は PR にディレクトリへのリンクを記載

## テンプレート

- `_templates/` にフェーズ別テンプレートを用意。必要に応じてカスタマイズして使用する
