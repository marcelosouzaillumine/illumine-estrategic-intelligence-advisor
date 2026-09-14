import { RetentionTier, RetentionPolicy } from './LifecycleGovernanceTypes';

export class SnapshotRetentionPolicy {
  static getPolicy(tier: RetentionTier): RetentionPolicy {
    switch (tier) {
      case 'HOT':
        // Snapshots recentes (ex: Execuções de hoje). Prontos na UI.
        return { tier: 'HOT', maxAgeDays: 1, compressToStorage: false };
      case 'WARM':
        // Snapshots dos últimos 30 dias. Levemente compactados.
        return { tier: 'WARM', maxAgeDays: 30, compressToStorage: true };
      case 'COLD':
        // Histórico de trimestres passados.
        return { tier: 'COLD', maxAgeDays: 365, compressToStorage: true };
      case 'ARCHIVED':
        // Fiduciary Proof of State (Eterno)
        return { tier: 'ARCHIVED', maxAgeDays: 9999, compressToStorage: true };
    }
  }
}
