import { DiscoverySnapshot } from '@illumine/architecture-governance-discovery';
import { ArchitectureObservation } from '../models/ArchitectureObservation';
import { ArchitectureFinding } from '../models/ArchitectureFinding';

export interface EvaluationEngineContract {
  id: string;
  version: string;
  
  evaluate(snapshot: DiscoverySnapshot): {
    observations: ArchitectureObservation[];
    findings: ArchitectureFinding[];
  };
}
