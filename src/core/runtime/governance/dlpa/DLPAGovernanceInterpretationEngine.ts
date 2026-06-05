export class DLPAGovernanceInterpretationEngine {
  static evaluate(capitalDependency: number, formationQuality: string, distributionCapacity: string, lucrosPrejuizos: number = 0) {
    let classification = 'Capital Autossustentado';
    let narrative = 'O patrimônio é autossustentado pela geração interna de caixa e acumulação de resultados consistentes.';

    if (capitalDependency > 1.5 && formationQuality === 'Dependente de Capitalização') {
      classification = 'Estrutura de Capital em Formação';
      narrative = 'O patrimônio líquido permanece positivo em razão da capitalização dos sócios, e não da geração acumulada de resultados.';
    } else if (capitalDependency > 1.2 && distributionCapacity === 'Bloqueada') {
      classification = 'Governança de Capital Restrita';
      narrative = 'A governança enfrenta restrições críticas decorrentes da inexistência de geração distribuível e dependência do capital aportado.';
    } else if (distributionCapacity === 'Restrita' || distributionCapacity === 'Condicionada') {
      classification = 'Capital em Reconstrução';
      narrative = 'Patrimônio em fase de recomposição, absorvendo prejuízos ou consolidando ganhos após perdas históricas.';
    }

    let riskToShareholders = 'Risco controlado. A base de capital social própria está preservada e suportada pela geração operacional de resultados.';
    if (capitalDependency > 1.0 || lucrosPrejuizos < 0) {
      riskToShareholders = 'O patrimônio líquido permanece positivo, porém a geração histórica de resultados não foi suficiente para preservar integralmente o capital aportado pelos sócios. A continuidade da destruição de valor poderá exigir novas capitalizações para sustentar a operação e preservar a solvência patrimonial.';
    }

    let shareholderCapitalProtection = 'A companhia mantém integridade patrimonial completa, com capital totalmente preservado e ausência de consumo por perdas acumuladas.';
    let recoveryThesis = 'Não há tese de recuperação necessária devido à integridade da estrutura patrimonial.';

    if (lucrosPrejuizos < 0) {
      shareholderCapitalProtection = 'A companhia preserva formalmente sua solvência patrimonial, porém já consumiu mais da metade do capital originalmente aportado pelos sócios. A continuidade da geração de prejuízos poderá exigir novas capitalizações para evitar deterioração adicional da base patrimonial.';
      recoveryThesis = 'A recomposição patrimonial dependerá prioritariamente da reversão da geração de prejuízos operacionais, da conversão sustentável da rentabilidade futura em patrimônio líquido acumulado e da retenção integral dos lucros futuros até a absorção completa das perdas acumuladas.';
    }

    return {
      value: classification,
      classification,
      narrative,
      riskToShareholders,
      shareholderCapitalProtection,
      recoveryThesis,
      rationale: `Análise cruzada de Dependência (${capitalDependency}), Qualidade da Formação (${formationQuality}) e Capacidade Distributiva (${distributionCapacity}).`,
      sourceMetrics: { capitalDependency, formationQuality, distributionCapacity, lucrosPrejuizos },
      confidenceLevel: 'HIGH'
    };
  }
}
