import { ConsolidatedFinancialInput, ConsolidatedFinancialOutput, EliminationRecord, EntityProvenance, AccountProvenance } from './types';
import { EliminationEngine } from './EliminationEngine';
import { BPConsolidationAdapter } from './BPConsolidationAdapter';
import { DREConsolidationAdapter } from './DREConsolidationAdapter';
import { ConsolidatedConfidenceResolver } from './ConsolidatedConfidenceResolver';

export class ConsolidatedFinancialOrchestrator {
  
  static draftConsolidation(input: ConsolidatedFinancialInput): ConsolidatedFinancialOutput {
    const { groupId, fiscalYear, entities, bpByEntity, dreByEntity, topologySnapshot, confidenceByEntity } = input;

    // 1. Validar disponibilidade de dados e identificar missing
    const bpMissing = entities.filter(e => !bpByEntity[e.id] || bpByEntity[e.id].length === 0).map(e => e.id);
    const dreMissing = entities.filter(e => !dreByEntity[e.id] || dreByEntity[e.id].length === 0).map(e => e.id);

    // 2. Resolver Eliminações (Sem cálculo financeiro)
    const eliminations = EliminationEngine.processOperations(topologySnapshot.intercompanyOperations, input.consolidationScope);

    // 3. Resolver Confidence e Violações Top-Level
    const { confidence, violations: confViolations, warnings } = ConsolidatedConfidenceResolver.resolve(
      entities, confidenceByEntity, eliminations, bpMissing, dreMissing
    );

    // 4. Adaptador BP Consolidation
    const bpResult = BPConsolidationAdapter.consolidate(bpByEntity, eliminations);

    // 5. Adaptador DRE Consolidation
    const dreResult = DREConsolidationAdapter.consolidate(dreByEntity, eliminations);

    // 6. Montagem do Lineage
    const entityLineage: Record<string, EntityProvenance[]> = {};
    const accountLineage: Record<string, AccountProvenance[]> = {
      ...bpResult.accountLineage,
      ...dreResult.accountLineage
    };

    const violations = [
      ...confViolations,
      ...bpResult.violations,
      ...dreResult.violations,
      ...eliminations.map(e => e.violation).filter(v => v !== undefined)
    ];

    return {
      groupId,
      fiscalYear,
      consolidatedBP: bpResult.lines,
      consolidatedDRE: dreResult.lines,
      eliminations,
      entityLineage,
      accountLineage,
      confidence,
      violations,
      warnings,
      auditTrail: []
    };
  }

  static validatedConsolidation(draft: ConsolidatedFinancialOutput): ConsolidatedFinancialOutput {
    // Fase de validação final. Verifica se há bloqueios que impeçam a emissão do Consolidado.
    const hasCritical = draft.violations.some(v => v.severity === 'CRITICAL' && v.blocked);
    
    if (hasCritical) {
      // Bloquear a emissão de dados financeiros caso tenha erros críticos.
      // Esvaziamos os arrays para evitar consumo incorreto.
      return {
        ...draft,
        consolidatedBP: [],
        consolidatedDRE: [],
        warnings: [...draft.warnings, 'Consolidação bloqueada por violações CRITICAL.'],
        auditTrail: [...draft.auditTrail, { timestamp: new Date().toISOString(), action: 'BLOCK_EMISSION' }]
      };
    }

    return {
      ...draft,
      auditTrail: [...draft.auditTrail, { timestamp: new Date().toISOString(), action: 'VALIDATE_EMISSION' }]
    };
  }

  static run(input: ConsolidatedFinancialInput): ConsolidatedFinancialOutput {
    const draft = this.draftConsolidation(input);
    return this.validatedConsolidation(draft);
  }
}
