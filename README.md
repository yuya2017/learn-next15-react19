This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 前提条件

- Node.js 18以上
- Docker Desktop（PostgreSQLを使用するため）

### セットアップ手順

1. **依存関係のインストール**

```bash
npm install
```

2. **PostgreSQLの起動**

```bash
docker compose up -d
```

PostgreSQLコンテナが起動していることを確認：

```bash
docker compose ps
```

3. **環境変数の設定**

`.env.local`ファイルを作成し、以下の内容を設定：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todos_db?schema=public"
```

4. **Prismaマイグレーションの実行**

```bash
npx prisma migrate dev
```

これにより、データベーススキーマが作成されます。

5. **開発サーバーの起動**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## データベース管理

### Prisma Studio（データベースGUI）

データベースの内容を確認・編集する場合：

```bash
npx prisma studio
```

ブラウザで [http://localhost:5555](http://localhost:5555) が開きます。

### マイグレーション

スキーマを変更した場合：

```bash
npx prisma migrate dev --name <migration-name>
```

### データベースのリセット

データベースをリセットしたい場合：

```bash
npx prisma migrate reset
```

**注意**: このコマンドはすべてのデータを削除します。

## トラブルシューティング

### PostgreSQLに接続できない

1. Dockerコンテナが起動しているか確認：

```bash
docker compose ps
```

2. コンテナが起動していない場合：

```bash
docker compose up -d
```

3. ログを確認：

```bash
docker compose logs postgres
```

### マイグレーションエラー

1. データベースをリセット：

```bash
npx prisma migrate reset
```

2. 再度マイグレーションを実行：

```bash
npx prisma migrate dev
```

### 環境変数が反映されない

1. `.env.local`ファイルが正しく作成されているか確認
2. 開発サーバーを再起動：

```bash
# サーバーを停止（Ctrl+C）してから
npm run dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
