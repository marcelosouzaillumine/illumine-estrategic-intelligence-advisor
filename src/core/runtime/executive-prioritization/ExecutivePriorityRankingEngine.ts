// src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts

import { FiduciaryPriorityCategory, FiduciaryPriorityEscalationEngine } from './FiduciaryPriorityEscalationEngine';
import { ExecutiveDomain } from './BoardDecisionGovernanceValidator';

export interface RatedRecommendation {
  title: string;
  category: FiduciaryPriorityCategory;
  domain: ExecutiveDomain;
  origin: string;
  problem: string;
  action: string;
  responsible: string;
  prazoRecomendadoLabel: string;
  impactLabel: string;
  urgencyLabel: string;
  impactScore: number;
  urgencyScore: number;
  effortScore: number;
  eps: number;
  classification: string;
  consequenciaInacao: string;
  impactoEsperado: string;
  evidence: string[];
}

export class ExecutivePriorityRankingEngine {
  public static rank(report: any): RatedRecommendation[] {
    const list: RatedRecommendation[] = [];
    if (!report) return list;

    // Helper to format values
    const fmt = (v: any) => {
      const num = Number(v);
      if (isNaN(num)) return 'R$ 0,00';
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Extract core parameters
    const netProfit = report.metrics?.netProfit ?? report.metrics?.netIncome ?? 0;
    const ebitda = report.metrics?.ebitda ?? report.cashSustainabilityReport?.sourceMetrics?.ebitda ?? 0;
    const netRevenue = report.metrics?.netRevenue ?? report.metrics?.receitaLiquida ?? 0;
    const fco = report.metrics?.fco ?? report.cashSustainabilityReport?.sourceMetrics?.fco ?? 0;
    
    const runwayMonths = report.cashSustainabilityReport?.runwayMonths 
      ?? report.metrics?.fiduciary?.cashRunwayInstitucional?.months
      ?? report.continuityRisk?.projectedRunwayMonths 
      ?? 0;

    const lucrosPrejuizos = report.capitalGovernanceReport?.retainedEarnings 
      ?? report.capitalGovernanceReport?.lucrosPrejuizos 
      ?? report.executiveLayer?.consumedCapital?.value 
      ?? 0;

    const capitalSocial = report.capitalGovernanceReport?.capitalSocial 
      ?? report.executiveLayer?.consumedCapital?.capitalSocial
      ?? 1.0;

    const cqs = report.technicalAppendix?.cqs ?? report.scores?.governance ?? 0;
    const complianceStatus = report.status || 'COMPLETE';
    const hasWarnings = (report.fiduciaryWarnings?.length ?? 0) > 0;

    // 1. Candidate: Escalar Receita até Break-even
    const breakEvenGap = report.metrics?.dreInsights?.breakEvenAnalysis?.breakEvenGap?.value 
      ?? report.metrics?.dreInsights?.breakEvenGap 
      ?? 0;
    
    if (netProfit < 0 || breakEvenGap > 0) {
      const impactScore = 95;
      const urgencyScore = runwayMonths > 0 && runwayMonths < 3 ? 95 : 85;
      const effortScore = 40;
      const eps = (impactScore * 0.50) + (urgencyScore * 0.35) + ((100 - effortScore) * 0.15);

      list.push({
        title: 'Escalar Receita até Break-even',
        category: 'Rentabilidade',
        domain: 'Estratégia',
        origin: 'DRE',
        problem: 'A operação do negócio registra prejuízo líquido e não atingiu o ponto de equilíbrio operacional.',
        action: 'Expandir o esforço comercial e aquisição de clientes para superar a lacuna de ponto de equilíbrio.',
        responsible: 'Diretor Comercial / CEO',
        prazoRecomendadoLabel: 'Médio Prazo',
        impactLabel: 'Muito Alto',
        urgencyLabel: urgencyScore >= 90 ? 'Imediata' : 'Curto Prazo',
        impactScore,
        urgencyScore,
        effortScore,
        eps,
        classification: this.getClassification(eps),
        consequenciaInacao: 'Erosão contínua do capital social, dependência crônica de aporte dos sócios e risco de insolvência.',
        impactoEsperado: 'Estabilização de resultados operacionais e neutralidade na queima de caixa.',
        evidence: [
          `Resultado Líquido: ${fmt(netProfit)}`,
          `Lacuna de Break-even: ${fmt(breakEvenGap)}`
        ]
      });
    }

    // 2. Candidate: Reduzir Estrutura Fixa
    if (netProfit < 0 || Math.abs(ebitda) > 0) {
      const impactScore = 92;
      const urgencyScore = 85;
      const effortScore = 30;
      const eps = (impactScore * 0.50) + (urgencyScore * 0.35) + ((100 - effortScore) * 0.15);

      list.push({
        title: 'Reduzir Estrutura Fixa',
        category: 'Rentabilidade',
        domain: 'Custos',
        origin: 'DRE',
        problem: 'Estrutura operacional fixa e despesas administrativas (Overhead) incompatíveis com a receita atual.',
        action: 'Promover corte seletivo em despesas administrativas e readequação de equipe operacional.',
        responsible: 'CFO / Diretoria Executiva',
        prazoRecomendadoLabel: 'Curto Prazo',
        impactLabel: 'Muito Alto',
        urgencyLabel: 'Curto Prazo',
        impactScore,
        urgencyScore,
        effortScore,
        eps,
        classification: this.getClassification(eps),
        consequenciaInacao: 'Queima crônica de recursos patrimoniais por ineficiência estrutural.',
        impactoEsperado: 'Redução imediata do ponto de equilíbrio e preservação das margens.',
        evidence: [
          `Resultado Operacional (EBITDA): ${fmt(ebitda)}`,
          `Prejuízo Líquido: ${fmt(netProfit)}`
        ]
      });
    }

    // 3. Candidate: Preservar Liquidez Operacional
    if (fco < 0 || (runwayMonths > 0 && runwayMonths < 6)) {
      const impactScore = 85;
      const urgencyScore = 92;
      const effortScore = 20;
      const eps = (impactScore * 0.50) + (urgencyScore * 0.35) + ((100 - effortScore) * 0.15);

      list.push({
        title: 'Preservar Liquidez Operacional',
        category: 'Sobrevivência',
        domain: 'Risco',
        origin: 'DFC + BP',
        problem: 'Queima contínua de caixa operacional e curto runway de sobrevivência financeira.',
        action: 'Suspender investimentos de capital (CAPEX) não prioritários e otimizar prazos do ciclo financeiro.',
        responsible: 'CFO / Financeiro',
        prazoRecomendadoLabel: 'Imediata',
        impactLabel: 'Alto',
        urgencyLabel: 'Imediata',
        impactScore,
        urgencyScore,
        effortScore,
        eps,
        classification: this.getClassification(eps),
        consequenciaInacao: 'Ruptura de caixa de curto prazo e interrupção forçada das atividades.',
        impactoEsperado: 'Aumento imediato do runway de sobrevivência e recomposição de liquidez.',
        evidence: [
          `Runway de Sobrevivência: ${runwayMonths.toFixed(1)} meses`,
          `Fluxo de Caixa Operacional (FCO): ${fmt(fco)}`
        ]
      });
    }

    // 4. Candidate: Recuperação de Capital Erodido
    if (lucrosPrejuizos < 0) {
      const impactScore = 80;
      const urgencyScore = 75;
      const effortScore = 30;
      const eps = (impactScore * 0.50) + (urgencyScore * 0.35) + ((100 - effortScore) * 0.15);

      list.push({
        title: 'Recuperar Riqueza e Preservar Capital',
        category: 'Capital',
        domain: 'Capital',
        origin: 'DLPA',
        problem: 'Prejuízos acumulados acumulados corroem o patrimônio líquido integralizado pelos sócios.',
        action: 'Retenção integral de lucros futuros e suspensão temporária de qualquer distribuição.',
        responsible: 'Conselho de Administração',
        prazoRecomendadoLabel: 'Curto Prazo',
        impactLabel: 'Alto',
        urgencyLabel: 'Curto Prazo',
        impactScore,
        urgencyScore,
        effortScore,
        eps,
        classification: this.getClassification(eps),
        consequenciaInacao: 'Insolvência patrimonial técnica e redução permanente do valor da empresa.',
        impactoEsperado: 'Recomposição gradativa do patrimônio líquido e reestabelecimento da solvência.',
        evidence: [
          `Prejuízos Acumulados: ${fmt(lucrosPrejuizos)}`,
          `Capital Social Integralizado: ${fmt(capitalSocial)}`
        ]
      });
    }

    // 5. Candidate: Reforço de Controles e Governança
    if (cqs < 60 || complianceStatus === 'CONSTITUTIONAL_QUARANTINE' || hasWarnings) {
      const impactScore = 70;
      const urgencyScore = 80;
      const effortScore = 25;
      const eps = (impactScore * 0.50) + (urgencyScore * 0.35) + ((100 - effortScore) * 0.15);

      list.push({
        title: 'Reforço de Governança de Controles',
        category: 'Governança',
        domain: 'Governança',
        origin: 'Cross-Statement',
        problem: 'Inconsistências ou falhas identificadas nos controles de governança financeira.',
        action: 'Realizar auditoria interna completa nos lançamentos e implementar trincas de validação.',
        responsible: 'Conselho / Comitê de Compliance',
        prazoRecomendadoLabel: 'Médio Prazo',
        impactLabel: 'Moderado',
        urgencyLabel: 'Curto Prazo',
        impactScore,
        urgencyScore,
        effortScore,
        eps,
        classification: this.getClassification(eps),
        consequenciaInacao: 'Deterioração das notas de crédito e multas regulatórias por desvio de controle.',
        impactoEsperado: 'Reestabelecimento da conformidade e melhora do Score CQS.',
        evidence: [
          `Score CQS: ${cqs.toFixed(0)}/100`,
          `Status do Relatório: ${complianceStatus}`
        ]
      });
    }

    // Default Fallback if list is empty
    if (list.length === 0) {
      const impactScore = 40;
      const urgencyScore = 30;
      const effortScore = 15;
      const eps = (impactScore * 0.50) + (urgencyScore * 0.35) + ((100 - effortScore) * 0.15);

      list.push({
        title: 'Manutenção Preventiva de Liquidez',
        category: 'Otimização',
        domain: 'Operação',
        origin: 'BP',
        problem: 'Nenhum desvio crítico de liquidez ou rentabilidade detectado no período.',
        action: 'Manter a política ordinária de controle de despesas e acompanhamento orçamentário.',
        responsible: 'Diretoria / Financeiro',
        prazoRecomendadoLabel: 'Longo Prazo',
        impactLabel: 'Baixo',
        urgencyLabel: 'Longo Prazo',
        impactScore,
        urgencyScore,
        effortScore,
        eps,
        classification: this.getClassification(eps),
        consequenciaInacao: 'Perda gradual de controle orçamentário no longo prazo.',
        impactoEsperado: 'Preservação do caixa e continuidade da estabilidade atual.',
        evidence: [
          'Todos os indicadores operam dentro dos limites saudáveis de conformidade.'
        ]
      });
    }

    // Apply the Constitutional Override Layer
    return FiduciaryPriorityEscalationEngine.sort(list);
  }

  private static getClassification(eps: number): string {
    if (eps >= 90) return 'Prioridade Crítica';
    if (eps >= 75) return 'Prioridade Alta';
    if (eps >= 50) return 'Prioridade Moderada';
    return 'Prioridade Secundária';
  }
}
