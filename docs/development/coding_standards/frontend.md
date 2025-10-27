# Frontend Coding Standards

## General

- TypeScript をデフォルト利用。`any` の使用は禁止（例外は型定義が提供されない外部ライブラリのみ）
- React 19 の Server Components を優先。クライアント状態が必要な場合のみ `"use client"` を宣言
- `next/image` を利用し、`Image` コンポーネントには `alt` を必須とする
- コンポーネントは `src/app/(segment)/components/` に配置し、UI ロジックとデータ取得を分離

## Tailwind CSS

- Tailwind 4 のユーティリティクラスを活用し、`@apply` での複雑な合成は避ける
- カラー/タイポグラフィのトークンは `globals.css` に CSS 変数として定義
- レスポンシブは `sm/md/lg/xl` ブレークポイントを使用。カスタムは `tailwind.config.ts` を追加する際にドキュメント化する

## ESLint / Formatting

- `npm run lint` で Flat Config を実行。ルール変更時はこのファイルと `.cursor/rules/03-coding-standards.mdc` を同期
- Prettier を導入する場合は `devDependencies` と `package.json` の `format` スクリプトを追加し、このドキュメントを更新

## Accessibility

- インタラクティブ要素には `role` や `aria-*` 属性を適切に設定
- フォーム要素は `label` と組み合わせ、タブ操作でのフォーカスを保証する
- コントラスト比は 4.5:1 以上を目標とする。Tailwind カラー設定で調整

## Testing

- UI 回帰は Storybook or Playwright 導入を検討中。導入時にここへルールを追記
- Hooks やユーティリティは Vitest/Jest 導入後に単体テストを記述。導入までは `npm run lint` のみ必須
