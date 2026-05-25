import { FinancialStatementLine, ConsolidatedFinancialStatementLine, AccountProvenance, EliminationRecord } from './types';
import { RuntimeViolation } from '../../../runtime/types';

export interface DREConsolidationResult {
  lines: ConsolidatedFinancialStatementLine[];
  accountLineage: Record<string, AccountProvenance[]>;
  violations: RuntimeViolation[];
}

export class DREConsolidationAdapter {
  static consolidate(
    dreByEntity: Record<string, FinancialStatementLine[]>,
    eliminations: EliminationRecord[]
  ): DREConsolidationResult {
    const linesMap = new Map<string, ConsolidatedFinancialStatementLine>();
    const accountLineage: Record<string, AccountProvenance[]> = {};
    const violations: RuntimeViolation[] = [];

    // 1. Agregação Inicial (Soma Linear) e Lineage
    for (const [entityId, lines] of Object.entries(dreByEntity)) {
      for (const line of lines) {
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

    // 2. Aplicação das Eliminações DRE (ex: Receita vs Despesa Intercompany)
    // Nota: O EBITDA, EBIT e Lucro não são recalculados via fórmula aqui.
    // Eles são abatidos matematicamente caso uma conta acima deles seja eliminada.
    // Porém, para respeitar a "Master Financial Intelligence Engine" rigorosamente,
    // o valor das rubricas de totalização reflete a soma cega menos o impacto direto da eliminação nas rubricas sintéticas equivalentes.
    for (const elim of eliminations) {
      if (elim.type === 'RECEITA_DESPESA' && (elim.status === 'MATCHED' || elim.status === 'PARTIAL_MATCH')) {
        const sourceKey = elim.sourceAccountCategory;
        const targetKey = elim.targetAccountCategory;

        if (linesMap.has(sourceKey)) {
          const sLine = linesMap.get(sourceKey)!;
          sLine.eliminatedValue += elim.impactOnConsolidated;
          sLine.consolidatedValue -= elim.impactOnConsolidated;
        }

        if (linesMap.has(targetKey)) {
          const tLine = linesMap.get(targetKey)!;
          // Subtração direta para manter a equação. A regra de sinal (se custo é negativo)
          // já deve estar contemplada no impactOnConsolidated assinado de forma correspondente,
          // ou assumimos eliminação absoluta.
          tLine.eliminatedValue += elim.impactOnConsolidated;
          tLine.consolidatedValue -= elim.impactOnConsolidated; // Assumindo impact positivo na conta, abater reduz.
        }

        // Se quisermos deduzir lucro consolidado:
        // Precisaríamos deduzir o impacto no "Lucro" ou "EBITDA" caso não seja reconstruído top-down em outra engine.
        // Como o escopo restringe o recálculo, apenas as rubricas diretas afetadas (Receita/Custo) serão eliminadas aqui.
      }
    }

    return {
      lines: Array.from(linesMap.values()),
      accountLineage,
      violations
    };
  }
}
