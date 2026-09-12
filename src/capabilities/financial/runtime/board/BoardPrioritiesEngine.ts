// src/core/runtime/board/BoardPrioritiesEngine.ts

import { 
  BoardPriority, 
  BoardExecutiveBrief, 
  ESGIMMode, 
  ESGIMScenario 
} from '../../../runtime/esgim/esgimTypes';
import { esgimAssessmentEngine } from '../../../runtime/esgim/ESGIMAssessmentEngine';
import { institutionalResilienceIndexEngine } from '../../../runtime/esgim/InstitutionalResilienceIndexEngine';
import { governanceKnowledgeEngine } from '../../../../core/runtime/knowledge/GovernanceKnowledgeEngine';

export class BoardPrioritiesEngine {
  private static instance: BoardPrioritiesEngine;

  public static getInstance(): BoardPrioritiesEngine {
    if (!BoardPrioritiesEngine.instance) {
      BoardPrioritiesEngine.instance = new BoardPrioritiesEngine();
    }
    return BoardPrioritiesEngine.instance;
  }

  /**
   * Evaluates the ESGIM and IRI diagnostics, generating the ordered Top 5 Board Priorities.
   */
  public generatePriorities(
    clientId: string,
    mode: ESGIMMode = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD'
  ): { brief: BoardExecutiveBrief; priorities: BoardPriority[] } {
    const timestamp = new Date().toISOString();

    // 1. Fetch current scores
    const assessment = esgimAssessmentEngine.calculateAssessment(clientId, mode, scenario);
    const resilience = institutionalResilienceIndexEngine.calculateResilience(clientId, mode, scenario);

    // 2. Generate Brief details
    const brief = this.composeBrief(scenario, assessment.overallScore, resilience.score);

    // 3. Compile Candidate Priorities
    const candidates: BoardPriority[] = [];

    // Add Scenario specific emergency priorities
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      candidates.push({
        id: 'PR-GOV-01',
        title: 'Corrigir Quebra Constitucional e Auditar Comitê de Ética',
        description: 'Instaurar auditoria imediata sobre o comitê e restaurar limites de alçadas estatutárias violadas.',
        category: 'GOVERNANCE',
        urgency: 'IMMEDIATE',
        estimatedWindow: 'Próximos 30 dias',
        impact: 'CRITICAL',
        expectedBenefit: 'Restabelecimento da integridade constitucional e conformidade decisória perante reguladores.',
        evidence: [
          'Score de Governança no limite crítico de 30.',
          'Violação estatutária ativa detectada nos logs do conselho.'
        ],
        explainability: [
          'Veto da Constituição Cognitiva ativado (limite de 39 no score consolidado).',
          'Priorização máxima por quebra de governança e integridade.'
        ],
        decisionCategory: 'Survival',
        priorityScore: 99,
        constitutionalDriver: 'CONSTITUTIONAL',
        expectedImpactArea: ['ESGIM', 'IRI', 'Governance Engine', 'Ethics Committee']
      });

      candidates.push({
        id: 'PR-GOV-02',
        title: 'Auditar Alçadas e Assinaturas Decisórias do Board',
        description: 'Revisar segregação de funções e reconfigurar tokens de alçada criptográfica no sistema.',
        category: 'GOVERNANCE',
        urgency: 'IMMEDIATE',
        estimatedWindow: 'Próximos 30 dias',
        impact: 'CRITICAL',
        expectedBenefit: 'Bloqueio de autorizações não-estatutárias de fundos e atos societários.',
        evidence: [
          'Desvio de limites de alçada coletados na trilha de auditoria.'
        ],
        explainability: [
          'Mitigação de risco legal e conformidade constitucional fiduciária imediata.'
        ],
        decisionCategory: 'Stabilization',
        priorityScore: 94,
        constitutionalDriver: 'CONSTITUTIONAL',
        expectedImpactArea: ['ESGIM', 'Governance Engine']
      });
    }

