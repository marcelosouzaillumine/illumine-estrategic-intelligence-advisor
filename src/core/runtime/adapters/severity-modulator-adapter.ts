import { ModulatedCausality, modulateSeverity } from '../../intelligence/severity-modulation-engine';
import { evaluateMaturityContext } from '../../intelligence/industry-maturity-context-engine';
import { evaluateInventoryQuality } from '../../intelligence/inventory-quality-engine';
import { calculateInferenceConfidence } from '../../intelligence/inference-confidence-engine';
import { BPSummary } from '../../../lib/bpEngine';
type FinancialMetrics = any;
import { MasterCausalOutput } from '../../../lib/master-causal-engine';

export type SeverityLevel = 'SAUDÁVEL' | 'SENSÍVEL' | 'PRESSIONADO' | 'RESTRITIVO' | 'ESTRESSADO' | 'CRÍTICO' | 'COLAPSO';

export interface SeverityAdapterOutput {
  level: SeverityLevel;
  justification: string;
}

export function translateSeverityModulation(
  bpSummary: BPSummary | undefined,
  metrics: FinancialMetrics | undefined,
  segment: string,
  masterCausality: MasterCausalOutput | undefined,
  runtimeMode: string
): SeverityAdapterOutput {

  if (!bpSummary || !metrics || !metrics.hasData || !masterCausality) {
    // Retorno fallback obrigatório por ausência de dados estruturais completos
    return {
      level: 'SENSÍVEL',
      justification: '[INSUFFICIENT_DATA] Visão limitada. Modulação estrutural de severidade suspensa.'
    };
  }

  const salesGrowthRate = 0; // Fallback se não vier na UI
  const dreDataLength = 1; // Fallback
  const inventory = evaluateInventoryQuality(bpSummary, metrics, segment, salesGrowthRate);
  const maturity = evaluateMaturityContext(bpSummary, metrics, segment, dreDataLength, inventory);
  // Confidence simplificada para fins de adaptador (idealmente viria do payload global)
  const confidence = calculateInferenceConfidence(1, 1, 0.5);

  const modulated = modulateSeverity(
    masterCausality.scenarios,
    maturity,
    inventory,
    confidence,
    bpSummary,
    metrics
  );

  // Deriva o nível máximo de severidade com base nos cenários modulados
  let maxSeverity: SeverityLevel = 'SAUDÁVEL';
  const severityRank: Record<string, number> = {
    'SAUDÁVEL': 0, 'SENSÍVEL': 1, 'PRESSIONADO': 2, 'RESTRITIVO': 3, 'ESTRESSADO': 4, 'CRÍTICO': 5, 'COLAPSO': 6
  };

  const mapToLevel = (sevStr: string): SeverityLevel => {
    if (sevStr === 'Alta' || sevStr === 'Crítica') return 'CRÍTICO';
    if (sevStr === 'Média') return 'PRESSIONADO';
    if (sevStr === 'Baixa') return 'SENSÍVEL';
    return 'SAUDÁVEL';
  };

  if (modulated.scenarios && modulated.scenarios.length > 0) {
    for (const s of modulated.scenarios) {
      const level = mapToLevel(s.severity);
      if (severityRank[level] > severityRank[maxSeverity]) {
        maxSeverity = level;
      }
    }
  }

  // Narrative Governance (Limited Mode)
  // Em Limited mode, travar severidades máximas
  if (runtimeMode !== 'FULL_FINANCIAL_VIEW' && severityRank[maxSeverity] >= severityRank['CRÍTICO']) {
    maxSeverity = 'ESTRESSADO';
  }

  // Combinar a justificativa
  const justification = modulated.explicabilityBlock.riscoResidual + ' ' + modulated.explicabilityBlock.tendenciaEstrutural;

  return {
    level: maxSeverity,
    justification: justification.trim()
  };
}
