import { adaptScenarioToEFOSInput } from '../capabilities/financial/runtime/efos/EFOSScenarioAdapter';
import { calculateInstitutionalExecution } from '../capabilities/financial/runtime/efos/InstitutionalExecutionAssessment';
import { calculateInstitutionalReadiness } from '../capabilities/runtime/governance/InstitutionalReadinessAssessment';
import { generateInstitutionalRoadmap } from '../capabilities/runtime/governance/RoadmapPrioritizationEngine';

export const EFOSRuntimeAdapter = {
  adaptScenarioToEFOSInput,
  calculateInstitutionalExecution,
  calculateInstitutionalReadiness,
  generateInstitutionalRoadmap
};
