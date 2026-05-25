import { BPSummary } from '../../lib/bpEngine';
import { FinancialMetrics } from '../../lib/financial-engine';
import { getSectorProfile } from './sector-behavior-profiles';
import { InventoryQualityOutput } from './inventory-quality-engine';

export type OperationalArchetype =
  | 'Industrial Early Stage'
  | 'Industrial Mature'
  | 'Inventory Driven'
  | 'Working Capital Heavy'
  | 'Asset Heavy Industrial'
  | 'Distribution Intensive'
  | 'Trading Operation'
  | 'Service Intensive'
  | 'SaaS / Subscription'
  | 'Recurring Revenue'
  | 'Premium Brand Formation'
  | 'Seasonal Demand Operation'
  | 'Scale Expansion Cycle';

export type LossArchetype = 'Prejuízo de Maturação' | 'Prejuízo Estrutural' | 'Lucratividade Estável';

export interface MaturityContextOutput {
  archetype: OperationalArchetype;
  lossArchetype: LossArchetype;
  stage: 'Early Stage' | 'Growth' | 'Mature' | 'Distressed';
  stressRecalibrationFactor: number; 
  contextualNarrative: string;
}

export function evaluateMaturityContext(
  bpSummary: BPSummary,
  metrics: FinancialMetrics,
  sectorName: string,
  dreDataLength: number,
  inventoryContext: InventoryQualityOutput
): MaturityContextOutput {
  const { patrimonioLiquido, fornecedores, passivoCirculante } = bpSummary;
  const { ebitda, lucroLiquido, dependenciaBancaria, concentracaoEstoque } = metrics;
  const sector = getSectorProfile(sectorName);

  let archetype: OperationalArchetype = 'Working Capital Heavy';
  let stage: 'Early Stage' | 'Growth' | 'Mature' | 'Distressed' = 'Mature';
  let lossArchetype: LossArchetype = 'Lucratividade Estável';
  let stressRecalibrationFactor = 1.0;
  let narrative = '';

  if (dreDataLength <= 2 || (ebitda < 0 && patrimonioLiquido > 0 && dependenciaBancaria < 0.2)) {
    stage = 'Early Stage';
  } else if (patrimonioLiquido < 0 && ebitda < 0 && dreDataLength > 2) {
    stage = 'Distressed';
  } else if (ebitda > 0 && lucroLiquido > 0) {
    stage = 'Mature';
  } else {
    stage = 'Growth';
  }

  if (lucroLiquido < 0) {
    if (stage === 'Early Stage' && dependenciaBancaria < 0.3 && patrimonioLiquido > 0) {
      lossArchetype = 'Prejuízo de Maturação';
      stressRecalibrationFactor = 0.4; 
      narrative = 'Operação jovem. O prejuízo contábil atual reflete esforço de tração comercial (Ramp-Up), CAC inicial e formação estrutural, não deterioração insolvente.';
    } else if (stage === 'Distressed' || dependenciaBancaria > 0.5) {
      lossArchetype = 'Prejuízo Estrutural';
      stressRecalibrationFactor = 1.0;
      narrative = 'Destruição crônica de caixa. Dependência agressiva de dívida com erosão estrutural do patrimônio indicando insolvência eminente.';
    } else {
      lossArchetype = 'Prejuízo Estrutural';
      stressRecalibrationFactor = 0.9;
      narrative = 'Déficit operacional persistente, indicando erosão gradual sem tração compatível de crescimento que justifique o capital queimado.';
    }
  } else {
    lossArchetype = 'Lucratividade Estável';
    stressRecalibrationFactor = 1.0;
    narrative = 'Negócio com margens operacionais equacionadas e lucratividade.';
  }

  if (sector.id === 'saas') {
    archetype = stage === 'Early Stage' ? 'SaaS / Subscription' : 'Recurring Revenue';
  } else if (sector.id === 'cosmeticos' && stage === 'Early Stage') {
    archetype = 'Premium Brand Formation';
  } else if (concentracaoEstoque > 0.4 && inventoryContext.classification === 'Estoque Estratégico') {
    archetype = 'Inventory Driven';
  } else if (concentracaoEstoque > 0.3 && stage === 'Early Stage' && sector.expectedAssetType === 'Heavy') {
    archetype = 'Industrial Early Stage';
  } else if (sector.expectedAssetType === 'Heavy') {
    archetype = 'Asset Heavy Industrial';
  } else if (inventoryContext.classification === 'Estoque de Expansão') {
    archetype = 'Scale Expansion Cycle';
  } else if (sector.id === 'varejo') {
    archetype = 'Distribution Intensive';
  } else if (sector.id === 'hospital') {
    archetype = 'Service Intensive';
  }

  return {
    archetype,
    lossArchetype,
    stage,
    stressRecalibrationFactor,
    contextualNarrative: narrative
  };
}
