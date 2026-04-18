import { cache } from 'react';
import { createSupabaseServerComponentClient } from '@/lib/supabase/server';
import type { Intervention } from '@/types/intervention';

function mapInterventionRow(row: any): Intervention {
  const client = Array.isArray(row.clients) ? row.clients[0] : row.clients;
  const machine = Array.isArray(row.client_machines) ? row.client_machines[0] : row.client_machines;
  const machineType = Array.isArray(machine?.machine_types) ? machine.machine_types[0] : machine?.machine_types;
  const technician = Array.isArray(row.technician_profile) ? row.technician_profile[0] : row.technician_profile;

  return {
    id: row.id,
    clientId: row.client_id,
    clientName: client?.name ?? 'Client',
    machineId: row.machine_id ?? null,
    machineLabel: machineType?.label ?? null,
    technicianUserId: row.technician_user_id ?? null,
    technicianUserLabel: technician?.full_name ?? technician?.email ?? null,
    technicianName: row.technician_name ?? null,
    interventionDate: row.intervention_date,
    startTime: row.start_time,
    endTime: row.end_time,
    type: row.intervention_type,
    status: row.status,
    title: row.title,
    description: row.description,
    diagnosis: row.diagnosis ?? null,
    actionTaken: row.action_taken ?? null,
    photoPath: row.photo_path ?? null,
    notes: row.notes ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const getInterventions = cache(async (): Promise<Intervention[]> => {
  const supabase = await createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from('interventions')
    .select('*, clients(name), client_machines(id, machine_types(label)), technician_profile:profiles!interventions_technician_user_id_fkey(full_name, email)')
    .order('intervention_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data.map(mapInterventionRow);
});

export async function getInterventionFormOptions() {
  const supabase = await createSupabaseServerComponentClient();

  const [clientsRes, machinesRes, techniciansRes] = await Promise.all([
    supabase.from('clients').select('id, name').order('name', { ascending: true }),
    supabase
      .from('client_machines')
      .select('id, client_id, clients(name), machine_types(label)')
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name, email, is_active').eq('is_active', true).order('full_name', { ascending: true })
  ]);

  const clients = Array.isArray(clientsRes.data)
    ? clientsRes.data.map((item) => ({ id: item.id as string, name: item.name as string }))
    : [];

  const machines = Array.isArray(machinesRes.data)
    ? machinesRes.data.map((item) => {
        const client = Array.isArray(item.clients) ? item.clients[0] : item.clients;
        const machineType = Array.isArray(item.machine_types) ? item.machine_types[0] : item.machine_types;

        return {
          id: item.id as string,
          clientId: item.client_id as string,
          label: `${client?.name ?? 'Client'} — ${machineType?.label ?? 'Machine'}`
        };
      })
    : [];

  const technicians = Array.isArray(techniciansRes.data)
    ? techniciansRes.data.map((item) => ({
        id: item.id as string,
        label: (item.full_name as string | null) ?? (item.email as string)
      }))
    : [];

  return { clients, machines, technicians };
}
