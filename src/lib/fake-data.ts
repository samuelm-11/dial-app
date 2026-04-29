import type { Alert } from '@/types/alert';
import type { Client } from '@/types/client';
import type { Contract } from '@/types/contract';
import type { Intervention } from '@/types/intervention';
import type { ClientMachine, MachineCategory, MachineType } from '@/types/machine';
import type { Opportunity } from '@/types/opportunity';

const now = '2026-04-29T08:00:00.000Z';

export const demoMachineCategories: MachineCategory[] = [
  { id: 'cat-hot', code: 'boisson_chaude', label: 'Boisson chaude', isActive: true, createdAt: now, updatedAt: now },
  { id: 'cat-snack', code: 'snacking', label: 'Snacking', isActive: true, createdAt: now, updatedAt: now },
  { id: 'cat-cold', code: 'boisson_froide', label: 'Boisson froide', isActive: true, createdAt: now, updatedAt: now }
];

export const demoMachineTypes: MachineType[] = [
  { id: 'type-coffee', machineCategoryId: 'cat-hot', code: 'cafe_grain', label: 'Café grain', requiresFilterChange: true, filterLifespanDays: 90, isActive: true, createdAt: now, updatedAt: now },
  { id: 'type-snack', machineCategoryId: 'cat-snack', code: 'snacks_mixte', label: 'Snacks mixte', requiresFilterChange: false, filterLifespanDays: null, isActive: true, createdAt: now, updatedAt: now },
  { id: 'type-cold', machineCategoryId: 'cat-cold', code: 'boissons_froides', label: 'Boissons froides', requiresFilterChange: false, filterLifespanDays: null, isActive: true, createdAt: now, updatedAt: now }
];

export const demoClients: Client[] = [
  { id: 'cli-1', name: 'Ateliers Mécaniques de Liège', parentClientId: null, category: 'enterprise', flag: 'vip', address: 'Rue des Vennes 210', postalCode: '4020', city: 'Liège', country: 'Belgique', installationDate: '2024-03-12', improvementNotes: null, internalNotes: 'Site industriel principal.', hasContract: true, openOpportunities: 1, openAlerts: 1, createdAt: now, updatedAt: now },
  { id: 'cli-1a', name: 'AML - Entrepôt Herstal', parentClientId: 'cli-1', category: 'enterprise', flag: 'none', address: 'Avenue de l’Industrie 11', postalCode: '4040', city: 'Herstal', country: 'Belgique', installationDate: '2024-04-02', improvementNotes: null, internalNotes: null, hasContract: true, openOpportunities: 0, openAlerts: 1, createdAt: now, updatedAt: now },
  { id: 'cli-2', name: 'LogiWallonie', parentClientId: null, category: 'enterprise', flag: 'watch', address: 'Rue de l’Aéroport 8', postalCode: '4460', city: 'Grâce-Hollogne', country: 'Belgique', installationDate: '2023-11-20', improvementNotes: null, internalNotes: null, hasContract: true, openOpportunities: 1, openAlerts: 1, createdAt: now, updatedAt: now },
  { id: 'cli-3', name: 'Tour Finance Liège', parentClientId: null, category: 'sme', flag: 'none', address: 'Boulevard d’Avroy 52', postalCode: '4000', city: 'Liège', country: 'Belgique', installationDate: '2025-01-10', improvementNotes: null, internalNotes: null, hasContract: true, openOpportunities: 0, openAlerts: 0, createdAt: now, updatedAt: now },
  { id: 'cli-4', name: 'CHC Site Seraing', parentClientId: null, category: 'public', flag: 'none', address: 'Rue Laplace 40', postalCode: '4100', city: 'Seraing', country: 'Belgique', installationDate: '2024-06-01', improvementNotes: null, internalNotes: null, hasContract: true, openOpportunities: 0, openAlerts: 1, createdAt: now, updatedAt: now },
  { id: 'cli-5', name: 'Gare Liège-Guillemins', parentClientId: null, category: 'public', flag: 'risk', address: 'Place des Guillemins 2', postalCode: '4000', city: 'Liège', country: 'Belgique', installationDate: '2022-09-01', improvementNotes: null, internalNotes: null, hasContract: true, openOpportunities: 1, openAlerts: 1, createdAt: now, updatedAt: now },
  { id: 'cli-6', name: 'Bierset Cargo Center', parentClientId: null, category: 'enterprise', flag: 'none', address: 'Rue de l’Aviation 99', postalCode: '4460', city: 'Bierset', country: 'Belgique', installationDate: '2025-03-03', improvementNotes: null, internalNotes: null, hasContract: false, openOpportunities: 1, openAlerts: 0, createdAt: now, updatedAt: now },
  { id: 'cli-7', name: 'ImmoAns Services', parentClientId: null, category: 'sme', flag: 'none', address: 'Rue Walthère Jamar 14', postalCode: '4430', city: 'Ans', country: 'Belgique', installationDate: '2023-05-15', improvementNotes: null, internalNotes: null, hasContract: true, openOpportunities: 0, openAlerts: 0, createdAt: now, updatedAt: now },
  { id: 'cli-8', name: 'TecnoSteel Seraing', parentClientId: null, category: 'enterprise', flag: 'watch', address: 'Quai Vercour 118', postalCode: '4101', city: 'Seraing', country: 'Belgique', installationDate: '2022-12-09', improvementNotes: null, internalNotes: null, hasContract: true, openOpportunities: 1, openAlerts: 1, createdAt: now, updatedAt: now }
];

