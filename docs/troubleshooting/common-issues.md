# Common Issues

## `error - No config file found and no output filename configured`

- Tailwind v4 の PostCSS プラグインが読み込まれていない場合に発生
- `postcss.config.mjs` に `import tailwindcss from "tailwindcss";` があるか確認
- 依存更新後に発生した場合は `node_modules` を削除し再インストールする

## `Image Optimization using Next.js default loader is not compatible with \`next export\``

- 画像最適化は Node/Edge ランタイムを必要とする。`next export` は未サポート
- `next.config.ts` の `images.unoptimized = true` を設定するか、ホスティングを Vercel などに合わせる

## Tailwind クラスが反映されない

- `src/app/globals.css` に `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` が揃っているか
- クラス名はビルド時に解析される。動的クラスは `clsx` などで静的な文字列を組み合わせる

## ESLint が `Parsing error: Cannot find module '@typescript-eslint/parser'`

- VS Code の ESLint 拡張がローカルインストールを参照できていないケース
- `npm install` 後に VS Code を再起動、もしくは `npm exec eslint src --print-config` で正しく解決できるか確認
