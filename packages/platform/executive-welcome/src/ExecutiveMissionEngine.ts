import { ExecutiveMissionContract } from '@illumine/executive-contracts';

export class ExecutiveMissionEngine {
  public static generateMission(role: 'CLIENT' | 'ADVISOR' | 'BOARD' | 'PARTNER' | 'MASTER_ADMIN'): ExecutiveMissionContract {
    let missionText = '';
    let outcome = '';
    let category: 'LIQUIDITY' | 'MARGIN' | 'RISK_MITIGATION' | 'GOVERNANCE' = 'MARGIN';

    if (role === 'CLIENT') {
      missionText = 'Hoje sua missão é preservar a liquidez da organização e concluir duas decisões estratégicas pendentes.';
      outcome = 'EBITDA Preservado: R$ 450.000,00';
      category = 'LIQUIDITY';
    } else if (role === 'ADVISOR') {
      missionText = 'Sua missão é orientar a repactuação do contrato de TI do cliente Alfa.';
      outcome = 'Aprovação de Recomendação fiduciária';
      category = 'MARGIN';
    } else {
      missionText = 'Garantir conformidade governamental e deliberação de conselho.';
      outcome = 'Chancela de Resolução do Conselho';
      category = 'GOVERNANCE';
    }

    return {
      missionId: `msn-${role}-${Date.now()}`,
      dailyMissionText: missionText,
      targetOutcome: outcome,
      priorityCategory: category
    };
  }
}
