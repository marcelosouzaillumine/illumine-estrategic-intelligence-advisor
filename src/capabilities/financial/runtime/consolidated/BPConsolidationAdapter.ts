import { FinancialStatementLine, ConsolidatedFinancialStatementLine, AccountProvenance, EliminationRecord } from './types';
import { RuntimeViolation } from '../../../../runtime/types';

export interface BPConsolidationResult {
  lines: ConsolidatedFinancialStatementLine[];
  accountLineage: Record<string, AccountProvenance[]>;
  violations: RuntimeViolation[];
}

export class BPConsolidationAdapter {
  static consolidate(
    bpByEntity: Record<string, FinancialStatementLine[]>,
    eliminations: EliminationRecord[]
  ): BPConsolidationResult {
    const linesMap = new Map<string, ConsolidatedFinancialStatementLine>();
    const accountLineage: Record<string, AccountProvenance[]> = {};
    const violations: RuntimeViolation[] = [];

    // 1. Agregação Inicial (Soma) e Lineage
    for (const [entityId, lines] of Object.entries(bpByEntity)) {
      for (const line of lines) {
        // Usa cleanCategory ou category como chave única
        const key = line.cleanCategory || line.category;

        if (!linesMap.has(key)) {
          linesMap.set(key, {
            ...line,
            eliminatedValue: 0,
            consolidatedValue: 0,
            provenance: []
          });
          accountLineage[key] = [];
        }

        const consolidatedLine = linesMap.get(key)!;
        consolidatedLine.value += line.value;
        consolidatedLine.consolidatedValue += line.value;
        
        const prov = { entityId, accountId: line.accountId || key, value: line.value };
        consolidatedLine.provenance.push(prov);
        accountLineage[key].push(prov);
      }
    }

    // 2. Aplicação das Eliminações
    for (const elim of eliminations) {
      if (elim.status === 'MATCHED' || elim.status === 'PARTIAL_MATCH') {
        const sourceKey = elim.sourceAccountCategory;
        const targetKey = elim.targetAccountCategory;

        if (linesMap.has(sourceKey)) {
          const sLine = linesMap.get(sourceKey)!;
          sLine.eliminatedValue += elim.impactOnConsolidated;
          sLine.consolidatedValue -= elim.impactOnConsolidated;
        }

        if (linesMap.has(targetKey)) {
          const tLine = linesMap.get(targetKey)!;
          tLine.eliminatedValue += elim.impactOnConsolidated;
          tLine.consolidatedValue -= elim.impactOnConsolidated;
        }
      }
    }

    // 3. Validação da Equação Patrimonial Consolidada
    let ativo = 0;
    let passivo = 0;
    let pl = 0;

    for (const line of linesMap.values()) {
      const type = (line.type || '').toLowerCase();
      if (type.includes('ativo')) ativo += line.consolidatedValue;
      else if (type.includes('patrim') || type.includes('pl') || type.includes('líquido')) pl += line.consolidatedValue;
      else if (type.includes('passivo')) passivo += line.consolidatedValue;
    }

    const diff = Math.abs(ativo - (passivo + pl));
    if (diff > 1) { // Tolerância de arredondamento
      violations.push({
        rule: 'CONSOLIDATED_EQUATION_MISMATCH',
        severity: 'CRITICAL',
        message: `Equação patrimonial falhou após consolidação/eliminação. Ativo: ${ativo}, Passivo+PL: ${passivo+pl}, Diferença: ${diff}.`,
        sourceEngine: 'BPConsolidationAdapter',
        blocked: true
      });
    }

    return {
      lines: Array.from(linesMap.values()),
      accountLineage,
      violations
    };
  }
}
