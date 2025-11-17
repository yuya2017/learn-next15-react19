import TodoRedirectButton from '@/components/TodoRedirectButton';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-8 dark:from-black dark:via-zinc-900 dark:to-black">
      <main className="w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 dark:border-zinc-800 dark:bg-zinc-900/80">
        <header className="space-y-2 text-center text-zinc-600 dark:text-zinc-300 sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Next.js 15の検証
          </p>
          <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">
            `redirect` と `permanentRedirect` を使い分ける
          </h1>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            サーバーアクションやサーバーコンポーネントでは `redirect`
            系を返すことでページ遷移を即時実行できます。 ここでは Todo
            プレイグラウンドに遷移する２つのアクションを押し分けて、HTTPステータスやキャッシュの違いを体感してください。
          </p>
        </header>
        <div className="mt-8">
          <TodoRedirectButton />
        </div>
      </main>
    </div>
  );
}