    if (scenario === 'LIQUIDITY_SHOCK') {
      candidates.push({
        id: 'PR-FID-01',
        title: 'Aportar Capital Emergencial e Conter Evasão de Caixa',
        description: 'Captação imediata de reservas fiduciárias via holding ou sócios para cobrir o runway agudo.',
        category: 'FIDUCIARY',
        urgency: 'IMMEDIATE',
        estimatedWindow: 'Próximos 30 dias',
        impact: 'CRITICAL',
        expectedBenefit: 'Proteção contra insolvência iminente e preservação de obrigações de ciclo imediato.',
        evidence: [
          'Fiduciary Resilience reduzida para score 15.',
          'Runway de caixa projetado inferior a 90 dias.'
        ],
        explainability: [
          'Constituição Cognitiva impôs cap fiduciário de 39.',
          'A segurança patrimonial primária exige readequação líquida imediata.'
        ],
        decisionCategory: 'Survival',
        priorityScore: 98,
        constitutionalDriver: 'FIDUCIARY',
        expectedImpactArea: ['IRI', 'Fiduciary Governance']
      });

      candidates.push({
        id: 'PR-FID-02',
        title: 'Reestruturar Custos Fixos e Alongar Passivo Exigível',
        description: 'Negociar com parceiros e credores para postergar passivos fiduciários de ciclo imediato.',
        category: 'FIDUCIARY',
        urgency: 'IMMEDIATE',
        estimatedWindow: 'Próximos 30 dias',
        impact: 'CRITICAL',
        expectedBenefit: 'Redução da pressão de desembolso operacional e aumento imediato do caixa líquido.',
        evidence: [
          'Métricas de tesouraria indicam exaustão de caixa fiduciário.'
        ],
        explainability: [
          'Evitar que o colapso fiduciário afete o propósito final ou a operação da holding.'
        ],
        decisionCategory: 'Stabilization',
        priorityScore: 91,
        constitutionalDriver: 'FIDUCIARY',
        expectedImpactArea: ['IRI', 'Fiduciary Governance']
      });
    }

    if (scenario === 'FOUNDER_EXIT') {
      candidates.push({
        id: 'PR-INS-01',
        title: 'Formalizar Plano de Sucessão de Cargos Fundadores',
        description: 'Elaborar e testar planos sucessórios de liderança executiva da holding e alinhamento societário.',
        category: 'INSTITUTIONAL',
        urgency: 'SHORT_TERM',
        estimatedWindow: 'Próximos 90 dias',
        impact: 'CRITICAL',
        expectedBenefit: 'Assegurar a governança corporativa sem descontinuidade na saída voluntária ou forçada de pessoas-chave.',
        evidence: [
          'Resiliência Institucional crítica (35) devido a dependência societária direta.'
        ],
        explainability: [
          'Ceiling institucional ativo bloqueando a excelência (cap 89).',
          'Vulnerabilidade de chave de legado identificada.'
        ],
        decisionCategory: 'Legacy',
        priorityScore: 95,
        constitutionalDriver: 'INSTITUTIONAL',
        expectedImpactArea: ['IRI', 'Institutional Governance']
      });

      candidates.push({
        id: 'PR-INS-02',
        title: 'Institucionalizar Conhecimento Crítico e Alçadas',
        description: 'Mapear e documentar rotinas e alçadas chaves do fundador e migrar para governança colegiada.',
        category: 'INSTITUTIONAL',
        urgency: 'MEDIUM_TERM',
        estimatedWindow: 'Próximos 12 meses',
        impact: 'HIGH',
        expectedBenefit: 'Redução da dependência pessoal de indivíduos específicos no dia a dia da holding.',
        evidence: [
          'Ausência de documentação de processos estratégicos de representação.'
        ],
        explainability: [
          'Preservação do legado fundador através de descentralização regulada.'
        ],
        decisionCategory: 'Legacy',
        priorityScore: 87,
        constitutionalDriver: 'INSTITUTIONAL',
        expectedImpactArea: ['ESGIM', 'Institutional Governance']
      });
    }

