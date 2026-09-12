// src/core/runtime/causal-intelligence/InstitutionalCausalityExplorer.ts

import { InstitutionalCausalityOutput, CausalChain, CausalEvidence, CausalConfidence } from './causal-types';
import { HistoricalRuntimeCycle } from '../executive-timeline/executive-timeline-types';
import { CausalityConfidenceEngine } from './engines/CausalityConfidenceEngine';
import { RootCausePrioritizationEngine } from './engines/RootCausePrioritizationEngine';
import { OperationalCausalityEngine } from './engines/OperationalCausalityEngine';
import { CommercialCausalityEngine } from './engines/CommercialCausalityEngine';
import { TreasuryCausalityEngine } from './engines/TreasuryCausalityEngine';
import { WorkingCapitalCausalityEngine } from './engines/WorkingCapitalCausalityEngine';
import { DebtCausalityEngine } from './engines/DebtCausalityEngine';
import { GovernanceCausalityEngine } from './engines/GovernanceCausalityEngine';
import { CapitalStructureCausalityEngine } from './engines/CapitalStructureCausalityEngine';
import { ConstitutionalCausalityEngine } from './engines/ConstitutionalCausalityEngine';

export class InstitutionalCausalityExplorer {

  public static generate(
    cycles: HistoricalRuntimeCycle[],
    timelineConfidence: string
  ): InstitutionalCausalityOutput {
    // 1. Determine Confidence Level
    const confidenceLevel = CausalityConfidenceEngine.determine(cycles, timelineConfidence);

    // 2. Invoke Sub-Engines
    let causalChains: CausalChain[] = [];

    if (confidenceLevel !== 'CAUSALITY_RESTRICTED') {
      causalChains = [
        ...OperationalCausalityEngine.detect(cycles),
        ...CommercialCausalityEngine.detect(cycles),
        ...TreasuryCausalityEngine.detect(cycles),
        ...WorkingCapitalCausalityEngine.detect(cycles),
        ...DebtCausalityEngine.detect(cycles),
        ...GovernanceCausalityEngine.detect(cycles),
        ...CapitalStructureCausalityEngine.detect(cycles),
        ...ConstitutionalCausalityEngine.detect(cycles)
      ];
    } else {
      // Fail closed / restriction chain
      const latest = cycles.length > 0 ? cycles[cycles.length - 1] : null;
      causalChains = [{
        cause: 'CONTAMINACAO_OU_INSUFICIENCIA_DE_DADOS',
        driver: 'PROTOCOLO_FAIL_CLOSED_ATIVO',
        effect: 'CAUSALIDADE_RESTRITA',
        narrative: 'Análise de causalidade fiduciária suspensa para evitar inferências sem dados suficientes ou integridade de linhagem.',
        category: 'CONSTITUTIONAL',
        severity: 'RESTRICTIVE',
        lineageHash: latest ? `cause_restricted_${latest.cycleReference}_${latest.lineageHash}` : 'N/A'
      }];
    }

    // 3. Prioritize Causal Chains
    const { primaryCause, secondaryCauses } = RootCausePrioritizationEngine.prioritize(causalChains);

    // 4. Gather Supporting Evidence from the latest cycle
    const supportingEvidence: CausalEvidence[] = [];
    if (cycles.length > 0) {
      const latest = cycles[cycles.length - 1];
      const ref = latest.cycleReference;
      supportingEvidence.push(
        { metricName: 'ebitda', metricValue: latest.ebitda, sourcePeriod: ref },
        { metricName: 'ocf', metricValue: latest.ocf, sourcePeriod: ref },
        { metricName: 'cashEquivalents', metricValue: latest.cashEquivalents, sourcePeriod: ref },
        { metricName: 'workingCapital', metricValue: latest.workingCapital, sourcePeriod: ref },
        { metricName: 'totalDebt', metricValue: latest.totalDebt, sourcePeriod: ref }
      );
    }

    // 5. Compose Deterministic Executive Narrative
    const executiveNarrative = this.composeNarrative(
      primaryCause,
      secondaryCauses,
      confidenceLevel,
      causalChains
    );

    // 6. Cryptographic lineage propagation
    const combinedLineages = causalChains.map(c => c.lineageHash).join('|');
    const lineageHash = `causal_${this.simpleHash(combinedLineages)}`;

    return {
      primaryCause,
      secondaryCauses,
      causalChains,
      confidenceLevel,
      supportingEvidence,
      executiveNarrative,
      lineageHash
    };
  }

  private static composeNarrative(
    primary: string,
    secondaries: string[],
    confidence: CausalConfidence,
    chains: CausalChain[]
  ): string {
    if (confidence === 'CAUSALITY_RESTRICTED') {
      return 'Diagnóstico de causalidade fiduciária indisponível. Protocolo de restrição fiduciária ativo.';
    }

    let narrative = `O mapeamento de causalidade identificou como fator estrutural primário: ${primary.replace(/_/g, ' ')}.`;

    const activeChains = chains.filter(c => c.category !== 'CONSTITUTIONAL');
    if (activeChains.length > 0) {
      narrative += ` Foram detectadas ${activeChains.length} cadeias causais de impacto operacional e financeiro.`;
      
      if (secondaries.length > 0) {
        narrative += ` Fatores secundários adicionais sob monitoramento: ${secondaries.map(s => s.replace(/_/g, ' ')).join(', ')}.`;
      }
    } else {
      narrative += ' Nenhuma cadeia de pressão operacional ou financeira significativa foi mapeada nos ciclos avaliados.';
    }

    return narrative;
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}
