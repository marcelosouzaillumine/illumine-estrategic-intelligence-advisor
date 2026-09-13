import { ExecutiveIntelligenceReport } from "../../../core/runtime/executive-intelligence-runtime";
import { InstitutionalNarrativeToneGuard } from "../../../core/enforcement/InstitutionalNarrativeToneGuard";
import { NarrativeSemanticDeduplicator, SemanticSentence } from './NarrativeSemanticDeduplicator';
import { SegmentCode } from '../segment-intelligence/types';
import { SegmentNarrativeAdapter } from '../segment-intelligence/SegmentNarrativeAdapter';
import { InstitutionalClaimBoundary } from '../../../core/runtime/coherence/InstitutionalClaimBoundary';

export type ExecutiveNarrativeInput = {
  businessStage: string;
  economicModel: string;
  strategicConfidence: string;
  historicalDensityRequirement: string;
  historicalCyclesCount: number;
  growthPattern: string;
  liquidityPressure?: string;
  verbosity?: 'low' | 'medium' | 'high';
  segmentCode?: SegmentCode;
  stageLabel: string;
  modelLabel: string;
  memoryIgnoredRecommendations?: string[];
  memoryRecurrencePatterns?: string[];
};

export const ExecutiveNarrativeHarmonizer = {
  harmonize(input: ExecutiveNarrativeInput): string {
    const isEarlyStage = 
      input.businessStage === 'STRUCTURING_OPERATION' || 
      input.businessStage === 'INITIAL_OPERATION' || 
      input.historicalCyclesCount < 2;

    const isLimitedContext = 
      input.strategicConfidence === 'LIMITED_CONTEXT' || 
      input.strategicConfidence === 'UNVERIFIABLE' ||
      input.historicalDensityRequirement === 'INSUFFICIENT';

    const sentences: SemanticSentence[] = [];

    // Base structure
    let refinedModelLabel = input.modelLabel;
    
    // Instead of hardcoded generic replacements, use harmonized format if we have segment
    if (input.segmentCode && input.segmentCode !== 'GENERIC_OPERATION') {
      const traits = SegmentNarrativeAdapter.getNarrativeTraits(input.segmentCode);
      sentences.push({
        text: `A operação encontra-se no estágio de ${input.stageLabel.toLowerCase()}, estruturada sob um modelo de ${input.modelLabel.toLowerCase()} típico com ${traits.workingCapitalPressure}.`,
        tags: ['BASE_CONTEXT']
      });
    } else {
      if (refinedModelLabel.toLowerCase().includes('estoque')) {
        refinedModelLabel = 'operação intensiva em estoques';
      } else if (refinedModelLabel.toLowerCase().includes('leve em ativos')) {
        refinedModelLabel = 'operação com baixa dependência de ativos imobilizados';
      }

      sentences.push({
        text: `A operação encontra-se no estágio de ${input.stageLabel.toLowerCase()}, operando sob o modelo de ${refinedModelLabel.toLowerCase()}.`,
        tags: ['BASE_CONTEXT']
      });
    }

    // Historical limits
    if (isEarlyStage || isLimitedContext) {
      sentences.push({
        text: `A base histórica atual ainda é limitada para inferências de tendências longitudinais consolidadas.`,
        tags: ['LONGITUDINAL_LIMITATION', 'LOW_HISTORICAL_DENSITY']
      });
    } else {
      if (input.memoryIgnoredRecommendations && input.memoryIgnoredRecommendations.length > 0) {
        sentences.push({
          text: input.memoryIgnoredRecommendations[0],
          tags: ['INSTITUTIONAL_MEMORY']
        });
      }
      if (input.memoryRecurrencePatterns && input.memoryRecurrencePatterns.length > 0) {
        sentences.push({
          text: input.memoryRecurrencePatterns[0],
          tags: ['INSTITUTIONAL_MEMORY']
        });
      }
      sentences.push({
        text: `A estabilidade da base histórica permite validar o padrão de crescimento direcionado à ${input.growthPattern.toLowerCase()} com confiabilidade estratégica adequada.`,
        tags: ['MATURITY_CLAIM']
      });
    }

    if (input.verbosity === 'high') {
      sentences.push({
        text: `Calibração regulada sob perfil de estresse preditivo, aplicando mitigadores específicos de resiliência.`,
        tags: ['PREDICTIVE_STRESS']
      });
    }

    const limits = InstitutionalClaimBoundary.resolveLimits(
      input.historicalCyclesCount,
      input.strategicConfidence
    );

    let finalNarrative = NarrativeSemanticDeduplicator.deduplicate(sentences);
    finalNarrative = InstitutionalClaimBoundary.sanitizeOptimismLeakage(finalNarrative, limits);

    return InstitutionalNarrativeToneGuard.enforce(finalNarrative);
  }
};
