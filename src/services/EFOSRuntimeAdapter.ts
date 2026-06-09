import { adaptScenarioToEFOSInput } from '../core/runtime/efos/EFOSScenarioAdapter';
import { calculateInstitutionalExecution } from '../core/runtime/efos/InstitutionalExecutionAssessment';
import { calculateInstitutionalReadiness } from '../core/runtime/governance/InstitutionalReadinessAssessment';
import { generateInstitutionalRoadmap } from '../core/runtime/governance/RoadmapPrioritizationEngine';

export const EFOSRuntimeAdapter = {
  adaptScenarioToEFOSInput,
  calculateInstitutionalExecution,
  calculateInstitutionalReadiness,
  generateInstitutionalRoadmap
};
