import { ShareholderDependency, CashConfidenceLevel } from './CashIntelligenceTypes';

export class ShareholderDependencyEngine {
  public static evaluate(
    fco: number,
    equityFunding: number,
    confidenceLevel: CashConfidenceLevel
  ): ShareholderDependency {
    const isBurning = fco < 0;
    const absBurn = Math.abs(fco < 0 ? fco : 0);
    
    const shareholderDependencyRatio = absBurn > 0 && equityFunding > 0 
      ? (equityFunding / absBurn)
      : 0;
      
    const capitalizationCoverageRatio = shareholderDependencyRatio;

    let classification: ShareholderDependency['classification'] = 'AUTONOMA';
    let rationale = 'A companhia financiou suas operações primariamente com geração própria de caixa.';

    if (equityFunding > 0) {
      if (isBurning) {
        if (shareholderDependencyRatio > 1.5) {
          classification = 'DEPENDENCIA_CRITICA';
          rationale = 'A operação é excessivamente dependente de injeções de capital dos sócios, que financiaram o consumo de caixa com larga margem.';
        } else if (shareholderDependencyRatio >= 1.0) {
          classification = 'ALTA_DEPENDENCIA';
          rationale = 'A manutenção da liquidez do exercício foi integralmente suportada por aportes societários.';
        } else if (shareholderDependencyRatio >= 0.5) {
          classification = 'MODERADA_DEPENDENCIA';
          rationale = 'A operação contou com forte apoio dos sócios para cobrir déficits de liquidez.';
        } else {
          classification = 'BAIXA_DEPENDENCIA';
          rationale = 'Houve aportes societários, mas que representam fração menor do consumo total de caixa.';
        }
      } else {
        classification = 'AUTONOMA';
        rationale = 'Aportes societários ocorreram, mas a operação é geradora de caixa e não dependeu destes aportes para sobrevivência básica.';
      }
    } else {
      if (isBurning) {
        classification = 'DEPENDENCIA_CRITICA';
        rationale = 'A operação consumiu caixa sem suporte societário proporcional no período, evidenciando pressão por fontes externas ou queima de reservas.';
      }
    }

    const autossuficienciaFinanceiraRatio = isBurning && equityFunding > 0
      ? (equityFunding / absBurn)
      : null;

    const autossuficienciaFinanceiraDisplay = autossuficienciaFinanceiraRatio !== null
      ? `${autossuficienciaFinanceiraRatio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`
      : 'Não Aplicável';

    let dependenciaCapitalExternoLabel = 'Nenhuma';
    if (isBurning) {
      if (shareholderDependencyRatio >= 1.0) {
        dependenciaCapitalExternoLabel = 'Crítica';
      } else if (shareholderDependencyRatio >= 0.5) {
        dependenciaCapitalExternoLabel = 'Elevada';
      } else if (shareholderDependencyRatio >= 0.2) {
        dependenciaCapitalExternoLabel = 'Moderada';
      } else if (shareholderDependencyRatio > 0) {
        dependenciaCapitalExternoLabel = 'Baixa';
      } else {
        dependenciaCapitalExternoLabel = 'Crítica';
      }
    } else {
      if (equityFunding > 0) {
        dependenciaCapitalExternoLabel = 'Baixa';
      } else {
        dependenciaCapitalExternoLabel = 'Nenhuma';
      }
    }

    return {
      shareholderDependencyRatio,
      capitalizationCoverageRatio,
      classification,
      rationale,
      confidenceLevel,
      sourceMetrics: {
        fco,
        equityFunding
      },
      autossuficienciaFinanceiraRatio,
      autossuficienciaFinanceiraDisplay,
      dependenciaCapitalExternoLabel
    };
  }
}
