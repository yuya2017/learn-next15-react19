# CC-001 CRUDCRUDからローカルDBへの移行（仕様）\n
\n
## ゴール\n
- 現在 `crudcrud.com` を利用しているデータ永続化を、開発者のローカル環境上で動作するデータベースに置き換える\n
- Next.js のRoute Handler（`src/app/api/*`）をBFFとして維持しつつ、アプリからの全リクエストがローカルDBに向かう\n
- 開発者がセットアップコマンドを実行するだけでDBが起動し、CRUDが安定動作する状態\n
\n
## コンテキスト\n
- これまで `crudcrud.com` を簡易DB代替として使用していたが、API制限・スキーマ管理・データの永続性に課題がある\n
- ローカルでのオフライン開発、スキーマ変更の追跡、テストデータの再現性を高めたい\n
- 対象ユーザー/役割: 本リポジトリの開発者（学習・検証用途を含む）\n
- 利用シーン: ローカル開発時に `npm run dev` と最小のセットアップでDB込みで動作、Todo等のCRUDが可能\n
\n
## ユーザーストーリー\n
- As a 開発者, When ローカル環境でアプリを起動する, I want ローカルDBに自動接続してAPI経由でCRUDできる so that crudcrudへの依存が無く再現性の高い開発ができる。\n
- As a 開発者, When スキーマを変更する, I want マイグレーションで履歴管理できる so that チームでの変更追従やロールバックが容易になる。\n
\n
## 機能要件\n
- [ ] アプリのデータ永続化先を `crudcrud.com` からローカルDBに切り替える（既存のAPI呼び出し層から見たI/Fは維持）\n
- [ ] BFF（`src/app/api/*` のRoute Handler）がローカルDBと通信する\n
- [ ] DB初期化（スキーマ作成・初期データ投入）の手順（またはコマンド）が用意されている\n
- [ ] Todo等の代表的なリソースでCRUDが動作（Create/Read/Update/Toggle/Delete）\n
- [ ] 既存ルール（Result型でのエラーハンドリング、`apis/*.server.ts` からの呼び出し）を遵守\n
- [ ] `.env` で接続情報を管理し、秘匿情報をコードに含めない\n
\n
## 非機能要件\n
- **性能**: 開発用途として十分（ローカルでミリ秒〜数十ミリ秒台）。\n
- **信頼性**: セットアップ手順を踏めば安定して起動・再現可能。マイグレーションでスキーマ整合を担保。\n
- **セキュリティ**: ローカル開発前提。秘匿情報は `.env.local` 管理。外部公開を前提としない。\n
- **運用**: ワンコマンド（または2コマンド）でDB起動・初期化が完了。READMEに手順とトラブルシュートを記載。\n
\n
## 受け入れ基準（テスト観点）\n
- [ ] `crudcrud.com` へのHTTPリクエストが存在しない（コード検索でゼロ）\n
- [ ] `npm run dev` 実行後、アプリUIからTodoの新規作成→一覧反映→トグル→削除が成功する\n
- [ ] API直叩き（`/api/...`）でもCRUDが成功し、HTTPステータスとレスポンスが妥当\n
- [ ] 初期化手順に従って新しい開発環境でも同様のCRUDが再現可能\n
- [ ] 型とResult型ハンドリングが既存ルール（`types/result.ts`）に準拠\n
\n
## Best-of-N（アーキテクチャ案）\n
\n
### 案A（推奨）: SQLite + Prisma（またはDrizzle）をNext.js内で利用\n
- 概要: ローカルファイルベースのSQLiteを採用。ORM（Prisma推奨）でスキーマとマイグレーションを管理。Route HandlerからORM経由でCRUD。\n
- 長所:\n
  - 依存が少なくセットアップが容易（Docker不要）\n
  - 学習コストが低く、スキーマ変更→マイグレーションの流れが明瞭\n
  - CI不要のローカル学習プロジェクトに適合\n
- 短所:\n
  - マルチ開発者・同時編集に弱い（用途的に許容）\n
  - 将来的にクラウドRDBへ移行時は接続先切替と若干の差分対応が必要\n
\n
### 案B: Docker ComposeでPostgreSQLを起動しORMから接続\n
- 概要: `docker compose up -d` でPostgreSQLをローカル起動。ORM（Prisma/Drizzle）でスキーマ・マイグレーション管理。\n
- 長所:\n
  - 本番相当RDBに近い挙動で将来拡張しやすい\n
  - 複数開発者や別プロセスからの接続も安定\n
- 短所:\n
  - Docker前提の環境構築が必要で、学習目的ではやや重い\n
\n
→ 本リポジトリの学習/検証目的・簡便性を重視し、まずは **案A（SQLite + Prisma）** を採用することを推奨。\n
\n
## 曖昧さ・前提\n
- [NEEDS CLARIFICATION] 対象リソースの確定（現状Todo以外のモデル有無）\n
- [NEEDS CLARIFICATION] ORMの選定（Prisma vs Drizzle）。既存の学習方針やチーム好みに合わせて決定したい\n
- [NEEDS CLARIFICATION] 初期データの有無・スキーマ（Todoのフィールド: `id`, `title`, `completed`, `createdAt` など）\n
- [NEEDS CLARIFICATION] 将来的にDocker/PostgreSQLへ移行予定の有無（あれば設計で移行容易性を意識）\n
- 前提: ローカル開発のみを対象。本仕様では本番運用やセキュア公開は範囲外\n
\n

