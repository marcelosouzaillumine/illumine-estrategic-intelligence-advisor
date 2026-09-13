// src/core/runtime/roadmap/GovernanceRoadmapEngine.ts

import { 
  GovernanceRoadmap, 
  GovernanceRoadmapPhase, 
  ESGIMMode, 
  ESGIMScenario 
} from '../esgim/esgimTypes';
import { boardPrioritiesEngine } from '../../financial/runtime/board/BoardPrioritiesEngine';
import { governanceKnowledgeEngine } from '../../../core/runtime/knowledge/GovernanceKnowledgeEngine';

export class GovernanceRoadmapEngine {
  private static instance: GovernanceRoadmapEngine;

  public static getInstance(): GovernanceRoadmapEngine {
    if (!GovernanceRoadmapEngine.instance) {
      GovernanceRoadmapEngine.instance = new GovernanceRoadmapEngine();
    }
    return GovernanceRoadmapEngine.instance;
  }

  /**
   * Generates the structured Governance Roadmap based on Board Priorities and active stress scenarios.
   */
  public generateRoadmap(
    clientId: string,
    mode: ESGIMMode = 'DEMO_SCENARIO',
    scenario: ESGIMScenario = 'STANDARD'
  ): GovernanceRoadmap {
    // 1. Fetch Board Priorities
    const prioritiesData = boardPrioritiesEngine.generatePriorities(clientId, mode, scenario);
    const topPriorityTitles = prioritiesData.priorities.map(p => p.title);

    // 2. Stage Determination
    let maturityStage: "STABILIZATION" | "STRUCTURING" | "STRENGTHENING" | "SCALING" | "LEGACY" = "SCALING";
    let roadmapProgress = 75;
    let roadmapRiskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = "LOW";
    let nextCriticalMilestone = 'Certificação e expansão do conselho consultivo em 6 meses';

    if (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') {
      maturityStage = "STABILIZATION";
      roadmapRiskLevel = "CRITICAL";
      if (scenario === 'CONSTITUTIONAL_BREACH') {
        roadmapProgress = 15;
        nextCriticalMilestone = 'Saneamento de regras de comitê de ética e auditoria de assinaturas até 30 dias';
      } else {
        roadmapProgress = 10;
        nextCriticalMilestone = 'Restabelecimento de liquidez mínima e injeção de capital até 30 dias';
      }
    } else if (scenario === 'MISSION_STRESS') {
      maturityStage = "STRUCTURING";
      roadmapProgress = 35;
      roadmapRiskLevel = "MODERATE";
      nextCriticalMilestone = 'Readequação orçamentária do caixa em prol do propósito fundador em 90 dias';
    } else if (scenario === 'MARKET_DISRUPTION') {
      maturityStage = "STRENGTHENING";
      roadmapProgress = 50;
      roadmapRiskLevel = "HIGH";
      nextCriticalMilestone = 'Aprovação do plano de renovação de portfólio tecnológico em 90 dias';
    } else if (scenario === 'FOUNDER_EXIT') {
      maturityStage = "LEGACY";
      roadmapProgress = 45;
      roadmapRiskLevel = "HIGH";
      nextCriticalMilestone = 'Assinatura e teste do regimento sucessório do conselho em 90 dias';
    }

    // 3. Adaptive Phase Durations
    let phase1Duration = 2; // STANDARD baseline: 2 months (standard: 1-3 months)
    if (scenario === 'CONSTITUTIONAL_BREACH' || scenario === 'LIQUIDITY_SHOCK') {
      phase1Duration = 6; // Critical scenario: 6 months stabilization
    } else if (scenario === 'MISSION_STRESS' || scenario === 'FOUNDER_EXIT' || scenario === 'MARKET_DISRUPTION') {
      phase1Duration = 4; // Moderate scenario: 4 months stabilization/first phase
    }

    // 4. Build Phases with Completion Criteria & Dependencies
    const phases: GovernanceRoadmapPhase[] = [];

    // Phase 1: Stabilization
    phases.push({
      phaseId: 'PH-01',
      title: scenario === 'CONSTITUTIONAL_BREACH' 
        ? 'Saneamento Ético & Auditoria Constitucional' 
        : scenario === 'LIQUIDITY_SHOCK'
        ? 'Recapitalização Emergencial & Sobrevivência Fiduciária'
        : 'Estabilização Operacional & Controles Básicos',
      objective: 'Eliminar riscos imediatos de quebra jurídica ou colapso financeiro fiduciário.',
      durationMonths: phase1Duration,
      priorities: scenario === 'CONSTITUTIONAL_BREACH' 
        ? ['Corrigir Quebra Constitucional e Auditar Comitê de Ética', 'Auditar Alçadas e Assinaturas Decisórias do Board']
        : scenario === 'LIQUIDITY_SHOCK'
        ? ['Aportar Capital Emergencial e Conter Evasão de Caixa', 'Reestruturar Custos Fixos e Alongar Passivo Exigível']
        : ['Estruturar Reserva de Contingência Financeira'],
      expectedBenefits: [
        'Mitigação total de riscos de insolvência operacional ou autuação regulatória.',
        'Restabelecimento imediato de baseline ético.'
      ],
      dependencies: [],
      riskReductionAreas: ['FIDUCIARY', 'GOVERNANCE'],
      completionCriteria: scenario === 'CONSTITUTIONAL_BREACH'
        ? ['Regras de comitê de ética restabelecidas', 'Auditoria de alçadas concluída', 'Validação criptográfica reconfigurada']
        : scenario === 'LIQUIDITY_SHOCK'
        ? ['Injeção emergencial de caixa concluída', 'Contratos de alongamento de dívida assinados', 'Runway mínimo de 6 meses atingido']
        : ['Reserva de liquidez básica constituída', 'Políticas fiduciárias iniciais aprovadas']
    });

    // Phase 2: Structuring
    phases.push({
      phaseId: 'PH-02',
      title: 'Estruturação de Governança & Comitês',
      objective: 'Profissionalizar alçadas decisórias e controles internos permanentes.',
      durationMonths: 3,
      priorities: ['Reforçar Segregação de Alçadas e Governança do Board'],
      expectedBenefits: [
        'Processos decisórios colegiados estáveis.',
        'Eliminação da rigidez regulatória decisória.'
      ],
      dependencies: ['PH-01'], // Requires Stabilization
      riskReductionAreas: ['GOVERNANCE'],
      completionCriteria: [
        'Comitês técnicos assessores formalizados',
        'Novo regimento interno de governança corporativa assinado',
        'Mapeamento de alçadas descentralizadas concluído'
      ]
    });

    // Phase 3: Strengthening
    phases.push({
      phaseId: 'PH-03',
      title: 'Fortalecimento Institucional & Sucessão',
      objective: 'Eliminar a dependência pessoal e salvaguardar a continuidade do legado.',
      durationMonths: 6,
      priorities: scenario === 'FOUNDER_EXIT' 
        ? ['Formalizar Plano de Sucessão de Cargos Fundadores', 'Institucionalizar Conhecimento Crítico e Alçadas']
        : ['Mapear e Institucionalizar Processos Societários'],
      expectedBenefits: [
        'Continuidade societária e transição sem atrito garantida.',
        'Mitigação do risco de perda de capital intelectual.'
      ],
      dependencies: ['PH-02'], // Requires Structuring
      riskReductionAreas: ['INSTITUTIONAL'],
      completionCriteria: [
        'Plano de sucessão assinado pelos fundadores',
        'Manual de transição executiva homologado pelo Board',
        'Mitigação de key person risks homologada em auditoria'
      ]
    });

    // Phase 4: Sustainable Scaling
    phases.push({
      phaseId: 'PH-04',
      title: 'Escala e Prontidão Adaptativa',
      objective: 'Diversificar portfólio de novos negócios e acelerar inovação sustentável.',
      durationMonths: 12,
      priorities: scenario === 'MARKET_DISRUPTION'
        ? ['Promover Adaptabilidade Estratégica e Renovação de Competências', 'Diversificar Portfólio de Receita e Canais de Mercado']
        : ['Aprimorar Prontidão de Portfólio e Inteligência Prospectiva'],
      expectedBenefits: [
        'Modelo de negócios flexível e adaptado a inovações disruptivas.',
        'Novos canais de receita fiduciária em operação.'
      ],
      dependencies: ['PH-02'], // Enforce: SCALING requires STRUCTURING (PH-02)
      riskReductionAreas: ['STRATEGIC'],
      completionCriteria: [
        'Mapeamento de novos modelos de negócio concluído',
        'Investimentos de inovação auditados com retorno projetado',
        'Plano de competências prospectivas de conselheiros aprovado'
      ]
    });

    // Phase 5: Legacy Preservation
    phases.push({
      phaseId: 'PH-05',
      title: 'Preservação de Legado e Propósito',
      objective: 'Garantir perpetuidade do propósito existencial da holding.',
      durationMonths: 12,
      priorities: scenario === 'MISSION_STRESS'
        ? ['Readequar Alocação de Recursos para a Missão Principal', 'Revisar Modelo Fiduciário-Missional do Board']
        : ['Auditar Indicadores de Alinhamento Missional de Gastos'],
      expectedBenefits: [
        'Blindagem reputacional e alinhamento de propósito existencial de longo horizonte.',
        'Coerência missional de investimentos consolidada.'
      ],
      dependencies: ['PH-03'], // Enforce: LEGACY requires STRENGTHENING (PH-03)
      riskReductionAreas: ['MISSION'],
      completionCriteria: [
        'Auditoria missional e de alocação de recursos finalizada',
        'Comitê de preservação de propósito fundador ativo',
        'Diretrizes de legado vinculadas a contratos societários permanentes'
      ]
    });

    // Calculate total duration
    const estimatedDurationMonths = phases.reduce((acc, phase) => acc + phase.durationMonths, 0);

    // 5. Separate Initiatives
    const quickWins: string[] = [];
    const foundationalInitiatives: string[] = [];
    const strategicInitiatives: string[] = [];

    // Map Quick Wins (< 90 days)
    if (scenario === 'CONSTITUTIONAL_BREACH') {
      quickWins.push('Auditar comitê de ética e corregedoria decisória');
      quickWins.push('Ajustar chaves criptográficas de alçada digital');
    } else if (scenario === 'LIQUIDITY_SHOCK') {
      quickWins.push('Atração imediata de injeção de capital societário');
      quickWins.push('Elaboração de comitê emergencial de caixa diário');
    } else {
      quickWins.push('Constituição de comissão consultiva de liquidez e reserva');
    }
    quickWins.push('Formalização de limites de alçadas em contratos internos');

    // Map Foundational Initiatives (90 - 365 days)
    foundationalInitiatives.push('Assinatura do regimento de sucessão de cargos fundadores');
    foundationalInitiatives.push('Implementação do Board Priorities Monitor para tracking de roadmap');
    if (scenario === 'MISSION_STRESS') {
      foundationalInitiatives.push('Revisão e realinhamento do orçamento de despesas missórias');
    } else if (scenario === 'MARKET_DISRUPTION') {
      foundationalInitiatives.push('Revisão e reciclagem de competências do conselho');
    }

    // Map Strategic Initiatives (12 - 36 months)
    strategicInitiatives.push('Estruturação completa de conselho de família e holding patrimonial');
    strategicInitiatives.push('Diversificação de portfólio e canais de novos negócios');
    strategicInitiatives.push('Integração de governança missional societária em regimento de marca');

    const explainability: string[] = [
      'Sequência de fases gerada com base em análise de dependência de vulnerabilidade corporativa.',
      'Bloqueio de Expansão/Escala condicionado à estabilização de caixa.',
      'Sucessão de legado condicionada ao restabelecimento de regimentos formais de governança.'
    ];

    const expectedOutcomes = [
      'Preservação do patrimônio e liquidez fiduciária.',
      'Mitigação total de personificação e person-key risks.',
      'Estabilidade decisória multigeração.'
    ];

    const enrichedPhases = phases.map(phase => {
      const gklResult = governanceKnowledgeEngine.matchFinding(phase.phaseId, 'GRE', `${phase.title} ${phase.objective}`);
      
      let benchmarkAlignment = "Evolução Contínua de Governança";
      let benchmarkTierImpact = "Melhoria contínua do índice de potencial de avanço (APS™).";
      
      if (phase.phaseId === 'PH-01') {
        benchmarkAlignment = "Estruturação de Fundamentos BRL™";
        benchmarkTierImpact = "Pré-requisito crítico para ingresso em processos comparativos BCI™.";
      } else if (phase.phaseId === 'PH-02') {
        benchmarkAlignment = "Alinhamento a Cohort de Referência";
        benchmarkTierImpact = "Projeção de ascensão para o Quadrante TOP 50% em 6 meses.";
      } else if (phase.phaseId === 'PH-03') {
        benchmarkAlignment = "Certificação de Prontidão BRL™ Completa";
        benchmarkTierImpact = "Qualificação fiduciária com Advisory Confidence Score (ACS™) de alta confiança.";
      } else if (phase.phaseId === 'PH-04') {
        benchmarkAlignment = "Simulação de Impacto Fiduciário BCI™";
        benchmarkTierImpact = "Potencial de ascensão ao Quadrante TOP 25% com mitigação de riscos de legado.";
      } else if (phase.phaseId === 'PH-05') {
        benchmarkAlignment = "Liderança Setorial Governança Integrada";
        benchmarkTierImpact = "Posicionamento definitivo no TOP 10% do cohort.";
      }

      return {
        ...phase,
        relatedPrinciples: gklResult.principleMatches.map(pm => pm.title),
        governanceRationale: gklResult.executiveRationale,
        benchmarkAlignment,
        benchmarkTierImpact
      };
    });

    return {
      maturityStage,
      executiveSummary: this.generateRoadmapSummary(maturityStage, scenario),
      phases: enrichedPhases,
      estimatedDurationMonths,
      expectedOutcomes,
      explainability,
      roadmapProgress,
      roadmapRiskLevel,
      nextCriticalMilestone,
      quickWins,
      foundationalInitiatives,
      strategicInitiatives,
      generatedFromPriorities: topPriorityTitles
    };
  }

