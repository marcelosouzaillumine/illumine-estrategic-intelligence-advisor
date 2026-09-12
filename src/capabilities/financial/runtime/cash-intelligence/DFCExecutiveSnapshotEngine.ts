import { RunwayClassificationEngine } from './RunwayClassificationEngine';

export interface DFCExecutiveSnapshot {
  geraCaixa: boolean;
  runway: string;
  dependenciaSocietaria: string;
  maiorRisco: string;
  acaoPrioritaria: string;
}

export class DFCExecutiveSnapshotEngine {
  /**
   * Constrói a Página Zero da DFC, entregando os 5 pontos cruciais instantâneos
   */
  public static buildSnapshot(
    fco: number,
    runwayMonths: number,
    dependencyCritical: boolean,
    primaryConstraint: string
  ): DFCExecutiveSnapshot {
    
    const geraCaixa = fco > 0;
    const safeRunway = typeof runwayMonths === 'number' && !isNaN(runwayMonths) ? runwayMonths : 0;
    const runwayClass = RunwayClassificationEngine.classify(safeRunway);
    const runwayLabel = RunwayClassificationEngine.getLabel(runwayClass);

    let maiorRisco = '';
    let acaoPrioritaria = '';

    if (!geraCaixa) {
      maiorRisco = 'Queima Operacional de Caixa Contínua';
      acaoPrioritaria = 'Estancar sangria operacional cortando despesas fixas';
    } else if (dependencyCritical) {
      maiorRisco = 'Falsa Autonomia (Dependência de Aportes)';
      acaoPrioritaria = 'Reestruturar margens para independência financeira';
    } else {
      maiorRisco = primaryConstraint || 'Ciclo Financeiro Longo';
      acaoPrioritaria = 'Otimizar giro e recebimentos para acelerar a conversão de liquidez';
    }

    return {
      geraCaixa,
      runway: `${safeRunway.toFixed(1)} meses (${runwayLabel})`,
      dependenciaSocietaria: dependencyCritical ? 'Crítica (Sobrevivência atrelada a aportes)' : 'Saudável (Operação Autossuficiente)',
      maiorRisco,
      acaoPrioritaria
    };
  }
}
