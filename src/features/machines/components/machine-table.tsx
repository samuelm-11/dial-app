'use client';

import { Button } from '@/components/ui/button';
import { StatePanel } from '@/components/ui/state-panel';
import { TableShell } from '@/components/ui/table-shell';
import { formatDate, machineStatusLabels } from '@/features/machines/helpers';
import type { ClientMachine } from '@/types/machine';

export function MachineTable({
  machines,
  onEdit,
  onRemove,
  onChangeFilter
}: {
  machines: ClientMachine[];
  onEdit: (machine: ClientMachine) => void;
  onRemove: (machine: ClientMachine) => void;
  onChangeFilter: (machine: ClientMachine) => void;
}) {
  if (!machines.length) {
    return <StatePanel message="Aucune machine enregistrée." variant="empty" />;
  }

  return (
    <TableShell>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left text-xs uppercase text-slate-600">
          <tr>
            <th className="px-3 py-2">Catégorie</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Quantité</th>
            <th className="px-3 py-2">Date installation</th>
            <th className="px-3 py-2">Statut</th>
            <th className="px-3 py-2">Dernier changement filtre</th>
            <th className="px-3 py-2">Prochain changement filtre</th>
            <th className="px-3 py-2">Notes</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.id} className="border-t border-slate-200 align-top">
              <td className="px-3 py-2">{machine.machineCategoryLabel}</td>
              <td className="px-3 py-2">{machine.machineTypeLabel}</td>
              <td className="px-3 py-2">{machine.quantity}</td>
              <td className="px-3 py-2">{formatDate(machine.installationDate)}</td>
              <td className="px-3 py-2">{machineStatusLabels[machine.status]}</td>
              <td className="px-3 py-2">{formatDate(machine.lastFilterChangeDate)}</td>
              <td className="px-3 py-2">{formatDate(machine.nextFilterChangeDate)}</td>
              <td className="px-3 py-2 text-slate-600">{machine.notes || '—'}</td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => onEdit(machine)}>
                    Modifier
                  </Button>
                  <Button size="sm" onClick={() => onChangeFilter(machine)}>
                    Changer filtre
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onRemove(machine)}>
                    Retirer
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
