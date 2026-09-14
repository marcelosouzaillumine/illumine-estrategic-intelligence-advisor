export type WaveReference = string & { readonly __brand: 'WaveReference' };

export const createWaveReference = (id: string): WaveReference => id as WaveReference;
