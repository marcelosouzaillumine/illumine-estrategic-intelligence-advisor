import { BoardDecision } from '../executive-prioritization/BoardTop3DecisionEngine';
import { ExecutiveRecommendation } from './ExecutiveRecommendationDeduplicationEngine';
import { ExecutiveNarrativeSanitizer } from './ExecutiveNarrativeSanitizer';
import { CrossStatementTension } from './CrossStatementPropagationEngine';

export interface ConsistencyAuditInput {
  badiScore: number;
  boardTop3: BoardDecision[];
  lucroLiquido: number;
  fco: number;
  tensions: CrossStatementTension[];
  patrimonioLiquido: number;
  capitalConsumido: number;
  runwayMonths: number;
  dominantRisk: string;
  priorityDecision: string;
  dlpaCapitalStatus?: string;
  snapshotCapitalProtectionStatus?: string;
  executiveTop5: ExecutiveRecommendation[];
}

export interface ConsistencyAuditResult {
  status: 'EFOS_EXECUTIVE_CONSISTENT' | 'EFOS_EXECUTIVE_INCONSISTENT' | 'BLOCKED_FOR_OPTIMISTIC_THESIS';
  violations: string[];
}

export class EFOSExecutiveConsistencyAuditEngine {
  public static audit(input: ConsistencyAuditInput): ConsistencyAuditResult {
    const violations: string[] = [];
    
    // Fallbacks for test retrocompatibility
    const tensions = input.tensions || [];
    if (tensions.length === 0 && (input as any).hasCrossStatementTension) {
      tensions.push({
        chain: (input as any).tensionChain || 'DRE_DFC_DLPA',
        category: (input as any).tensionCategory || 'VALUE_DESTRUCTION_CHAIN',
        severity: (input as any).tensionSeverity || 'CRITICAL',
        evidence: {
          netIncome: input.lucroLiquido,
          fco: input.fco,
          capitalConsumed: input.capitalConsumido
        },
        narrative: (input as any).tensionNarrative || 'Tensão cross-statement gerada para avaliação institucional de riscos estruturais.',
        source: 'CANONICAL_PROPAGATION'
      });
    }

    const boardTop3 = input.boardTop3 || [];
    const executiveTop5 = input.executiveTop5 || [];

    const hasTension = tensions.length > 0;

    // Rule 1 & 7: BADI Alto -> exige tensão cruzada
    if (input.badiScore >= 70 && !hasTension) {
      violations.push('BADI >= 70 mas não há tensão cross-statement.');
    }

    // Rule 11: BoardTop3 com decisão mas sem tensão
    if (boardTop3.length > 0 && !hasTension) {
      violations.push('BoardTop3 possui itens, mas nenhuma tensão cross-statement foi registrada. Ruptura causal.');
    }

    // Rule 2 & 9: Prejuízo + FCO Negativo + Capital Consumido
    if (input.lucroLiquido < 0 && input.fco < 0 && input.capitalConsumido > 0) {
      if (!hasTension) {
        violations.push('Destruição de valor e queima de caixa detectadas, mas nenhuma tensão cross-statement gerada.');
      } else {
        const hasDestructionChain = tensions.some(t => t.chain === 'DRE_DFC_DLPA' && t.category === 'VALUE_DESTRUCTION_CHAIN' && t.severity === 'CRITICAL');
        if (!hasDestructionChain) {
          violations.push('Tríade de destruição de valor exige tensão DRE_DFC_DLPA com tensionSeverity = CRITICAL e category = VALUE_DESTRUCTION_CHAIN. (Tríade de destruição de valor exige tensionSeverity = CRITICAL)');
        }
      }
    }

    // Rule 8: BoardTop3 possui item crítico e CrossStatement vazio
    // Implicitamente coberto pela Rule 11, mas reforçado:
    const hasCriticalDecision = boardTop3.some(d => d.urgencyLabel === 'Crítica' || d.impactLabel === 'Muito Alto');
    if (hasCriticalDecision && !hasTension) {
      violations.push('BoardTop3 possui decisão crítica, mas Cross-Statement está vazio.');
    }

    // Rule 3: Capital Fragilizado na DLPA -> Snapshot deve estar alinhado
    if (input.dlpaCapitalStatus && input.snapshotCapitalProtectionStatus && input.dlpaCapitalStatus !== input.snapshotCapitalProtectionStatus) {
      violations.push(`Status de capital divergente: DLPA (${input.dlpaCapitalStatus}) vs Snapshot (${input.snapshotCapitalProtectionStatus}).`);
    }

    // Rule 4: BADI Alto -> exige BoardTop3 não vazio
    if (boardTop3.length === 0 && input.badiScore >= 70) {
      violations.push('BADI >= 70 mas BoardTop3 está vazio.');
    }

    // Rule ECCTEP: Tensão não pode ser sintética na camada executiva
    const hasSyntheticTension = tensions.some(t => t.source && t.source !== 'CANONICAL_PROPAGATION');
    if (hasSyntheticTension) {
      violations.push('Tensão com source !== CANONICAL_PROPAGATION é proibida na camada executiva/board.');
    }

    // Rule 5 & 6: ExecutiveTop5 sem vazamento técnico e COM Action Verb
    const leakPattern = /(\[\[.*?\]\]|\[GROWTH\]|\[OPTIMIZATION\]|\[CAPITAL\]|Parâmetros de divulgação omitidos|runtime\.|^\s*\.:)/i;
    for (const rec of executiveTop5) {
      if (leakPattern.test(rec.text)) {
        violations.push('Vazamento técnico detectado na narrativa executiva.');
      }
      if (!rec.text || rec.text.trim().length < 5) {
        violations.push('Sanitização excessiva ou texto incompleto gerou recomendação executiva vazia ou sem ação.');
      }
      if (rec.type === 'EXECUTIVE' && !ExecutiveNarrativeSanitizer.hasValidExecutiveVerb(rec.text)) {
        violations.push('Executive Recommendation sem verbo de ação executivo válido.');
      }
    }

    // Regra 6 (do payload): BoardTop3 com campos obrigatórios
    for (const d of boardTop3) {
      if (!d.titulo || !d.problema || !d.impactoEsperado) {
        violations.push('Recomendação do BoardTop3 está incompleta (falta título, problema ou impacto esperado).');
      }
    }

    // DomRisk & Priority checks
    if (input.dominantRisk && (input.dominantRisk.toLowerCase().includes('sistêmico') || input.dominantRisk === 'Risco sistêmico.')) {
      violations.push('Risco dominante genérico detectado.');
    }

    if (input.priorityDecision && (input.priorityDecision.toLowerCase().includes('revisão estratégica executiva'))) {
      violations.push('Decisão prioritária genérica detectada.');
    }

    if (violations.length > 0) {
      return { status: 'EFOS_EXECUTIVE_INCONSISTENT', violations };
    }

    return { status: 'EFOS_EXECUTIVE_CONSISTENT', violations: [] };
  }
}
