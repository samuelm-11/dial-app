import { PageContainer } from '@/components/layout/page-container';
import { toggleMachineCategory } from '@/features/machines/actions';
import { MachineCategoryForm } from '@/features/machines/components/machine-category-form';
import { getMachineCategories } from '@/features/machines/queries';

export default async function MachineCategoriesPage() {
  const categories = await getMachineCategories();

  return (
    <PageContainer title="Catégories machine">
      <div className="space-y-4">
        <MachineCategoryForm />
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded border border-slate-200 p-3">
              <div>
                <p className="text-sm font-medium">{category.label}</p>
                <p className="text-xs text-slate-500">Code: {category.code}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-1 text-xs ${category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
                <form action={toggleMachineCategory.bind(null, category)}>
                  <button className="rounded border border-slate-300 px-3 py-2 text-xs">
                    {category.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