    if (scenario === 'MARKET_DISRUPTION') {
      candidates.push({
        id: 'PR-STR-01',
        title: 'Fomentar Prontidão Futura e Renovação de Competências',
        description: 'Reestruturação de competências do conselho e lideranças em relação a inovações de mercado.',
        category: 'STRATEGIC',
        urgency: 'SHORT_TERM',
        estimatedWindow: 'Próximos 90 dias',
        impact: 'HIGH',
        expectedBenefit: 'Capacidade de identificar ameaças de obsolescência e oportunidades disruptivas.',
        evidence: [
          'Resiliência prospectiva degradada para 30.'
        ],
        explainability: [
          'Ceiling prospectivo bloqueando High Resilience (cap 89).',
          'Rigidez corporativa perante novos ciclos tecnológicos.'
        ],
        decisionCategory: 'Strengthening',
        priorityScore: 89,
        constitutionalDriver: 'PROSPECTIVE',
        expectedImpactArea: ['IRI', 'Prospective Governance']
      });

      candidates.push({
        id: 'PR-STR-02',
        title: 'Diversificar Portfólio de Receita e Canais de Mercado',
        description: 'Mapear novos modelos e investimentos adjacentes para mitigar estagnação do core business.',
        category: 'STRATEGIC',
        urgency: 'MEDIUM_TERM',
        estimatedWindow: 'Próximos 12 meses',
        impact: 'HIGH',
        expectedBenefit: 'Diluição de riscos sistêmicos e sustentação fiduciária em longo horizonte.',
        evidence: [
          'Baixa flexibilidade adaptativa de mercado.'
        ],
        explainability: [
          'Aumento da resiliência prospectiva corporativa perante concorrência.'
        ],
        decisionCategory: 'Growth',
        priorityScore: 81,
        constitutionalDriver: 'PROSPECTIVE',
        expectedImpactArea: ['IRI', 'Prospective Governance']
      });
    }

    if (scenario === 'MISSION_STRESS') {
      candidates.push({
        id: 'PR-MIS-01',
        title: 'Readequar Alocação de Recursos para a Missão Principal',
        description: 'Revisar orçamento e garantir que as contas fiduciárias priorizem a missão fundadora da holding.',
        category: 'MISSION',
        urgency: 'SHORT_TERM',
        estimatedWindow: 'Próximos 90 dias',
        impact: 'HIGH',
        expectedBenefit: 'Retorno ao foco do propósito existencial sem comprometer a estabilidade operacional.',
        evidence: [
          'Mission Continuity degradada para score 35.',
          'Drenagem de recursos identificada em finalidades acessórias.'
        ],
        explainability: [
          'Restrição missional cognitiva ativada (cap de score geral em 59).',
          'Sufocamento missional por pressão financeira de ciclo imediato.'
        ],
        decisionCategory: 'Legacy',
        priorityScore: 90,
        constitutionalDriver: 'MISSION',
        expectedImpactArea: ['ESGIM', 'Mission Alignment Engine']
      });

      candidates.push({
        id: 'PR-MIS-02',
        title: 'Revisar Modelo Fiduciário-Missional do Board',
        description: 'Elaborar comitê misto de governança de propósito e tesouraria para alinhar metas fiduciárias.',
        category: 'MISSION',
        urgency: 'MEDIUM_TERM',
        estimatedWindow: 'Próximos 12 meses',
        impact: 'HIGH',
        expectedBenefit: 'Equilíbrio duradouro entre metas de rentabilidade econômica e a preservação do legado.',
        evidence: [
          'Dissonância entre custos de operação e o cumprimento de metas de missão.'
        ],
        explainability: [
          'Garantir alinhamento de propósito sem expor a holding a riscos de liquidez.'
        ],
        decisionCategory: 'Stabilization',
        priorityScore: 83,
        constitutionalDriver: 'MISSION',
        expectedImpactArea: ['ESGIM', 'Mission Alignment Engine']
      });
    }

    // Add standard reference priorities (fallbacks)
    candidates.push({
      id: 'PR-FID-STD',
      title: 'Estruturar Reserva de Contingência Financeira',
      description: 'Estabelecer fundos líquidos de mitigação equivalentes a 6 meses de despesas da holding.',
      category: 'FIDUCIARY',
      urgency: 'SHORT_TERM',
      estimatedWindow: 'Próximos 90 dias',
      impact: 'HIGH',
      expectedBenefit: 'Proteção contra choques sazonais e elevação natural da resiliência de caixa.',
      evidence: ['Balanço patrimonial com liquidez de baseline saudáveis.'],
      explainability: ['Prioridade padrão para manutenção de liquidez fiduciária.'],
      decisionCategory: 'Survival',
      priorityScore: 80,
      constitutionalDriver: 'FIDUCIARY',
      expectedImpactArea: ['IRI', 'Fiduciary Governance']
    });

