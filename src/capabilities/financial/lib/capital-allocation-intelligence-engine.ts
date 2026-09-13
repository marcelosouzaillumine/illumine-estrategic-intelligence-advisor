import type {
  CapitalAllocationIntelligence,
  CapitalAllocationIntelligenceInput,
} from './capital-allocation-intelligence-types';

const FIDUCIARY_DISCLAIMER =
  'Esta camada identifica prioridades institucionais de alocação de capital a partir das inteligências previamente produzidas, sem alterar métricas, indicadores, classificações, scores ou saídas fiduciárias existentes.';

export function buildCapitalAllocationIntelligence(
  input: CapitalAllocationIntelligenceInput | undefined,
): CapitalAllocationIntelligence | undefined {
  if (!input) return undefined;

  const {
    sectorIntelligence,
    benchmarkIntelligence,
    valuationIntelligence,
    esgIntelligence,
    governanceDigitalTwin,
  } = input;

  if (
    !sectorIntelligence &&
    !benchmarkIntelligence &&
    !valuationIntelligence &&
    !esgIntelligence &&
    !governanceDigitalTwin
  ) {
    return undefined;
  }

  const strategicInvestmentPriorities: string[] = [];
  const capabilityInvestmentPriorities: string[] = [];
  const governanceInvestmentPriorities: string[] = [];
  const executionAccelerationPriorities: string[] = [];
  const valueProtectionPriorities: string[] = [];
  const valueCreationPriorities: string[] = [];

  if (sectorIntelligence?.capabilityGaps?.length) {
    capabilityInvestmentPriorities.push(
      ...sectorIntelligence.capabilityGaps,
    );
  }

  if (
    governanceDigitalTwin?.executionCapacity?.classification === 'LOW'
  ) {
    executionAccelerationPriorities.push(
      'Fortalecimento da capacidade de execução institucional',
    );
  }

  if (
    benchmarkIntelligence?.executionPosition === 'EARLY'
  ) {
    governanceInvestmentPriorities.push(
      'Desenvolvimento de maturidade operacional',
    );
  }

  if (
    valuationIntelligence?.valuationReadiness === 'LOW'
  ) {
    valueCreationPriorities.push(
      'Fortalecimento da narrativa institucional de criação de valor',
    );
  }

  // Refined check per user constraints
  if (
    esgIntelligence?.governance?.classification === 'LOW'
  ) {
    valueProtectionPriorities.push(
      'Reforço dos mecanismos de governança',
    );
  }

  strategicInvestmentPriorities.push(
    ...capabilityInvestmentPriorities,
    ...governanceInvestmentPriorities,
  );

  return {
    strategicInvestmentPriorities,
    capabilityInvestmentPriorities,
    governanceInvestmentPriorities,
    executionAccelerationPriorities,
    valueProtectionPriorities,
    valueCreationPriorities,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
