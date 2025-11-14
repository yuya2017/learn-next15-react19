# Specs フォルダの使い方

このフォルダは、開発ワークフローで作成する仕様書・計画書・タスクリストを管理します。

## フォルダ構造

```
specs/
  templates/        # テンプレートファイル
    spec.md         # 機能仕様書テンプレート
    plan.md         # 技術計画書テンプレート
    tasks.md        # タスクリストテンプレート
  [feature-name]/   # 機能ごとのフォルダ（例: user-auth, dashboard-ui）
    spec.md         # 機能仕様書
    plan.md         # 技術計画書
    tasks.md        # タスクリスト
  README.md         # このファイル
```

## ファイルの役割

### 1. spec.md (機能仕様書)
- **目的**: 機能要件とユーザーストーリーを定義
- **作成タイミング**: Phase 2 (Architecture Design) または Phase 3 (UI/UX Design)
- **内容**:
  - ゴールと成功指標
  - ユーザーストーリー
  - 機能要件・非機能要件
  - 受け入れ基準

### 2. plan.md (技術計画書)
- **目的**: 技術的なアプローチと実装方針を定義
- **作成タイミング**: Phase 2 (Architecture Design)
- **内容**:
  - 技術的な制約と前提
  - 複数の技術アプローチ（Best-of-N）
  - 選定理由と根拠
  - データモデル・UI変更点・テスト観点

### 3. tasks.md (タスクリスト)
- **目的**: タスク分解とDoD（Definition of Done）を定義
- **作成タイミング**: Phase 4 (Planning)
- **内容**:
  - タスク一覧（1タスク = 1成果物）
  - DoD（完了条件）
  - 依存関係とブロッカー
  - テスト戦略

## 使用方法

### 新しい機能を開発する場合

1. **Phase 2: Architecture Design**
   ```bash
   mkdir -p specs/[feature-name]
   cp specs/templates/spec.md specs/[feature-name]/spec.md
   cp specs/templates/plan.md specs/[feature-name]/plan.md
   ```
   - `spec.md` に機能仕様を記述
   - `plan.md` に技術計画を記述

2. **Phase 3: UI/UX Design** (UI変更がある場合)
   - `spec.md` にUI仕様を追加

3. **Phase 4: Planning**
   ```bash
   cp specs/templates/tasks.md specs/[feature-name]/tasks.md
   ```
   - `tasks.md` にタスクリストを記述

### 既存機能の修正・リファクタリングの場合

- 必要に応じて該当する仕様書のみ作成
- 小規模な修正の場合は省略可能

## テンプレートのカスタマイズ

プロジェクトの特性に応じて、`templates/` 内のファイルをカスタマイズしてください。

## ADRとの関係

- **specs/**: 個別の機能や実装の詳細を記録
- **docs/adr/**: プロジェクト全体のアーキテクチャ決定を記録

重要な設計判断は ADR として記録し、specs/ には具体的な実装計画を記載します。
