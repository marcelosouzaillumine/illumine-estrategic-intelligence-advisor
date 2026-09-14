import type {
  SectorIntelligence,
  SectorIntelligenceInput,
} from './sector-intelligence-types';

const FIDUCIARY_DISCLAIMER =
  'Esta camada contextualiza a organização em relação a padrões institucionais observados no ambiente setorial, sem alterar métricas, indicadores, classificações, scores, narrativas ou saídas fiduciárias previamente geradas.';

export function buildSectorIntelligence(
  input: SectorIntelligenceInput | undefined,
): SectorIntelligence | undefined {
  if (!input) return undefined;

  const {
    esgIntelligence,
    valuationIntelligence,
    benchmarkIntelligence,
    governanceDigitalTwin,
  } = input;

  if (
    !esgIntelligence &&
    !valuationIntelligence &&
    !benchmarkIntelligence &&
    !governanceDigitalTwin
  ) {
    return undefined;
  }

  const sectorRiskProfile: string[] = [];
  const sectorOpportunityProfile: string[] = [];
  const sectorStrategicSignals: string[] = [];
  const requiredInstitutionalCapabilities: string[] = [];
  const capabilityGaps: string[] = [];
  const capabilityAdvantages: string[] = [];
  
  const sectorMaturitySignals: string[] = [];
  const sectorExecutionRequirements: string[] = [];
  const sectorGovernanceRequirements: string[] = [];

  if (esgIntelligence) {
    sectorStrategicSignals.push(
      'Sustentabilidade institucional tornou-se uma exigência crescente do ambiente competitivo.',
    );
    sectorGovernanceRequirements.push('Maturidade em pautas ESG e transparência socioambiental.');
  }

  if (valuationIntelligence) {
    sectorStrategicSignals.push(
      'Organizações com narrativa de valor consistente possuem maior capacidade de atração de investidores.',
    );
    sectorMaturitySignals.push('Prontidão para avaliação de mercado (Valuation Readiness).');
  }

  if (benchmarkIntelligence) {
    sectorStrategicSignals.push(
      'Capacidade de execução e maturidade institucional influenciam posicionamento competitivo.',
    );
    sectorExecutionRequirements.push('Eficiência na execução estratégica para posicionamento de liderança.');
  }

  requiredInstitutionalCapabilities.push(
    'Governança',
    'Execução Estratégica',
    'Gestão de Riscos',
    'Capacidade de Aprendizado Institucional',
  );

  if (governanceDigitalTwin?.executionCapacity?.classification === 'LOW') {
    capabilityGaps.push('Execução Estratégica');
    sectorRiskProfile.push('Baixa capacidade de execução histórica pode limitar captura de valor setorial.');
  } else if (governanceDigitalTwin) {
    capabilityAdvantages.push('Execução Estratégica');
    sectorOpportunityProfile.push('Histórico de execução pode atuar como diferencial competitivo setorial.');
  }

  return {
    sectorRiskProfile,
    sectorOpportunityProfile,
    sectorStrategicSignals,
    requiredInstitutionalCapabilities,
    capabilityGaps,
    capabilityAdvantages,
    sectorMaturitySignals,
    sectorExecutionRequirements,
    sectorGovernanceRequirements,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
