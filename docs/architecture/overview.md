# Architecture Overview

## Stack Summary

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **UI Runtime**: React 19 (Server Components + Client Components混在)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss` 経由で適用)
- **Build / Bundler**: Next.js Turbopack

## Runtime Topology

```
Browser ─┬─► Next.js Server (Edge / Node runtime)
         └─► Static Assets (`public/`, compiled CSS/JS)
```

- `src/app/layout.tsx` にアプリケーション全体の HTML スケルトンを定義
- `src/app/page.tsx` はサンプルのトップページ。Server Component なのでデータ取得や SEO 設定を兼ねる
- `public/` 配下のアセットは `next/image` を通じて最適化される

## 重要ディレクトリ

| Path | Purpose |
|------|---------|
| `src/app` | App Router エントリポイント。`page.tsx`/`layout.tsx` を中心にルーティングが構成される |
| `src/app/globals.css` | Tailwind 4 のベーススタイル。必要に応じてカスタムユーティリティを追加する |
| `next.config.ts` | Next.js の挙動を制御。環境変数やイメージドメイン設定を追加する場合はここを編集 |
| `eslint.config.mjs` | ESLint v9 Flat Config。ルールを更新する場合は影響範囲を `docs/development/coding_standards/frontend.md` に反映 |

## 依存パッケージ

| Category | Packages |
|----------|----------|
| Runtime | `next@^15`, `react@19.2.0`, `react-dom@19.2.0` |
| Tooling | `typescript`, `eslint`, `eslint-config-next` |
| Styling | `tailwindcss@^4`, `@tailwindcss/postcss` |

## AI 連携時の注意

1. App Router はファイルシステムベース。新規ページは `src/app/{route}/page.tsx` を追加する
2. Tailwind 4 は `@apply` 非推奨。ユーティリティクラスで構築し、必要ならグローバル CSS に抽象化する
3. Server Actions や Edge Runtime を利用する場合は `next.config.ts` の設定差分を併せて更新する