  private generateRoadmapSummary(
    stage: string,
    scenario: ESGIMScenario
  ): string {
    switch (scenario) {
      case 'CONSTITUTIONAL_BREACH':
        return 'RECOMENDAÇÃO: O caminho imediato exige saneamento de regras e conformidade regulatória. Nenhuma iniciativa estratégica ou expansão de portfólio pode ser iniciada antes que as alçadas decisórias e o regimento de ética do Board estejam auditados e regularizados.';
      
      case 'LIQUIDITY_SHOCK':
        return 'RECOMENDAÇÃO: Prioridade total para estabilização financeira. Planos de crescimento e transição de legado estão suspensos até que a injeção emergencial de caixa atinja os níveis mínimos de runway fiduciário mapeados.';
      
      case 'FOUNDER_EXIT':
        return 'RECOMENDAÇÃO: Foco focado em transição de legado. Recomenda-se formalizar comitês sucessórios e documentar conhecimentos do fundador imediatamente, garantindo estabilidade decisória na holding antes do desligamento.';
      
      case 'MARKET_DISRUPTION':
        return 'RECOMENDAÇÃO: Acelerar prontidão adaptativa estratégica. Embora as contas estejam saudáveis, a holding deve estruturar comitês de novos modelos de negócio e reciclagem do Board para evitar obsolescência.';
      
      case 'MISSION_STRESS':
        return 'RECOMENDAÇÃO: Reequilibrar alinhamento de propósito de gastos. Recomenda-se instituir políticas que vinculem a sustentabilidade de caixa à finalidade missória original antes de avançar para novos ciclos.';
      
      case 'STANDARD':
      default:
        return 'RECOMENDAÇÃO: A organização opera em baseline seguro. O roadmap foca em profissionalização sucessória preventiva e aprimoramento prospectivo para novos ciclos sustentáveis de escala corporativa.';
    }
  }
}

export const governanceRoadmapEngine = GovernanceRoadmapEngine.getInstance();
