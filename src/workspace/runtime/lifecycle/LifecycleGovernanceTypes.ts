export type RetentionTier = 'HOT' | 'WARM' | 'COLD' | 'ARCHIVED';

export interface RetentionPolicy {
  tier: RetentionTier;
  maxAgeDays: number;
  compressToStorage: boolean;
}

export interface CompressedPayload {
  version: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  dataBase64: string;
  originalHash: string; // Fiduciary Hash verification
}
