'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * ナビゲーション項目の定義
 */
const navItems = [
  {
    href: '/todo',
    label: 'TODOプレイグラウンド',
    prefetch: true,
  },
  {
    href: '/todo-filter',
    label: 'TODOフィルタ・ソート',
    prefetch: true,
  },
  {
    href: '/todo-search',
    label: 'TODO検索',
    prefetch: true,
  },
  {
    href: '/articles',
    label: '記事アプリ',
    prefetch: true,
  },
];

/**
 * サイドバーコンポーネント
 * 各TODOページへのナビゲーションを提供する
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-6">
      <nav className="space-y-1">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">ナビゲーション</h2>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={item.prefetch}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-slate-100 font-medium text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
