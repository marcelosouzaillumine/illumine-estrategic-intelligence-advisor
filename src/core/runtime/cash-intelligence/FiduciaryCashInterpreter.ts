import { FiduciaryCashNarrative, FiduciaryLiquidityClassification, CashFlowReconciliationOutput, InstitutionalContinuityAssessment, LegacyOperationalSustainabilityAssessment } from './CashIntelligenceTypes';

export class FiduciaryCashInterpreter {
  /**
   * Produz narrativa e parecer fiduciário estruturado para relatórios e conselho.
   */
  public static interpret(
    classification: FiduciaryLiquidityClassification,
    isArtificial: boolean,
    reconciliation: CashFlowReconciliationOutput,
    sustainability: LegacyOperationalSustainabilityAssessment,
    continuity: InstitutionalContinuityAssessment,
    isEarlyStage?: boolean
  ): FiduciaryCashNarrative {
    const fiduciaryWarnings: string[] = [
      'Projeções de runway representam estimativas de sobrevivência institucional sob condições históricas e não oferecem garantia de continuidade futura.'
    ];
    const blockedInterpretations: string[] = [];
    const causalFindings: string[] = [];
    const institutionalImplications: string[] = [];

    // Helper de limpeza de termos proibidos e restrições early-stage
    const cleanText = (text: string): string => {
      if (!text) return '';
      let cleaned = text;
      
      // Regra: Impedir termos proibidos
      cleaned = cleaned.replace(/colapso irreversivel/gi, 'estresse de liquidez relevante');
      cleaned = cleaned.replace(/colapso irreversível/gi, 'estresse de liquidez relevante');
      cleaned = cleaned.replace(/insolvencia definitiva/gi, 'elevado risco de continuidade');
      cleaned = cleaned.replace(/insolvência definitiva/gi, 'elevado risco de continuidade');
      cleaned = cleaned.replace(/liquidez confortavel/gi, 'liquidez momentaneamente estável');
      cleaned = cleaned.replace(/liquidez confortável/gi, 'liquidez momentaneamente estável');
      
      // Regra: Proteção para Early-Stage
      if (isEarlyStage) {
        cleaned = cleaned.replace(/diagnóstico de colapso/gi, 'curva de escala em maturação');
        cleaned = cleaned.replace(/diagnostico de colapso/gi, 'curva de escala em maturação');
        cleaned = cleaned.replace(/colapso de/gi, 'fase de scale-up de');
        cleaned = cleaned.replace(/colapso/gi, 'maturação de escala');
        cleaned = cleaned.replace(/insolvência estrutural/gi, 'necessidade de aporte complementar para formação de escala');
        cleaned = cleaned.replace(/insolvencia estrutural/gi, 'necessidade de aporte complementar para formação de escala');
        cleaned = cleaned.replace(/deterioração irreversível/gi, 'intensidade de capital típica do estágio operacional');
        cleaned = cleaned.replace(/deterioracao irreversivel/gi, 'intensidade de capital típica do estágio operacional');
      }
      
      return cleaned;
    };

    // 1. Reconciliação e Integridade Contábil (Fatos vs Limitações)
    if (!reconciliation.isReconcilable) {
      fiduciaryWarnings.push('Ruptura de consistência matemática entre DFC e Balanço Patrimonial.');
      blockedInterpretations.push('HIGH_CONFIDENCE_ANALYSIS', 'OPERATIONAL_SUSTAINABILITY', 'HEALTHY_LIQUIDITY');
      causalFindings.push('Divergência relevante nos registros de fluxo de caixa em relação às contas patrimoniais.');
      institutionalImplications.push('Imposição de auditoria contábil externa emergencial.');
    } else if (reconciliation.reconciliationStatus === 'RESTRICTED') {
      fiduciaryWarnings.push('Divergência material na reconciliação patrimonial limita o grau de certeza das conclusões.');
      blockedInterpretations.push('HIGH_CONFIDENCE_ANALYSIS');
      causalFindings.push('Desvio contábil moderado na conciliação BP x DFC.');
    }

    // 2. Dinâmica de Liquidez e Dependência Externa (Causas e Bloqueios)
    if (classification === 'CONTINUITY_RISK') {
      blockedInterpretations.push('HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH', 'OPERATIONAL_SUSTAINABILITY');
      fiduciaryWarnings.push('Consumo simultâneo de caixa operacional e saída líquida de financiamento.');
      causalFindings.push('Drenagem combinada das atividades operacionais e financeiras de capital.');
      institutionalImplications.push('Alerta vermelho de interrupção operacional e colapso de continuidade.');
    } else if (classification === 'ARTIFICIAL_LIQUIDITY' || isArtificial) {
      blockedInterpretations.push('HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH', 'OPERATIONAL_SUSTAINABILITY');
      fiduciaryWarnings.push('A estabilidade de liquidez observada é temporária e artificial, sustentada por captação externa.');
      causalFindings.push('Injeções recorrentes de capital societário ou bancário mascaram queima de caixa operacional primária.');
      institutionalImplications.push('Vulnerabilidade crítica caso haja cessação de aportes de sócios ou rolagem de dívidas.');
    } else if (classification === 'LIQUIDITY_DEPENDENT') {
      blockedInterpretations.push('SUSTAINABLE_GROWTH', 'OPERATIONAL_SUSTAINABILITY');
      fiduciaryWarnings.push('A operação não gera caixa suficiente para cobrir seus custos diretos primários.');
      causalFindings.push('Dependência estrutural de captação ou financiamentos externos para manutenção do ciclo operacional básico.');
      institutionalImplications.push('Necessidade contínua de suporte financeiro para evitar descapitalização do giro.');
    }

    // 3. Horizonte de Sobrevivência e Fragilidade (Limitações de Simulação)
    if (continuity.continuityRisk === 'CRITICAL' || continuity.continuityRisk === 'HIGH') {
      fiduciaryWarnings.push(`Horizonte de sobrevivência operacional comprimido para apenas ${continuity.projectedRunwayMonths} meses.`);
      causalFindings.push('Taxa de consumo de caixa excede as disponibilidades líquidas e de reserva da entidade.');
      institutionalImplications.push('Bloqueio compulsório de distribuições de dividendos, novos Capex não-essenciais e redução de custos fixos.');
    }

    if (sustainability.selfFinancingCapacity === 'HIGH') {
      causalFindings.push('Capacidade robusta de autofinanciamento a partir de geração operacional líquida.');
      institutionalImplications.push('Independência estrutural em relação a aportes societários ou endividamento adicional no curto prazo.');
    } else {
      blockedInterpretations.push('HIGH_SELF_FINANCING');
    }

    // 4. Composição da Narrativa Sobria e Sem Falsas Certezas
    let executiveNarrative = '';
    let fiduciaryOpinion = '';

    if (classification === 'OPERATIONAL_SUSTAINABLE' || classification === 'STRATEGIC_EXPANSION') {
      executiveNarrative = 'A dinâmica institucional de geração e sustentação de caixa encontra-se preservada sob a óptica fiduciária, demonstrando autonomia operacional e capacidade de autofinanciamento.';
      fiduciaryOpinion = 'Parecer Favorável. Recomenda-se a continuidade sob as diretrizes de governança de Capex aprovadas.';
    } else if (classification === 'PARTIALLY_DEPENDENT') {
      executiveNarrative = 'Geração operacional de caixa positiva, mas acoplada a dependência parcial de fontes de financiamento externo para cobrir passivos ou investimentos.';
      fiduciaryOpinion = 'Parecer Favorável com Ressalvas. Exige-se monitoramento do grau de endividamento financeiro.';
    } else if (classification === 'ARTIFICIAL_LIQUIDITY' || isArtificial) {
      executiveNarrative = 'Deterioração severa na matriz de geração de caixa. A liquidez disponível é mantida artificialmente por captações externas, ocultando um consumo operacional persistente de caixa.';
      fiduciaryOpinion = 'Parecer Adverso. Recomenda-se o bloqueio de distribuições e a suspensão preventiva de novos Capex operacionais não-emergenciais.';
    } else {
      executiveNarrative = 'Operação deficitária em caixa com consumo de capital estrutural, exigindo captação e suporte externo recorrente para manter pagamentos operacionais básicos.';
      fiduciaryOpinion = 'Parecer de Atenção Fiduciária. Exige-se plano estruturado de readequação operacional e saneamento do ciclo de caixa.';
    }

    // Adiciona restrição se a reconciliação estiver restrita ou bloqueada
    if (reconciliation.restrictsOptimisticInterpretations) {
      blockedInterpretations.push('HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH');
      fiduciaryWarnings.push('Divergência na reconciliação de caixa impede qualquer atestado de liquidez saudável.');
    }

    return {
      executiveNarrative: cleanText(executiveNarrative),
      fiduciaryOpinion: cleanText(fiduciaryOpinion),
      fiduciaryWarnings: fiduciaryWarnings.map(cleanText),
      blockedInterpretations: Array.from(new Set(blockedInterpretations)),
      causalFindings: causalFindings.map(cleanText),
      institutionalImplications: institutionalImplications.map(cleanText)
    };
  }
}
