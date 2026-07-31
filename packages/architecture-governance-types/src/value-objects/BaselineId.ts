export type BaselineId = string & { readonly __brand: 'BaselineId' };

export const createBaselineId = (id: string): BaselineId => id as BaselineId;
