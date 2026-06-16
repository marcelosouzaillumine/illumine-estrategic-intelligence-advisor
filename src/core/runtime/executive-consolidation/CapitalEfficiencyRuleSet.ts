import { ExecutiveAssessmentResult } from './LiquidityExecutiveAssessmentEngine';
import { CapitalEfficiencyMetrics } from './CapitalEfficiencyMetricsProvider';

export interface EfficiencyContextProfile {
  isHolding?: boolean;
  isFinancialInstitution?: boolean;
  isTreasury?: boolean;
  isInvestmentVehicle?: boolean;
  isPreparingForMA?: boolean;
  isHighGrowthPhase?: boolean;
  sector?: string;
}

export class CapitalEfficiencyRuleSet {
  public static evaluate(metrics: CapitalEfficiencyMetrics, context?: EfficiencyContextProfile): ExecutiveAssessmentResult {
    const { eficienciaPatrimonial, caixaExcedente, capitalOcioso, liquidezImediata, alavancagem } = metrics;
    const score = eficienciaPatrimonial;
    
    let healthStatus: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'NEUTRAL' | 'ATTENTION' | 'INSUFFICIENT_DATA' = 'HEALTHY';
    let primaryDriverKpi = 'Eficiência Patrimonial';
    let executiveNarrative = '';
    let primaryDriver = '';
    let managerialImplication = '';
    let priorityAction = '';

    const isSpecialContext = context?.isHolding || 
                             context?.isFinancialInstitution || 
                             context?.isTreasury || 
                             context?.isInvestmentVehicle || 
                             context?.isPreparingForMA || 
                             context?.isHighGrowthPhase ||
                             (context?.sector && ['Financial', 'Holding', 'Investment'].includes(context.sector));

    const liquidezCorrente = metrics.liquidezCorrente || 0;
    const autonomiaFinanceira = metrics.autonomiaFinanceira || 0;
    const endividamentoGeral = metrics.endividamentoGeral || 0;
    
    // Regra Constitucional v6.1.4: Contradição de tese em empresas operacionais supercapitalizadas
    const isOvercapitalizedOperatingCompany = 
      !isSpecialContext && 
      liquidezCorrente > 3 && 
      liquidezImediata > 2 && 
      autonomiaFinanceira > 70 && 
      endividamentoGeral < 20;

    if (isOvercapitalizedOperatingCompany) {
      healthStatus = 'ATTENTION';
      primaryDriverKpi = 'Capital Subutilizado';
      executiveNarrative = 'Existe elevada disponibilidade financeira e baixa alavancagem, indicando oportunidade para otimização da alocação de capital e definição de política institucional de excedentes.';
      primaryDriver = 'Capital excessivamente conservador';
      managerialImplication = 'A estrutura atual resulta em ociosidade que drena o retorno sobre o capital (ROE/ROIC).';
      priorityAction = 'Formalizar estratégia para reinvestimento, aquisições, expansão, remuneração aos acionistas ou outras formas de utilização eficiente do capital excedente.';
      // We cap the score explicitly so it's not 100
      return {
        healthStatus,
        score: Math.min(score, 80),
        primaryDriver,
        primaryDriverKpi,
        executiveNarrative,
        justification: managerialImplication,
        managerialImplication,
        priorityAction
      };
    }

    if (score >= 85) {
      if (liquidezCorrente > 3 && liquidezImediata > 2) {
        if (isSpecialContext) {
          // Permite EXCELENTE para empresas onde alta liquidez é estratégica
          healthStatus = 'EXCELLENT';
          primaryDriverKpi = 'Reserva de Capital Estratégica';
          executiveNarrative = 'A organização sustenta um nível formidável de liquidez alinhado com seu mandato estratégico, garantindo agilidade para aquisições ou distribuição.';
          primaryDriver = 'Alta disponibilidade de capital para oportunidades de mercado';
          managerialImplication = 'A estrutura atual suporta perfeitamente o perfil de atuação fiduciária ou de holding institucional.';
          priorityAction = 'Monitorar o timing ideal de mercado para o emprego da liquidez estratégica.';
        } else {
          // Fallback just in case, but usually handled by isOvercapitalizedOperatingCompany now
          healthStatus = 'ATTENTION';
          primaryDriverKpi = 'Capital Subutilizado';
          executiveNarrative = 'A robusta posição patrimonial proporciona elevada segurança financeira; entretanto, o excesso de liquidez e a baixa utilização do capital sugerem oportunidade de otimização da alocação dos recursos para maximizar geração de valor aos acionistas.';
          primaryDriver = 'Capital excessivamente conservador';
          managerialImplication = 'O capital retido excede as necessidades operacionais e obrigações de curto e longo prazo. A estrutura atual, embora sem risco de insolvência, resulta em ociosidade que drena o retorno sobre o capital (ROE/ROIC).';
          priorityAction = 'Formalizar política institucional de alocação de excedentes de caixa para otimizar rentabilidade e crescimento sustentável.';
        }
      } else if (caixaExcedente > 0) {
        healthStatus = 'HEALTHY';
        primaryDriverKpi = 'Eficiência Patrimonial';
        executiveNarrative = 'Capital bem preservado, com indícios de liquidez excedente e oportunidade de otimização da alocação estrutural.';
        primaryDriver = 'Liquidez elevada e capital ocioso parcial';
        managerialImplication = 'Os recursos estão excessivamente protegidos. Parte da liquidez não está gerando o retorno ótimo e poderia ser reinvestida na operação principal ou distribuída.';
        priorityAction = 'Formalizar política de alocação de excedentes de caixa para otimizar rentabilidade e crescimento sustentável.';
      } else {
        healthStatus = 'EXCELLENT';
        primaryDriverKpi = 'Eficiência Patrimonial';
        executiveNarrative = 'A alocação de capital da empresa demonstra eficiência e aderência à operação, garantindo o reinvestimento produtivo do capital.';
        primaryDriver = 'Alta produtividade do capital empregado';
        managerialImplication = 'A empresa maximiza o retorno sobre os recursos retidos, justificando a estrutura de capital atual e sinalizando capacidade superior para escalar o negócio.';
        priorityAction = 'Explorar novas vias de expansão utilizando a forte tração de eficiência atual.';
      }
    } else if (score >= 60) {
      healthStatus = 'HEALTHY';
      primaryDriverKpi = 'Caixa Excedente';
      executiveNarrative = 'A estrutura de capital apresenta proteção adequada, com oportunidades moderadas de otimização de liquidez e reinvestimento.';
      primaryDriver = 'Presença de caixa excedente de precaução';
      managerialImplication = 'Os recursos estão bem protegidos, mas parte da liquidez não está gerando o retorno ótimo que poderia obter caso reinvestida de forma agressiva.';
      priorityAction = 'Avaliar redução do ciclo financeiro ou direcionar excedentes para M&A ou dividendos.';
    } else if (score >= 35) {
      healthStatus = 'WARNING';
      primaryDriverKpi = 'Capital Ocioso';
      executiveNarrative = 'Identificado capital imobilizado ou liquidez ineficiente que pode estar drenando gravemente a rentabilidade patrimonial.';
      primaryDriver = 'Acúmulo de capital ocioso ou estoques de baixa rotatividade';
      managerialImplication = 'O capital retido não justifica seu custo de oportunidade, deteriorando indicadores de retorno como ROE e ROIC no médio prazo.';
      priorityAction = 'Otimizar o ciclo financeiro e revisar a política de estoques e caixa mínimo.';
    } else {
      healthStatus = 'CRITICAL';
      primaryDriverKpi = 'Eficiência Patrimonial';
      executiveNarrative = 'A alocação atual é altamente ineficiente, indicando que o patrimônio retido pode estar destruindo valor para o acionista e comprometendo o custo de capital.';
      primaryDriver = 'Forte ineficiência no uso do ativo e capital ocioso crítico';
      managerialImplication = 'A continuidade deste perfil indica inabilidade de rentabilizar recursos, aumentando a vulnerabilidade estratégica frente a concorrentes com estruturas de capital otimizadas.';
      priorityAction = 'Desmobilizar ativos improdutivos e reestruturar a base de capital operacional com urgência máxima.';
    }

    return {
      healthStatus,
      score: Math.round(score),
      primaryDriver,
      primaryDriverKpi,
      executiveNarrative,
      justification: managerialImplication, // For retro-compatibility
      managerialImplication,
      priorityAction,
      confidence: 'Alta' // Heurística confirmada via evidências cruzadas
    };
  }
}
