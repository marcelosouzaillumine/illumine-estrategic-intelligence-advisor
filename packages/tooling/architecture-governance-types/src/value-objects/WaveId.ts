export type WaveId = string & { readonly __brand: 'WaveId' };

export const createWaveId = (id: string): WaveId => id as WaveId;
