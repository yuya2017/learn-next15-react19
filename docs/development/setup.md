# Development Setup

## 前提ツール

- Node.js 20 以上（Next.js 15/Tailwind 4 の推奨バージョン）
- npm 10 以上（`package-lock.json` をコミット対象にする）
- VS Code + Cursor / Codex Plugin
- Optional: `corepack enable` で pnpm/bun を利用する場合は README の手順に追記する

## 初期セットアップ

```bash
npm install
npm run dev
```

開発サーバーは `http://localhost:3000` で起動。Tailwind 4 は PostCSS 経由で処理されるため追加設定は不要。

## 推奨 VS Code 設定

- `editor.defaultFormatter`: `esbenp.prettier-vscode`（Prettier を利用する場合は別途設定）
- `editor.codeActionsOnSave`:
  - `"source.fixAll.eslint": "explicit"`
- Cursor の Codex モードを利用する場合は `.cursor/rules` が自動で読み込まれる

## テスト / ビルド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド。Stage 前に必ず実行しクラッシュがないか確認 |
| `npm run start` | 本番サーバー (build 済みアーティファクトを使用) |
| `npm run lint` | ESLint v9 Flat Config による静的解析 |

## 環境変数

現状 `.env` は不要。API 連携や外部サービス追加時は以下を徹底する。

1. `.env.example` を更新
2. `docs/development/workflow.md` にセットアップ手順を追記
3. `.cursor/rules/03-coding-standards.mdc` の制約に反映