    candidates.push({
      id: 'PR-INS-STD',
      title: 'Mapear e Institucionalizar Processos Societários',
      description: 'Documentar alçadas e chaves de legado do fundador em processos formais do Board.',
      category: 'INSTITUTIONAL',
      urgency: 'MEDIUM_TERM',
      estimatedWindow: 'Próximos 12 meses',
      impact: 'HIGH',
      expectedBenefit: 'Mitigação natural contra transições societárias abruptas.',
      evidence: ['Baseline de sucessão estruturada no setor.'],
      explainability: ['Aumento preventivo da resiliência institucional da marca.'],
      decisionCategory: 'Legacy',
      priorityScore: 78,
      constitutionalDriver: 'INSTITUTIONAL',
      expectedImpactArea: ['ESGIM', 'IRI', 'Institutional Governance']
    });

    candidates.push({
      id: 'PR-GOV-STD',
      title: 'Reforçar Segregação de Alçadas e Governança do Board',
      description: 'Estruturar regimento de alçadas decisórias de investimentos societários com múltiplas chaves.',
      category: 'GOVERNANCE',
      urgency: 'SHORT_TERM',
      estimatedWindow: 'Próximos 90 dias',
      impact: 'MODERATE',
      expectedBenefit: 'Redução de potenciais conflitos de interesse e desvios de alçada.',
      evidence: ['Governança formal estruturada com segregação de conselho.'],
      explainability: ['Manutenção preventiva da Constituição Cognitiva do ecossistema.'],
      decisionCategory: 'Stabilization',
      priorityScore: 72,
      constitutionalDriver: 'CONSTITUTIONAL',
      expectedImpactArea: ['ESGIM', 'Governance Engine']
    });

    candidates.push({
      id: 'PR-MIS-STD',
      title: 'Auditar Indicadores de Alinhamento Missional de Gastos',
      description: 'Análise anual de auditoria para certificar que recursos apoiam o propósito existencial.',
      category: 'MISSION',
      urgency: 'MEDIUM_TERM',
      estimatedWindow: 'Próximos 12 meses',
      impact: 'MODERATE',
      expectedBenefit: 'Consistência de marca e retenção de doadores/parceiros e investidores de propósito.',
      evidence: ['Baseline de metas de impacto em alinhamento.'],
      explainability: ['Mitigação preventiva contra desalinhamento missional.'],
      decisionCategory: 'Strengthening',
      priorityScore: 70,
      constitutionalDriver: 'MISSION',
      expectedImpactArea: ['ESGIM', 'Mission Alignment Engine']
    });

    candidates.push({
      id: 'PR-STR-STD',
      title: 'Aprimorar Prontidão de Portfólio e Inteligência Prospectiva',
      description: 'Implementar comitê de novos modelos de negócio e escuta estratégica de mercado.',
      category: 'STRATEGIC',
      urgency: 'LONG_TERM',
      estimatedWindow: 'Horizonte estratégico',
      impact: 'MODERATE',
      expectedBenefit: 'Detecção antecipada de ameaças competitivas ou novos modelos regulatórios.',
      evidence: ['Foco em estabilidade operacional no ciclo imediato.'],
      explainability: ['Prevenção de obsolescência corporativa futura.'],
      decisionCategory: 'Growth',
      priorityScore: 65,
      constitutionalDriver: 'PROSPECTIVE',
      expectedImpactArea: ['IRI', 'Prospective Governance']
    });

    // 4. Sort Candidates by priorityScore Descending
    const sorted = [...candidates].sort((a, b) => b.priorityScore - a.priorityScore);

    // 5. Select Top 5 with Saturation Protection:
    // maximum two priorities per category, EXCEPT in constitutional/fiduciary emergencies.
    const selected: BoardPriority[] = [];
    const categoryCounts: Record<string, number> = {};
    const isEmergency = (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK');

    for (const p of sorted) {
      if (selected.length >= 5) break;

      const currentCount = categoryCounts[p.category] || 0;
      
      if (isEmergency || currentCount < 2) {
        selected.push(p);
        categoryCounts[p.category] = currentCount + 1;
      }
    }

    const enrichedPriorities = selected.map(p => {
      const gklResult = governanceKnowledgeEngine.matchFinding(p.id, 'BPE', `${p.title} ${p.description}`);
      let benchmarkImpact = 4;
      if (p.id.includes('FID')) benchmarkImpact = 6;
      else if (p.id.includes('GOV')) benchmarkImpact = 5;
      else if (p.id.includes('INS')) benchmarkImpact = 6;
      else if (p.id.includes('STR')) benchmarkImpact = 8;
      else if (p.id.includes('MIS')) benchmarkImpact = 4;

      return {
        ...p,
        supportingPrinciples: gklResult.principleMatches.map(pm => pm.title),
        principleCategories: gklResult.principleMatches.map(pm => pm.category),
        executiveRationale: gklResult.executiveRationale,
        benchmarkImpact
      };
    });

    return {
      brief,
      priorities: enrichedPriorities
    };
  }

