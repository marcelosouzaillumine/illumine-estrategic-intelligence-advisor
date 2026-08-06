import { CashConstraintDiagnosis, CashConfidenceLevel } from './CashIntelligenceTypes';

export class CashConstraintDiagnosisEngine {
  public static evaluate(
    fco: number,
    fci: number,
    fcf: number,
    receivables: number,
    inventory: number,
    workingCapitalVariation: number,
    contasRelacionadas: number | null,
    confidenceLevel: CashConfidenceLevel,
    dreNetIncome?: number,
    dreEbitda?: number
  ): CashConstraintDiagnosis {
    const isBurning = fco < 0 || workingCapitalVariation < 0 || (fco + fci) < 0;

    let primaryConstraint: CashConstraintDiagnosis['primaryConstraint'] = 'NENHUMA_RESTRICAO';
    let rationale = 'A operação não apresenta restrições estruturais de caixa, gerando excedente suficiente para financiar suas atividades.';
    let severity = 'SAUDAVEL';

    if (isBurning) {
      severity = 'PRESSIONADO';
      
      const absFci = Math.abs(fci < 0 ? fci : 0);
      const absWcv = Math.abs(workingCapitalVariation < 0 ? workingCapitalVariation : 0);
      const absInventory = Math.abs(inventory);
      const absReceivables = Math.abs(receivables);
      const absRelacionadas = contasRelacionadas ? Math.abs(contasRelacionadas) : 0;
      
      // Calculate operational deficit before working capital changes as a drain
      const netIncomeVal = dreNetIncome !== undefined ? dreNetIncome : 0;
      const ebitdaVal = dreEbitda !== undefined ? dreEbitda : 0;
      const absOperationalDeficit = ebitdaVal < 0 ? Math.abs(ebitdaVal) : (netIncomeVal < 0 ? Math.abs(netIncomeVal) : (fco < 0 ? Math.abs(fco) : 0));

      interface Offender {
        name: CashConstraintDiagnosis['primaryConstraint'];
        value: number;
        priority: number;
        rationale: string;
        severity: string;
      }

      const offenders: Offender[] = [];

      if (absOperationalDeficit > 0) {
        offenders.push({
          name: 'CONSUMO_OPERACIONAL',
          value: absOperationalDeficit,
          priority: 1,
          rationale: 'A operação base é intrinsecamente consumidora de caixa, dependendo de aportes externos para girar.',
          severity: 'CRITICO'
        });
      }

      if (absInventory > 0) {
        offenders.push({
          name: 'ESTOQUES',
          value: absInventory,
          priority: 2,
          rationale: 'A expansão do ativo operacional (estoques) absorveu caixa em velocidade superior à geração operacional.',
          severity: 'RESTRITIVO'
        });
      }

      if (absReceivables > 0) {
        offenders.push({
          name: 'RECEBIVEIS',
          value: absReceivables,
          priority: 3,
          rationale: 'O alongamento do ciclo médio de recebimento ou crescimento da carteira absorveu a liquidez gerada.',
          severity: 'RESTRITIVO'
        });
      }

      if (absRelacionadas > 0) {
        offenders.push({
          name: 'PARTES_RELACIONADAS',
          value: absRelacionadas,
          priority: 4,
          rationale: 'O caixa da operação está sendo drenado para sustentar partes relacionadas ou adiantamentos não operacionais.',
          severity: 'CRITICO'
        });
      }

      if (absFci > 0) {
        offenders.push({
          name: 'CAPEX',
          value: absFci,
          priority: 5,
          rationale: 'O ritmo de reinvestimentos (CAPEX) e aquisições excede a geração operacional de caixa do exercício.',
          severity: 'RESTRITIVO'
        });
      }

      if (offenders.length > 0) {
        // Sort offenders: strictly by priority matrix (smaller priority number first)
        offenders.sort((a, b) => a.priority - b.priority);

        const primary = offenders[0];
        primaryConstraint = primary.name;
        rationale = primary.rationale;
        severity = primary.severity;
      } else {
        primaryConstraint = 'CONSUMO_OPERACIONAL';
        rationale = 'O consumo de caixa decorre de deficiência operacional primária.';
        severity = 'CRITICO';
      }
    }

    return {
      primaryConstraint,
      severity,
      rationale,
      confidenceLevel,
      sourceMetrics: {
        fco,
        fci,
        workingCapitalVariation,
        inventory,
        receivables,
        contasRelacionadas: contasRelacionadas || 0
      }
    };
  }
}
