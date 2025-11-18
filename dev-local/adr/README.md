# Architecture Decision Records (ADR)

このディレクトリには、プロジェクトで行われた重要なアーキテクチャ決定が記録されています。

## 目的

ADR（Architecture Decision Record）は、プロジェクトの開発過程で行われた重要な技術的決定を記録し、AI（Claude Code）とチーム間での知識共有を促進するためのものです。

### ADRの主な用途

- **決定の記録**: なぜその技術や設計パターンを選んだのか、代替案は何だったのかを記録
- **コンテキストの保存**: 決定時の制約、要件、問題点を記録
- **影響範囲の追跡**: 決定が影響するファイル、コンポーネント、パターンを記録
- **AI支援の強化**: 機械可読な形式でAIが過去の決定を参照し、一貫性のある提案が可能に

## フォーマット

ADRはJSON形式で記録され、以下の情報を含みます：

- **ID**: 一意の識別子（ADR-0001など）
- **タイトル**: 決定の簡潔な説明
- **ステータス**: proposed, accepted, deprecated, superseded
- **コンテキスト**: 問題、制約、要件
- **決定**: 選択した解決策と根拠
- **実装**: 影響を受けるファイル、コンポーネント、コード例
- **メタデータ**: タグ、関連ADR、検索キーワード

## ディレクトリ構造

```
dev-local/adr/
├── index.json              # マスターインデックス（検索用）
├── decisions/              # 個別のADRファイル
│   ├── 0001-decision-name.json
│   ├── 0002-another-decision.json
│   └── ...
└── README.md               # このファイル
```

## 使用方法

### ADRの作成

重要なアーキテクチャ決定を行った際は、`adr-memory-manager`エージェントを使用してADRを記録します：

```bash
# Claude Codeで以下のように依頼
"次の決定をADRとして記録してください：
- Server Componentsをデフォルトで使用する
- データフェッチはasync/awaitで行う
- Client Componentsは必要な場合のみ使用"
```

### ADRの検索

既存の決定を確認したい場合：

```bash
# 特定のタグで検索
"server-components に関するADRを確認してください"

# コンポーネント名で検索
"UserAuthコンポーネントに関連するADRを確認してください"

# セマンティック検索
"認証の実装方法に関する決定を確認してください"
```

### ADRの更新

決定が変更された場合：

```bash
# ステータスの更新
"ADR-0001をdeprecatedに更新してください"

# 新しい決定で置き換え
"ADR-0001を新しい決定で置き換えるADRを作成してください"
```

## 開発ワークフローとの連携

### Phase 1: Investigation（調査）

開発開始前に、関連するADRを確認して既存の決定を理解します：

```bash
# CLAUDE.mdのワークフローに従う
1. dev-local/adr/index.jsonを確認
2. 関連するADRファイルを読み込む
3. 実装方針を既存の決定と照合
```

### Phase 2: Architecture Design（設計）

重要な技術的決定を行った際は、ADRとして記録します：

```bash
# 新しいパターンの導入
# 技術スタックの選定
# データフローの設計
```

### Phase 5: Implementation（実装）

実装完了後、ADRに実装の詳細を追記します：

```bash
# 実際に使用したファイル
# コード例の追加
# パターンの具体化
```

### Phase 7: Code Review（レビュー）

リファクタリング後、ADRを更新して現状を反映します：

```bash
# パターンの変更
# 新しい決定の記録
# 古いADRのdeprecated化
```

## 重要なADR

プロジェクトの基礎となるADRは以下を参照してください：

- **ADR-0001**: プロジェクト構造とディレクトリ設計
- **ADR-0002**: 技術スタックの選定（Next.js 15, React 19など）
- **ADR-0003**: アーキテクチャパターン（Server Components, Presenter Patternなど）
- **ADR-0004**: ドメイン知識（コンポーネントレジストリ、Demo実装など）

## ADRのライフサイクル

1. **proposed**: 提案段階
2. **accepted**: 承認され実装中/実装済み
3. **deprecated**: 非推奨（より良い方法がある）
4. **superseded**: 別のADRに置き換えられた

## 注意事項

- **frontend-rules.mdとの違い**: frontend-rules.mdは包括的なガイドライン、ADRは個別の決定記録
- **機械可読性優先**: JSON形式でAIが効率的に読み取れるよう設計
- **継続的な更新**: プロジェクトの進化に合わせてADRを更新
- **検索キーワード**: 十分なキーワードとタグで検索可能性を確保

## 参考資料

- `CLAUDE.md`: 開発ワークフローの全体像
- `docs/frontend-rules.md`: プロジェクトの包括的なガイドライン
- `.claude/agents/adr-memory-manager.md`: ADR管理エージェントの詳細
