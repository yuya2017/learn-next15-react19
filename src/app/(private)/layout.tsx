export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl py-10">{children}</main>
    </div>
  );
}
