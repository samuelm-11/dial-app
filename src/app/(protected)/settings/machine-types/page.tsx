import { PageContainer } from '@/components/layout/page-container';
import { toggleMachineType } from '@/features/machines/actions';
import { MachineTypeForm } from '@/features/machines/components/machine-type-form';
import { getMachineCategories, getMachineTypes } from '@/features/machines/queries';

export default async function MachineTypesPage() {
  const [types, categories] = await Promise.all([getMachineTypes(), getMachineCategories()]);

  return (
    <PageContainer title="Types machine">
      <div className="space-y-4">
        <MachineTypeForm categories={categories} />
        <div className="space-y-2">
          {types.map((type) => (
            <div key={type.id} className="space-y-2 rounded border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{type.label}</p>
                  <p className="text-xs text-slate-500">Code: {type.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs ${type.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {type.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <form action={toggleMachineType.bind(null, type)}>
                    <button className="rounded border border-slate-300 px-3 py-2 text-xs">{type.isActive ? 'Désactiver' : 'Activer'}</button>
                  </form>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Changement filtre: {type.requiresFilterChange ? 'Oui' : 'Non'}
                {type.filterLifespanDays ? ` · Durée ${type.filterLifespanDays} jours` : ''}
              </p>
              <MachineTypeForm machineType={type} categories={categories} />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
