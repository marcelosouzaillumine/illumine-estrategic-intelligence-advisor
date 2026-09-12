export interface CrossStatementPropagationInput {
  lucroLiquido: number;
  ebitda: number;
  fco: number; // Fluxo de Caixa Operacional
  liquidezReal: number; // BP
  runway: number; // DFC (meses)
  capitalConsumido: number; // DLPA
  capitalConsumedPercent?: number; // DLPA
  dlpaCapitalStatus?: string; // DLPA
}

export interface CrossStatementTensionEvidence {
  netIncome?: number;
  fco?: number;
  capitalConsumed?: number;
  runwayMonths?: number;
}

export interface CrossStatementTension {
  chain: 
    | 'DRE_DFC_DLPA' 
    | 'DFC_CONTINUITY_PRESSURE' 
    | 'CAPITAL_DESTRUCTION' 
    | 'LIQUIDITY_COLLAPSE'
    | 'DRE_DFC'
    | 'DRE_DLPA';
  category: 
    | 'VALUE_DESTRUCTION_CHAIN' 
    | 'CONTINUITY_RISK' 
    | 'CAPITAL_IMPAIRMENT'
    | 'OPERATIONAL_PRESSURE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  narrative: string;
  evidence: CrossStatementTensionEvidence;
  source: 'CANONICAL_PROPAGATION' | 'SYNTHETIC_GUARD';
}

export interface CrossStatementPropagationResult {
  hasTension: boolean;
  tensions: CrossStatementTension[];
}

export class CrossStatementPropagationEngine {
  /**
   * Detecta tensões e cadeias de propagação numéricas entre os relatórios, 
   * devolvendo entidades fiduciárias estritas.
   */
  public static detect(input: CrossStatementPropagationInput): CrossStatementPropagationResult {
    const tensions: CrossStatementTension[] = [];

    const capitalConsumedPct = input.capitalConsumedPercent !== undefined 
      ? input.capitalConsumedPercent 
      : (input.capitalConsumido > 0 ? 100 : 0);

    // Regra obrigatória: DRE negativa + DFC operacional negativo ou nulo + DLPA com capital consumido
    if (input.lucroLiquido < 0 && input.fco <= 0 && capitalConsumedPct > 0) {
      tensions.push({
        chain: 'DRE_DFC_DLPA',
        category: 'VALUE_DESTRUCTION_CHAIN',
        severity: 'CRITICAL',
        narrative: 'O prejuízo econômico do exercício pressionou a geração operacional de caixa e reduziu a preservação do capital aportado pelos sócios.',
        evidence: {
          netIncome: input.lucroLiquido,
          fco: input.fco,
          capitalConsumed: input.capitalConsumido
        },
        source: 'CANONICAL_PROPAGATION'
      });
    }

    if (input.fco <= 0 && input.runway < 6 && input.runway >= 0) {
      tensions.push({
        chain: 'DFC_CONTINUITY_PRESSURE',
        category: 'CONTINUITY_RISK',
        severity: input.runway < 3 ? 'CRITICAL' : 'HIGH',
        narrative: 'A queima sistemática de caixa com runway crítico eleva substancialmente o risco de continuidade a ciclo imediato.',
        evidence: {
          fco: input.fco,
          runwayMonths: input.runway
        },
        source: 'CANONICAL_PROPAGATION'
      });
    }

    if (input.lucroLiquido < 0 && capitalConsumedPct > 50) {
      tensions.push({
        chain: 'CAPITAL_DESTRUCTION',
        category: 'CAPITAL_IMPAIRMENT',
        severity: 'HIGH',
        narrative: 'Prejuízo recorrente consumindo proporção severa do patrimônio líquido histórico.',
        evidence: {
          netIncome: input.lucroLiquido,
          capitalConsumed: input.capitalConsumido
        },
        source: 'CANONICAL_PROPAGATION'
      });
    }

    if (input.liquidezReal < 0 && input.runway < 3) {
      tensions.push({
        chain: 'LIQUIDITY_COLLAPSE',
        category: 'CONTINUITY_RISK',
        severity: 'CRITICAL',
        narrative: 'Falta de liquidez imediata no BP agravada por um runway virtualmente zerado na DFC.',
        evidence: {
          fco: input.fco,
          runwayMonths: input.runway
        },
        source: 'CANONICAL_PROPAGATION'
      });
    }

    if (input.lucroLiquido > 0 && input.fco <= 0) {
      tensions.push({
        chain: 'DRE_DFC',
        category: 'OPERATIONAL_PRESSURE',
        severity: 'MEDIUM',
        narrative: 'Lucro contábil não convertido em caixa (Baixa Qualidade de Conversão).',
        evidence: {
          netIncome: input.lucroLiquido,
          fco: input.fco
        },
        source: 'CANONICAL_PROPAGATION'
      });
    }

    if ((input.lucroLiquido < 0 || input.ebitda < 0) && input.fco <= 0 && capitalConsumedPct <= 0) {
      tensions.push({
        chain: 'DRE_DFC',
        category: 'OPERATIONAL_PRESSURE',
        severity: 'MEDIUM',
        narrative: 'A queima operacional de caixa está sendo acelerada pelo prejuízo econômico/operacional.',
        evidence: {
          netIncome: input.lucroLiquido,
          fco: input.fco
        },
        source: 'CANONICAL_PROPAGATION'
      });
    }

    if (input.lucroLiquido < 0 && capitalConsumedPct <= 0) {
      tensions.push({
        chain: 'DRE_DLPA',
        category: 'VALUE_DESTRUCTION_CHAIN',
        severity: 'LOW',
        narrative: 'Prejuízo absorvido por reservas, sem afetar capital social direto, mas deteriorando o valor global.',
        evidence: {
          netIncome: input.lucroLiquido,
          capitalConsumed: input.capitalConsumido
        },
        source: 'CANONICAL_PROPAGATION'
      });
    }

    return {
      hasTension: tensions.length > 0,
      tensions
    };
  }
}