  private composeBrief(
    scenario: ESGIMScenario,
    esgimScore: number,
    iriScore: number
  ): BoardExecutiveBrief {
    switch (scenario) {
      case 'CONSTITUTIONAL_BREACH':
        return {
          headline: 'Alerta Constitucional Crítico por Violação de Alçadas',
          summary: 'A quebra grave de limites estatutários e diretrizes éticas degradou o score de governança, exigindo auditoria imediata de processos.',
          primaryRisk: 'Desalinhamento ético e perda de credibilidade fiduciária perante terceiros.',
          primaryOpportunity: 'Revisão e endurecimento das chaves de autorização decisórias.',
          recommendedFocus: 'Ação imediata para auditar alçadas e restabelecer conformidade constitucional.'
        };

      case 'LIQUIDITY_SHOCK':
        return {
          headline: 'Colapso de Liquidez e Risco Crítico Fiduciário',
          summary: 'Ruptura severa nas contas patrimoniais com runway de ciclo imediato exposto. A sustentabilidade operacional está em risco iminente.',
          primaryRisk: 'Insolvência operacional e quebra do legado corporativo por iliquidez.',
          primaryOpportunity: 'Atração de aportes emergenciais e renegociação imediata de passivos.',
          recommendedFocus: 'Estabilização de fluxo de caixa e captação emergencial de contingência.'
        };

      case 'FOUNDER_EXIT':
        return {
          headline: 'Maturidade Moderada sob Gargalo Sucessório Crítico',
          summary: 'A estabilidade financeira atual é forte, mas a resiliência futura apresenta teto limitador devido à extrema dependência dos fundadores.',
          primaryRisk: 'Descontinuidade do legado na ausência ou saída repentina da liderança fundadora.',
          primaryOpportunity: 'Institucionalização de conhecimento crítico e fortalecimento da segunda linha.',
          recommendedFocus: 'Formalização imediata do plano de sucessão de cargos fundadores.'
        };

      case 'MARKET_DISRUPTION':
        return {
          headline: 'Estabilidade Fiduciária Ameaçada por Rigidez Adaptativa',
          summary: 'A governança e as contas atuais estão seguras, mas a holding demonstra vulnerabilidade e obsolescência estratégica futura.',
          primaryRisk: 'Perda de mercado por desconexão com inovações tecnológicas e regulatórias.',
          primaryOpportunity: 'Renovação de competências estratégicas e diversificação de portfólio.',
          recommendedFocus: 'Desenvolvimento de canais de adaptabilidade prospectiva e novos negócios.'
        };

      case 'MISSION_STRESS':
        return {
          headline: 'Desalinhamento Missional e Conflito de Propósito',
          summary: 'Dissonância ativa entre a geração financeira e a entrega do propósito fundador de impacto da holding.',
          primaryRisk: 'Perda de identidade existencial e degradação da marca da holding.',
          primaryOpportunity: 'Readequação de alocação de orçamentos fiduciários em prol da missão.',
          recommendedFocus: 'Revisão de modelo fiduciário-missional para restabelecer coerência existencial.'
        };

      case 'STANDARD':
      default:
        return {
          headline: 'Resiliência Estrutural com Solidez Operacional',
          summary: 'A holding apresenta excelente alinhamento missional e reservas fiduciárias saudáveis, operando em baseline equilibrado.',
          primaryRisk: 'Estagnação estratégica por rigidez em canais de inovação.',
          primaryOpportunity: 'Profissionalização e expansão de estruturas de governança adjacentes.',
          recommendedFocus: 'Otimização de processos sucessórios e aprimoramento de prontidão prospectiva.'
        };
    }
  }
}

export const boardPrioritiesEngine = BoardPrioritiesEngine.getInstance();
