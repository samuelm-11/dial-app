export function PageContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
      <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-4 lg:p-5">{children}</div>
    </section>
  );
}
