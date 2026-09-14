export type ReleaseId = string & { readonly __brand: 'ReleaseId' };

export const createReleaseId = (id: string): ReleaseId => id as ReleaseId;
