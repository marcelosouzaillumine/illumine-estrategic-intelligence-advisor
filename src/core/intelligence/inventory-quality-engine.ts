import { BPSummary } from '../../lib/bpEngine';
import { FinancialMetrics } from '../../lib/financial-engine';
import { getSectorProfile } from './sector-behavior-profiles';

export type InventoryClassification = 
  | 'Estoque Estratégico'
  | 'Estoque de Expansão'
  | 'Estoque Regulatório'
  | 'Estoque Sazonal'
  | 'Estoque Pipeline'
  | 'Estoque Giro Lento'
  | 'Estoque Improdutivo'
  | 'Estoque Crítico';

export interface InventoryQualityOutput {
  classification: InventoryClassification;
  inventoryQualityScore: number; 
  strategicInventoryRatio: number; // Porcentagem do estoque considerado produtivo/estratégico
  inventoryDependencyIndex: number; 
  explanation: string;
}

export function evaluateInventoryQuality(
  bpSummary: BPSummary,
  metrics: FinancialMetrics,
  sectorName: string,
  salesGrowthRate: number // Proxy para tração comercial
): InventoryQualityOutput {
  const { estoques, ativoCirculante, fornecedores } = bpSummary;
  const { cgl } = metrics;
  const sector = getSectorProfile(sectorName);
  
  const concentration = ativoCirculante > 0 ? estoques / ativoCirculante : 0;
  // Index que mede o quanto o estoque está refém (se maior que fornecedores, é capital próprio preso no estoque)
  const dependency = fornecedores > 0 ? estoques / fornecedores : 0; 

  let score = 50;
  let strategicRatio = 0.5;
  let classification: InventoryClassification = 'Estoque Pipeline';
  let explanation = '';

  if (estoques <= 0) {
    return {
      classification: 'Estoque Pipeline',
      inventoryQualityScore: 100,
      strategicInventoryRatio: 0,
      inventoryDependencyIndex: 0,
      explanation: 'Sem nível representativo de inventário retido.'
    };
  }

  if (salesGrowthRate > 0.15 && sector.expectedInventoryIntensity === 'High') {
    classification = 'Estoque de Expansão';
    score = 85;
    strategicRatio = 0.8;
    explanation = 'Forte formação de inventário alinhada à tração comercial (Ramp-up). Fornecedores ajudam a absorver a pressão.';
  } else if (concentration > 0.6 && salesGrowthRate < 0) {
    classification = 'Estoque Improdutivo';
    score = 20;
    strategicRatio = 0.1;
    explanation = 'Alta concentração patrimonial com vendas estagnadas. Indica ineficiência comercial grave e risco primário de obsolescência.';
  } else if (concentration > 0.4 && dependency > 1.5) {
    classification = 'Estoque Crítico';
    score = 30;
    strategicRatio = 0.2;
    explanation = 'Retenção absoluta do capital de giro sem correspondência de financiamento da cadeia produtiva (Descasamento Severo).';
  } else if (sector.expectedInventoryIntensity === 'High' && cgl > 0) {
    classification = 'Estoque Estratégico';
    score = 75;
    strategicRatio = 0.6;
    explanation = 'Formação de portfólio e grade inerente ao modelo setorial, com giro estabilizado pela estrutura de capital.';
  } else {
    classification = 'Estoque Giro Lento';
    score = 50;
    strategicRatio = 0.4;
    explanation = 'Manutenção de inventário com pressão real na liquidez imediata, mas sem caracterizar ainda obsolescência crítica ou agressividade de expansão.';
  }

  const inventoryDependencyIndex = (concentration * 100);

  return {
    classification,
    inventoryQualityScore: score,
    strategicInventoryRatio: strategicRatio,
    inventoryDependencyIndex,
    explanation
  };
}