export const demoContracts: Contract[] = demoClients.filter((c) => c.hasContract).map((c, i) => ({ id: `ctr-${i+1}`, clientId: c.id, clientName: c.name, title: `Contrat distribution ${c.name}`, startDate: '2024-01-01', endDate: ['2026-05-15','2026-08-30','2027-01-31','2026-06-10','2026-05-20','2027-03-31','2026-12-31','2026-07-15'][i], privatePdfPath: i % 3 === 0 ? null : `contracts/${c.id}.pdf`, autoRenewal: i % 2 === 0, notes: null, createdAt: now, updatedAt: now, clientPostalCode: c.postalCode, clientCity: c.city, clientCategory: c.category, clientFlag: c.flag }));

export const demoOpportunities: Opportunity[] = [
  { id:'opp-1', clientId:'cli-2', clientName:'LogiWallonie', title:'Extension zone chauffeurs', description:'Ajouter 1 combo snacks + froid.', linkedMachineCategoryId:'cat-snack', linkedMachineCategoryLabel:'Snacking', priority:'high', status:'qualified', estimatedValue:12000, probability:65, yearlyRevenue:18000, employeeCount:220, totalMachineCount:4, machineCountsByCategory:{snacking:2,boisson_froide:2}, incumbentCompetitorName:'QuickVend', incumbentCompetitorCategory:'snacking', competitorContractEndDate:'2026-11-30', notes:null, clientPostalCode:'4460', clientFlag:'watch', createdAt:now, updatedAt:now },
  { id:'opp-2', clientId:'cli-6', clientName:'Bierset Cargo Center', title:'Premier équipement pause', description:'Prospection initiale sans contrat actif.', linkedMachineCategoryId:'cat-hot', linkedMachineCategoryLabel:'Boisson chaude', priority:'medium', status:'open', estimatedValue:8000, probability:40, yearlyRevenue:null, employeeCount:90, totalMachineCount:2, machineCountsByCategory:{boisson_chaude:2}, incumbentCompetitorName:null, incumbentCompetitorCategory:null, competitorContractEndDate:null, notes:'RDV avec Nicolas Delvaux le 2026-05-08.', clientPostalCode:'4460', clientFlag:null, createdAt:now, updatedAt:now }
];

