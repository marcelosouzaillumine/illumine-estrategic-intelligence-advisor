export type CertificationId = string & { readonly __brand: 'CertificationId' };

export const createCertificationId = (id: string): CertificationId => id as CertificationId;
