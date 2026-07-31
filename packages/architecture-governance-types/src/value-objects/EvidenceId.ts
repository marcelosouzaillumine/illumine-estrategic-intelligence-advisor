export type EvidenceId = string & { readonly __brand: 'EvidenceId' };

export const createEvidenceId = (id: string): EvidenceId => id as EvidenceId;
