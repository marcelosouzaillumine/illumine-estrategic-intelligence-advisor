import { ScenarioShock } from './ScenarioTypes';
import { ConsolidatedFinancialInput, FinancialStatementLine } from '../../../capabilities/financial/runtime/consolidated/types';

export class InstitutionalShockSimulator {
  /**
   * Transforma inputs hipotéticos em modificadores matemáticos estritos
   * sobre uma cópia (snapshot) do input contábil.
   */
  static applyShocks(snapshot: ConsolidatedFinancialInput, shocks: ScenarioShock[]): ConsolidatedFinancialInput {
    // Como snapshot já foi deep-cloned no Builder, podemos mutar com segurança.
    for (const shock of shocks) {
      if (shock.type === 'REVENUE_DROP') {
         this.applyRevenueDrop(snapshot, shock.targetEntityId, shock.magnitude);
      }
      if (shock.type === 'LIQUIDITY_CRISIS') {
         this.applyLiquidityCrisis(snapshot, shock.targetEntityId, shock.magnitude);
      }
      if (shock.type === 'SUBSIDIARY_COLLAPSE') {
         this.applyCollapse(snapshot, shock.targetEntityId);
      }
      // Outros choques podem ser implementados incrementalmente...
    }
    return snapshot;
  }

  private static applyRevenueDrop(snapshot: ConsolidatedFinancialInput, targetEntityId: string, dropPercentage: number) {
    const factor = 1 - dropPercentage;
    const targetEntities = targetEntityId === 'GROUP_LEVEL' 
      ? snapshot.dreByEntity 
      : Object.fromEntries(Object.entries(snapshot.dreByEntity).filter(([id]) => id === targetEntityId));
    
    for (const entityId of Object.keys(targetEntities)) {
      const dre = snapshot.dreByEntity[entityId];
      dre.forEach((line: FinancialStatementLine) => {
        if (line.category === 'Receita' || line.accountId.startsWith('3.')) {
          line.value = line.value * factor;
        }
      });
    }
  }

  private static applyLiquidityCrisis(snapshot: ConsolidatedFinancialInput, targetEntityId: string, crisisMagnitude: number) {
    const factor = 1 - crisisMagnitude;
    const targetEntities = targetEntityId === 'GROUP_LEVEL' 
      ? snapshot.bpByEntity 
      : Object.fromEntries(Object.entries(snapshot.bpByEntity).filter(([id]) => id === targetEntityId));
    
    for (const entityId of Object.keys(targetEntities)) {
      const bp = snapshot.bpByEntity[entityId];
      bp.forEach((line: FinancialStatementLine) => {
        // Reduz disponibilidades de caixa (Ativo Circulante)
        if (line.accountId.startsWith('1.1.1') || line.category === 'Caixa') {
          line.value = line.value * factor;
        }
      });
    }
  }

  private static applyCollapse(snapshot: ConsolidatedFinancialInput, targetEntityId: string) {
    if (targetEntityId === 'GROUP_LEVEL') return; // Um grupo não colapsa de forma programada em um único choque, são as entidades que colapsam.

    if (snapshot.dreByEntity[targetEntityId]) {
      snapshot.dreByEntity[targetEntityId].forEach(l => l.value = 0);
    }
    if (snapshot.bpByEntity[targetEntityId]) {
      // Zera ativos, mas mantem passivos para gerar o stress na Holding
      snapshot.bpByEntity[targetEntityId].forEach(l => {
        if (l.type === 'ativo' || l.accountId.startsWith('1.')) l.value = 0;
      });
    }
  }
}
