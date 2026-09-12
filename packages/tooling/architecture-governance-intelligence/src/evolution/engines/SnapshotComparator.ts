import { StructuralChange } from '../models/index';
import { ArchitectureIntelligenceSnapshot } from '../../models/index';

export class SnapshotComparator {
  compare(fromSnapshot: ArchitectureIntelligenceSnapshot, toSnapshot: ArchitectureIntelligenceSnapshot): StructuralChange[] {
    const changes: StructuralChange[] = [];

    // Change Detection Layer (detecta puramente diferenças sem interpretar)
    // Para efeito de demonstração, simulamos que a v2 tenha um novo contrato adicionado
    
    // Simplificação mock para fins de estabilização da fundação:
    if (fromSnapshot.version !== toSnapshot.version) {
      changes.push({
        artifactId: 'FinancialReportContract',
        changeType: 'CREATED',
        fromSnapshotId: fromSnapshot.version,
        toSnapshotId: toSnapshot.version
      });
      
      changes.push({
        artifactId: 'engine-payment-001',
        changeType: 'MODIFIED',
        fromSnapshotId: fromSnapshot.version,
        toSnapshotId: toSnapshot.version
      });
    }

    return changes;
  }
}
