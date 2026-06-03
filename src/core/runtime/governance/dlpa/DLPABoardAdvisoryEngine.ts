export class DLPABoardAdvisoryEngine {
  static evaluate(
    endingEquity: number,
    formationQuality: string,
    consumptionValue: number, // erosion ratio (loss / capitalSocial)
    netIncome: number,
    distributionCapacity: string,
    capitalPreservationRatio: number,
    shareholderCapitalProtectionNarrative: string
  ) {
    // Point 1: Formação Patrimonial
    let p1 = `1. Formação Patrimonial: O patrimônio líquido final de R$ ${endingEquity.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} apresenta-se estruturado sob a classificação fiduciária "${formationQuality}". `;
    if (formationQuality === 'Dependente de Capitalização') {
      p1 += `A base patrimonial é mantida positiva primordialmente devido a aportes externos realizados pelos acionistas/sócios, e não por acúmulo de lucros operacionais.`;
    } else {
      p1 += `A base patrimonial reflete uma estrutura com geração orgânica de riqueza acumulada ao longo dos ciclos.`;
    }

    // Point 2: Capital Consumido
    let p2 = '';
    if (consumptionValue > 0) {
      p2 = `2. Capital Consumido: A absorção histórica de prejuízos consumiu aproximadamente ${(consumptionValue * 100).toFixed(1).replace('.', ',')}% do capital originalmente aportado pelos sócios.`;
    } else {
      p2 = `2. Capital Consumido: Não há consumo de capital por prejuízos acumulados, demonstrando que toda a base patrimonial original aportada pelos sócios permanece economicamente preservada.`;
    }

    // Point 3: Proteção do Capital dos Sócios
    const p3 = `3. Proteção do Capital dos Sócios: ${shareholderCapitalProtectionNarrative}`;

    // Point 4: Capacidade Distributiva
    let p4 = `4. Capacidade Distributiva: A capacidade distributiva de lucros está classificada como "${distributionCapacity}". `;
    if (distributionCapacity === 'Livre') {
      p4 += `Inexistência de impedimentos fiduciários, permitindo distribuições ordinárias e extraordinárias.`;
    } else if (distributionCapacity === 'Bloqueada') {
      p4 += `A distribuição está legal e fiduciariamente bloqueada até a absorção integral das perdas acumuladas.`;
    } else if (distributionCapacity === 'Condicionada') {
      p4 += `A distribuição está condicionada à compensação prévia dos prejuízos acumulados com lucros futuros.`;
    } else {
      p4 += `Há restrições parciais que limitam a flexibilidade de distribuição de dividendos no exercício.`;
    }

    // Point 5: Prioridade do Conselho
    let p5 = `5. Prioridade do Conselho: `;
    if (endingEquity <= 0) {
      p5 += `O Conselho deve pautar com máxima urgência o plano de capitalização imediata para restaurar a solvência patrimonial e a continuidade operacional da companhia.`;
    } else if (netIncome <= 0 || consumptionValue >= 0.25 || distributionCapacity === 'Bloqueada') {
      p5 += `O Conselho deve priorizar a recuperação da rentabilidade e a recomposição da integridade do capital próprio, suspendendo novas propostas de distribuição e focando no estancamento da erosão operacional.`;
    } else {
      p5 += `O Conselho deve priorizar a eficiência na alocação do caixa excedente, a consolidação de reservas estratégicas e a sustentação do payout equilibrado.`;
    }

    const narrative = `${p1}\n\n${p2}\n\n${p3}\n\n${p4}\n\n${p5}`;

    return {
      value: narrative,
      classification: 'Parecer do Conselho',
      narrative,
      rationale: 'Consolidação textual estruturada nos 5 pilares de governança de capital.',
      sourceMetrics: {
        endingEquity,
        formationQuality,
        consumptionValue,
        netIncome,
        distributionCapacity,
        capitalPreservationRatio,
        shareholderCapitalProtectionNarrative
      },
      confidenceLevel: 'HIGH'
    };
  }
}
