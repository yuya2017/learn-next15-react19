import { permanentRedirect, redirect } from 'next/navigation';

async function handleTemporaryTodoRedirect() {
  'use server';
  redirect('/todo');
}

async function handlePermanentTodoRedirect() {
  'use server';
  permanentRedirect('/todo');
}

export default function TodoRedirectButton() {
  return (
    <section className="w-full max-w-2xl space-y-6 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-blue-500/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-8">
      <div className="space-y-2 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          Redirectの比較
        </p>
        <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
          `redirect` / `permanentRedirect`
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          buttonを押すとどちらも{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">/todo</span>{' '}
          に遷移しますが、 HTTPステータスやブラウザ・検索エンジンへの伝え方が異なります。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form
          action={handleTemporaryTodoRedirect}
          method="post"
          className="flex flex-1 flex-col justify-between rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-700 dark:bg-zinc-800/60"
        >
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              `redirect`（臨時）
            </p>
            <p>
              HTTPステータス 307（POSTからのリダイレクトは 307 / 303
              になり、リクエストメソッドが維持されます）
            </p>
            <p>
              ブラウザやキャッシュは再リクエストを続けることを前提にし、検索エンジンにも「一時的な変更」と伝えます。
            </p>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            redirect（307 / 303）
          </button>
        </form>

        <form
          action={handlePermanentTodoRedirect}
          method="post"
          className="flex flex-1 flex-col justify-between rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-700 dark:bg-zinc-800/60"
        >
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              `permanentRedirect`（恒久）
            </p>
            <p>
              HTTPステータス 308
              を返し、クライアントと検索エンジンに「リソースは恒久的に移動した」と伝えます。
            </p>
            <p>
              今後のリクエストで元のURLがキャッシュされたり、SEO的に新 URL
              に置き換えられたりする想定です。
            </p>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            permanentRedirect（308）
          </button>
        </form>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        `redirect` も `permanentRedirect`
        もサーバー側で即時にリダイレクトレスポンスを返すので、クライアント側での履歴操作や
        `router.push`
        とは挙動が異なります。どちらのステータスコードが要件に合うかを確認してください。
      </p>
    </section>
  );
}
