import type { Contract, ContractEndingSoon, ContractFilterInput } from '@/types/contract';

const cleanSegment = (value: string) => value.toLowerCase().replace(/[^a-z0-9-_]/gi, '-');

export function buildContractPdfPath(clientId: string, contractId: string, fileName: string) {
  const baseName = fileName.replace(/\.pdf$/i, '');
  const safeName = cleanSegment(baseName).slice(0, 80) || 'contract';
  return `contracts/${clientId}/${contractId}-${safeName}.pdf`;
}

export function filterContracts(contracts: Contract[], filters: ContractFilterInput): Contract[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return contracts.filter((contract) => {
    if (filters.endingInDays) {
      const endDate = new Date(`${contract.endDate}T00:00:00.000Z`);
      const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diff < 0 || diff > filters.endingInDays) {
        return false;
      }
    }

    if (filters.hasPdf !== undefined) {
      const hasPdf = Boolean(contract.privatePdfPath);
      if (hasPdf !== filters.hasPdf) {
        return false;
      }
    }

    if (filters.autoRenewal !== undefined && contract.autoRenewal !== filters.autoRenewal) {
      return false;
    }

    if (filters.postalCode && !contract.clientPostalCode?.includes(filters.postalCode)) {
      return false;
    }

    if (filters.city && !contract.clientCity?.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }

    if (filters.categories?.length && (!contract.clientCategory || !filters.categories.includes(contract.clientCategory))) {
      return false;
    }

    if (filters.flags?.length && (!contract.clientFlag || !filters.flags.includes(contract.clientFlag))) {
      return false;
    }

    return true;
  });
}

export function toContractsEndingSoon(contracts: Contract[]): ContractEndingSoon[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return contracts
    .map((contract) => {
      const endDate = new Date(`${contract.endDate}T00:00:00.000Z`);
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: contract.id,
        clientId: contract.clientId,
        clientName: contract.clientName,
        title: contract.title,
        endDate: contract.endDate,
        daysRemaining
      };
    })
    .filter((item) => item.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}
