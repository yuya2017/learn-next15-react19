import Sidebar from '@/app/(private)/_components/Sidebar';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 py-10">{children}</main>
    </div>
  );
}