export const demoAlerts: Alert[] = [
  { id:'alt-1', type:'contract_end', status:'open', title:'Contrat se termine bientôt', description:'Contrat AML échéance proche.', clientId:'cli-1', clientName:'Ateliers Mécaniques de Liège', clientPostalCode:'4020', machineId:null, machineTypeLabel:null, machineTypeCode:null, contractId:'ctr-1', contractTitle:'Contrat distribution Ateliers Mécaniques de Liège', dueDate:'2026-05-15', daysRemaining:16, dueBucket:'upcoming', createdAt:now, updatedAt:now },
  { id:'alt-2', type:'filter_change', status:'open', title:'Maintenance filtre café', description:'Filtre à remplacer sur AML Herstal.', clientId:'cli-1a', clientName:'AML - Entrepôt Herstal', clientPostalCode:'4040', machineId:'m-2', machineTypeLabel:'Café grain', machineTypeCode:'cafe_grain', contractId:null, contractTitle:null, dueDate:'2026-05-02', daysRemaining:3, dueBucket:'urgent', createdAt:now, updatedAt:now }
];

export const demoClientMachines: ClientMachine[] = [
  { id:'m-1', clientId:'cli-1', machineTypeId:'type-coffee', machineTypeLabel:'Café grain', machineCategoryId:'cat-hot', machineCategoryLabel:'Boisson chaude', quantity:2, installationDate:'2024-03-14', status:'active', lastFilterChangeDate:'2026-02-01', nextFilterChangeDate:'2026-05-01', notes:null, createdAt:now, updatedAt:now },
  { id:'m-2', clientId:'cli-1a', machineTypeId:'type-coffee', machineTypeLabel:'Café grain', machineCategoryId:'cat-hot', machineCategoryLabel:'Boisson chaude', quantity:1, installationDate:'2024-04-04', status:'active', lastFilterChangeDate:'2026-01-30', nextFilterChangeDate:'2026-05-02', notes:null, createdAt:now, updatedAt:now },
  { id:'m-3', clientId:'cli-5', machineTypeId:'type-snack', machineTypeLabel:'Snacks mixte', machineCategoryId:'cat-snack', machineCategoryLabel:'Snacking', quantity:3, installationDate:'2022-09-03', status:'active', lastFilterChangeDate:null, nextFilterChangeDate:null, notes:null, createdAt:now, updatedAt:now },
  { id:'m-4', clientId:'cli-2', machineTypeId:'type-cold', machineTypeLabel:'Boissons froides', machineCategoryId:'cat-cold', machineCategoryLabel:'Boisson froide', quantity:2, installationDate:'2023-11-25', status:'maintenance', lastFilterChangeDate:null, nextFilterChangeDate:null, notes:'Porte à régler.', createdAt:now, updatedAt:now }
];

export const demoInterventions: Intervention[] = [
  { id:'int-1', clientId:'cli-2', clientName:'LogiWallonie', machineId:'m-4', machineLabel:'Boissons froides', technicianUserId:null, technicianUserLabel:'Thomas Leroy', technicianName:'Thomas Leroy', interventionDate:'2026-04-28', startTime:'08:30', endTime:'10:00', type:'depannage', status:'done', title:'Panne groupe froid', description:'Température instable.', diagnosis:'Ventilation encrassée', actionTaken:'Nettoyage + test', photoPath:null, notes:null, createdAt:now, updatedAt:now },
  { id:'int-2', clientId:'cli-1a', clientName:'AML - Entrepôt Herstal', machineId:'m-2', machineLabel:'Café grain', technicianUserId:null, technicianUserLabel:'Julien Simon', technicianName:'Julien Simon', interventionDate:'2026-05-02', startTime:'07:45', endTime:null, type:'maintenance', status:'planned', title:'Changement filtre trimestriel', description:'Visite planifiée.', diagnosis:null, actionTaken:null, photoPath:null, notes:null, createdAt:now, updatedAt:now }
];

export const seedFakeData = () => ({ clients: demoClients, contracts: demoContracts, alerts: demoAlerts, opportunities: demoOpportunities, machineCategories: demoMachineCategories, machineTypes: demoMachineTypes, clientMachines: demoClientMachines, interventions: demoInterventions });
