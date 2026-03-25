import { PageContainer } from '@/components/layout/page-container';
import { PlaceholderState } from '@/components/ui/placeholder-state';
import { toggleClientCategory } from '@/features/settings/actions';
import { ClientCategoryForm } from '@/features/settings/components/client-category-form';
import { getClientCategories } from '@/features/settings/queries';
import { requireRole } from '@/lib/auth/guards';

export default async function ClientCategoriesPage() {
  await requireRole('manager');
  const categories = await getClientCategories();

  return (
    <PageContainer title="Catégories client">
      <div className="space-y-4">
        <ClientCategoryForm />
        {categories.length === 0 ? (
          <PlaceholderState message="Aucune catégorie client configurée." />
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2 rounded border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{category.label}</p>
                    <p className="text-xs text-slate-500">Code: {category.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-1 text-xs ${category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <form action={toggleClientCategory.bind(null, category)}>
                      <button className="rounded border border-slate-300 px-3 py-2 text-xs">{category.isActive ? 'Désactiver' : 'Activer'}</button>
                    </form>
                  </div>
                </div>
                <ClientCategoryForm category={category} />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
