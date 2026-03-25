export function PageContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="rounded-lg border bg-white p-5 shadow-sm">{children}</div>
    </section>
  );
}
