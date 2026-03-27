export function PageContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 px-1 py-1 sm:space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="text-sm text-slate-500">Pilotage opérationnel Dial Services</p>
      </div>
      <div className="rounded-2xl border border-muted bg-white p-4 shadow-card sm:p-5 lg:p-6">{children}</div>
    </section>
  );
}
