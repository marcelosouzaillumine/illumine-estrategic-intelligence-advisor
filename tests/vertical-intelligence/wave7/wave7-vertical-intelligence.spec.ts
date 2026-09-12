import {
  HealthcareIntelligenceEngine,
  FamilyBusinessIntelligenceEngine,
  IndustrialIntelligenceEngine,
  ProfessionalServicesEngine,
  HealthcareAdvisorAgent,
  FamilyGovernanceAdvisorAgent,
  IndustrialOperationsAdvisorAgent,
  ServicesGrowthAdvisorAgent
} from '../../../packages/vertical-intelligence/src/index';
import { VerticalROIEngine } from '../../../packages/os/commercialization/src/index';

export function testWave7VerticalIntelligence(): boolean {
  // Test 01: Vertical Engines Execution
  const healthcare = HealthcareIntelligenceEngine.calculateHospitalHealth('tnt-health');
  if (healthcare.hospitalEbitdaMarginPercentage < 15 || healthcare.bedOccupancyRatePercentage < 80) {
    throw new Error('Falha no cálculo de métricas do Healthcare Governance Engine');
  }

  const family = FamilyBusinessIntelligenceEngine.calculateFamilyGovernance('tnt-family');
  if (family.familyGovernanceScore < 90 || !family.shareholderAgreementActive) {
    throw new Error('Falha no cálculo de governança do Family Business Governance Engine');
  }

  const industrial = IndustrialIntelligenceEngine.calculateIndustrialPerformance('tnt-ind');
  if (industrial.oeePercentage < 80) {
    throw new Error('Falha no cálculo de OEE do Industrial Governance Engine');
  }

  const services = ProfessionalServicesEngine.calculateServicesPerformance('tnt-serv');
  if (services.teamUtilizationRatePercentage < 75) {
    throw new Error('Falha no cálculo de utilização do Professional Services Engine');
  }

  // Test 02: Vertical Specialized Agents
  const hcAgent = HealthcareAdvisorAgent.analyze();
  const fgAgent = FamilyGovernanceAdvisorAgent.analyze();
  const indAgent = IndustrialOperationsAdvisorAgent.analyze();
  const servAgent = ServicesGrowthAdvisorAgent.analyze();

  if (!hcAgent.mustAutoMergeForbidden || !fgAgent.mustAutoMergeForbidden || !indAgent.mustAutoMergeForbidden || !servAgent.mustAutoMergeForbidden) {
    throw new Error('Falha na salvaguarda Human-in-the-Loop dos agentes especializados verticais');
  }

  // Test 03: Vertical Commercial ROI Engine
  const roiHealthcare = VerticalROIEngine.calculateVerticalROI('HEALTHCARE');
  if (roiHealthcare.ebitdaGainEstimateBrl !== 1200000) {
    throw new Error('Falha no cálculo de ROI vertical do segmento de saúde');
  }

  return true;
}
