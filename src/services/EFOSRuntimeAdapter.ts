import { adaptScenarioToEFOSInput } from '../capabilities/financial/runtime/efos/EFOSScenarioAdapter';
import { calculateInstitutionalExecution } from '../capabilities/financial/runtime/efos/InstitutionalExecutionAssessment';
import { calculateInstitutionalReadiness } from '../core/runtime/governance/InstitutionalReadinessAssessment';
import { generateInstitutionalRoadmap } from '../core/runtime/governance/RoadmapPrioritizationEngine';

export const EFOSRuntimeAdapter = {
  adaptScenarioToEFOSInput,
  calculateInstitutionalExecution,
  calculateInstitutionalReadiness,
  generateInstitutionalRoadmap
};
