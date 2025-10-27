# AGENTS.md — Codex運用ガイド

このドキュメントは Codex / Cursor を用いた Spec-Driven Development (SDD) を標準化するための指針です。目的は次の 2 点です。

1. **Prompt ガイド** – プロジェクト固有の前提・制約を共有し、Codex が意図した実装を行えるようにする
2. **進め方ガイド** – 依頼から仕様化・計画・実装・ナレッジ更新までのフローを統一する

Codex で作業する際は以下のフェーズを順番に進め、必要に応じてユーザーへ確認を求めてください。Phase 1 と Phase 2 は *Best-of-N*（複数案生成）を推奨します。

---

## フェーズ概要

### Phase 1: Specify — 仕様定義（ユーザ価値に集中）
- コマンド: `/specify [feature or ticket id]`
- 成果物: `specs/<ticket-id>-<slug>/spec.md`
- 必須出力:
  - ユーザーストーリー（As / When / Then）
  - 機能要件・非機能要件
  - 受け入れ基準（テスト観点）
  - 曖昧さ・前提 (`[NEEDS CLARIFICATION]` マーカー付き)
- **Best-of-N**: 少なくとも 2 案を比較し、採用案を明示

### Phase 2: Plan — 技術計画（アーキテクチャ・依存整理）
- コマンド: `/plan [...]`
- 成果物: `specs/<ticket-id>-<slug>/plan.md`
- 必須出力:
  - システム影響範囲
  - 技術案の比較と選定理由（Best-of-N）
  - 変更するファイル/ディレクトリの見積もり
  - リスクと緩和策

### Phase 3: Tasks — タスク分解（小さく独立・テスト可能に）
- コマンド: `/tasks`
- 成果物: `specs/<ticket-id>-<slug>/tasks.md`
- 必須出力:
  - 1 タスク = 1 成果物
  - DoD (Definition of Done) をタスクごとに明記
  - 依存関係・テスト戦略

### Phase 4: Implement — 実装（タスク単位で実行）
- コマンド: `/implement [task-id or description]`
- 実施内容:
  - 触るファイルと完成条件を指示に含める
  - 実装後は PR 下書きを生成し、差分の要約とテスト結果を記載
  - `docs/` の該当箇所が最新化されているか確認

### Phase 5: Knowledge — ナレッジ更新（再利用できる形に）
- コマンド: `/knowledge [summary or highlights]`
- 成果物:
  - `docs/knowledge/<yyyy-mm-dd>-<topic>.md`
  - `.cursor/rules` に影響する変更は同じ PR で更新
- 必須出力:
  - 背景 / 対応内容 / 再発防止策
  - 関連 PR・Issue のリンク

---

## リポジトリ前提・不変条件 (Invariants)

- 主要ディレクトリ:
  - アプリケーション: `src/app`
  - グローバルスタイル: `src/app/globals.css`
  - ナレッジベース: `docs/`
  - 仕様・タスク: `specs/`
- Next.js 15 + React 19 を利用。Server Components を優先し、クライアント状態が必要な場合のみ `"use client"` を付与
- Tailwind CSS v4 を使用。ユーティリティクラス重視で `@apply` を多用しない
- TypeScript 厳格モード。`any` や未使用変数は禁止（ESLint で検出）
- 生成物は必ず `npm run lint` と `npm run build` で検証

---

## コマンドテンプレート

```text
/specify FD-1234 ユーザープロファイル編集
/plan FD-1234
/tasks FD-1234
/implement FD-1234 Task 2: フォームバリデーション追加
/knowledge FD-1234 フォーム改善の学び
```

`specs/` 配下のテンプレートは `specs/_templates/` を参照してください。

---

## 確認フロー

Codex は次のフェーズへ進む前にユーザーへレビューを促し、「確認不要」と明示されていない限り自動で進行しないでください。特に Phase 1-3 の成果物は人間がレビューした上で実装に入ります。

---

## 参考リソース

- `.cursor/rules/` – Codex が常に読み込み、行動指針として利用するメタデータ
- `docs/README.md` – ナレッジベースのメンテナンスガイド
- `docs/development/workflow.md` – フローの詳細と PR チェックリスト

このガイドを基準に、チーム全体で同じ品質と速度で Codex を活用できる状態を維持します。
