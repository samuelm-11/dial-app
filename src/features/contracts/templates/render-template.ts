import type { ClientWithRelations } from '@/types/client';

export const contractTemplateVariables = [
  { key: 'client.nom', label: 'Nom du client' },
  { key: 'client.adresse', label: 'Adresse' },
  { key: 'client.code_postal', label: 'Code postal' },
  { key: 'client.ville', label: 'Ville' },
  { key: 'client.pays', label: 'Pays' },
  { key: 'client.societe_mere', label: 'Société mère' },
  { key: 'contact.nom', label: 'Contact principal' },
  { key: 'contact.email', label: 'Email du contact' },
  { key: 'contact.telephone', label: 'Téléphone du contact' },
  { key: 'contrat.date_debut', label: 'Date de début' },
  { key: 'contrat.date_fin', label: 'Date de fin' },
  { key: 'contrat.formule', label: 'Formule de service' },
  { key: 'contrat.montant_mensuel', label: 'Montant mensuel' },
  { key: 'contrat.facturation', label: 'Fréquence de facturation' },
  { key: 'contrat.paiement', label: 'Conditions de paiement' },
  { key: 'contrat.duree', label: 'Durée du contrat' },
  { key: 'contrat.conditions_particulieres', label: 'Conditions particulières' },
  { key: 'date', label: 'Date du jour' }
] as const;

type RenderContractTemplateInput = {
  client: ClientWithRelations;
  startDate: string;
  endDate: string;
  details?: {
    serviceLevel?: string;
    monthlyFee?: string;
    billingFrequency?: string;
    paymentTerms?: string;
    contractDuration?: string;
    specialConditions?: string | null;
  };
  today?: Date;
};

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(typeof value === 'string' ? new Date(`${value}T00:00:00`) : value);

const getPrimaryContact = (client: ClientWithRelations) => client.contacts.find((contact) => contact.isPrimary) ?? client.contacts[0] ?? null;

export function buildContractTemplateValues({ client, startDate, endDate, details, today = new Date() }: RenderContractTemplateInput) {
  const primaryContact = getPrimaryContact(client);
  const contactName = primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}`.trim() : '';

  return {
    'client.nom': client.name,
    'client.adresse': client.address,
    'client.code_postal': client.postalCode,
    'client.ville': client.city,
    'client.pays': client.country || 'Belgique',
    'client.societe_mere': client.parent?.name ?? '',
    'contact.nom': contactName,
    'contact.email': primaryContact?.email ?? '',
    'contact.telephone': primaryContact?.phone ?? '',
    'contrat.date_debut': startDate ? formatDate(startDate) : '',
    'contrat.date_fin': endDate ? formatDate(endDate) : '',
    'contrat.formule': details?.serviceLevel ?? '',
    'contrat.montant_mensuel': details?.monthlyFee ?? '',
    'contrat.facturation': details?.billingFrequency ?? '',
    'contrat.paiement': details?.paymentTerms ?? '',
    'contrat.duree': details?.contractDuration ?? '',
    'contrat.conditions_particulieres': details?.specialConditions || 'Aucune condition particulière.',
    date: formatDate(today)
  };
}

export function renderContractTemplate(templateContent: string, input: RenderContractTemplateInput) {
  const values = buildContractTemplateValues(input);

  return templateContent.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key: string) => {
    const value = values[key as keyof typeof values];
    return value === undefined || value === '' ? match : value;
  });
}
