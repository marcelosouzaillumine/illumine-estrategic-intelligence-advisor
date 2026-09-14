import { adaptScenarioToEFOSInput } from '../../runtime/efos/EFOSScenarioAdapter';
import { calculateInstitutionalExecution } from '../../runtime/efos/InstitutionalExecutionAssessment';
import { calculateInstitutionalReadiness } from '../../../runtime/governance/InstitutionalReadinessAssessment';
import { generateInstitutionalRoadmap } from '../../../runtime/governance/RoadmapPrioritizationEngine';

export const EFOSRuntimeAdapter = {
  adaptScenarioToEFOSInput,
  calculateInstitutionalExecution,
  calculateInstitutionalReadiness,
  generateInstitutionalRoadmap
};
