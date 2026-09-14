export type CapabilityId = string & { readonly __brand: 'CapabilityId' };

export const createCapabilityId = (id: string): CapabilityId => id as CapabilityId;
