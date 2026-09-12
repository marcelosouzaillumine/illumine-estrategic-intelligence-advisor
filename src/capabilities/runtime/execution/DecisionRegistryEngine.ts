// src/core/runtime/execution/DecisionRegistryEngine.ts

import { 
  GovernanceDecision, 
  GovernanceDecisionType, 
  CognitiveOriginEngine, 
  DecisionExecutionRisk,
  ESGIMScenario
} from '../esgim/esgimTypes';
import { governanceKnowledgeEngine } from '../../core/runtime/knowledge/GovernanceKnowledgeEngine';

export class DecisionRegistryEngine {
  private static instance: DecisionRegistryEngine;
  private decisions: GovernanceDecision[] = [];

  private constructor() {
    this.loadFromLocalStorage();
  }

  public static getInstance(): DecisionRegistryEngine {
    if (!DecisionRegistryEngine.instance) {
      DecisionRegistryEngine.instance = new DecisionRegistryEngine();
    }
    return DecisionRegistryEngine.instance;
  }

  private loadFromLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('gdtl_decisions');
      if (stored) {
        try {
          this.decisions = JSON.parse(stored);
        } catch (e) {
          console.error('[GDTL] Error loading decisions from localStorage:', e);
        }
      }
    }
  }

  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('gdtl_decisions', JSON.stringify(this.decisions));
    }
  }

  /**
   * Resets the registry and clears localStorage.
   */
  public clearRegistry(): void {
    this.decisions = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('gdtl_decisions');
    }
  }

  /**
   * Populates baseline decisions for a scenario if no decisions exist.
   */
  private ensureBaselineDecisions(scenario: ESGIMScenario): void {
    if (this.decisions.length > 0) return;

    const baseTime = Date.now();
    const parseDateOffset = (days: number): string => {
      return new Date(baseTime + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    };

    const mockDecisions: GovernanceDecision[] = [];

    switch (scenario) {
      case 'CONSTITUTIONAL_BREACH':
        mockDecisions.push({
          id: `DEC-CB-01-${baseTime}`,
          title: "Instaurar Auditoria Ética do Board",
          description: "Nomeação de auditoria externa extraordinária para avaliar a quebra de limites decisórios no estatuto.",
          source: "BPE",
          category: "GOVERNANCE",
          decisionType: "BOARD_RESOLUTION",
          originEngine: "BPE",
          executionRisk: "CRITICAL",
          assignedTo: "Helena Ramos (Compliance)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(7),
          status: "OPEN",
          expectedBenefit: "Regularização jurídica e transparência estatutária perante os sócios.",
          evidence: ["Violação registrada na alçada digital do Board", "Inatividade temporária do comitê de ética"],
          lineageHash: `LIN-GDTL-CB-1-${baseTime}`,
          approvedByBoard: true,
          approvedAt: new Date().toISOString()
        });
        mockDecisions.push({
          id: `DEC-CB-02-${baseTime}`,
          title: "Bloquear Alçadas de Assinatura Única",
          description: "Bloqueio preventivo no ERP para transações de fundos extraordinários sem assinatura digital conjunta.",
          source: "BOARD",
          category: "FIDUCIARY",
          decisionType: "CORRECTIVE_ACTION",
          originEngine: "BOARD",
          executionRisk: "CRITICAL",
          assignedTo: "Carlos Santos (CFO)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(2),
          status: "IN_PROGRESS",
          expectedBenefit: "Impedir novos desvios unilaterais de verba fiduciária.",
          evidence: ["Desvios de aprovação registrados no histórico contábil"],
          lineageHash: `LIN-GDTL-CB-2-${baseTime}`,
          approvedByBoard: true,
          approvedAt: new Date().toISOString()
        });
        break;

      case 'LIQUIDITY_SHOCK':
        mockDecisions.push({
          id: `DEC-LS-01-${baseTime}`,
          title: "Aprovar Aporte de Capital Societário",
          description: "Chamada de capital emergencial dos acionistas controladores para restabelecer caixa mínimo de 120 dias.",
          source: "BPE",
          category: "FIDUCIARY",
          decisionType: "BOARD_RESOLUTION",
          originEngine: "BPE",
          executionRisk: "CRITICAL",
          assignedTo: "Carlos Santos (CFO)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(1),
          status: "OPEN",
          expectedBenefit: "Sanar risco de inadimplência fiscal e operacional de ciclo imediato.",
          evidence: ["Disponibilidade fiduciária inferior a 90 dias de runway"],
          lineageHash: `LIN-GDTL-LS-1-${baseTime}`,
          approvedByBoard: true,
          approvedAt: new Date().toISOString()
        });
        mockDecisions.push({
          id: `DEC-LS-02-${baseTime}`,
          title: "Congelar Planos de Escala do Roadmap",
          description: "Interrupção temporária de investimentos de capex em expansão física e contratações não-essenciais.",
          source: "GRE",
          category: "STRATEGIC",
          decisionType: "MANAGEMENT_ACTION",
          originEngine: "GRE",
          executionRisk: "HIGH",
          assignedTo: "Lucas Silva (COO)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(15),
          status: "IN_PROGRESS",
          expectedBenefit: "Preservação imediata de caixa para sustentar despesas operacionais correntes.",
          evidence: ["Pressão de custos fixos com margem líquida em declínio"],
          lineageHash: `LIN-GDTL-LS-2-${baseTime}`,
          approvedByBoard: false
        });
        break;

      case 'FOUNDER_EXIT':
        mockDecisions.push({
          id: `DEC-FE-01-${baseTime}`,
          title: "Formalizar Regimento Sucessório do Conselho",
          description: "Regulação estatutária do plano sucessório familiar multigeração do fundador.",
          source: "BPE",
          category: "GOVERNANCE",
          decisionType: "BOARD_RESOLUTION",
          originEngine: "BPE",
          executionRisk: "CRITICAL",
          assignedTo: "Helena Ramos (Compliance)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(30),
          status: "IN_PROGRESS",
          expectedBenefit: "Segurança de continuidade institucional na transição de controle do fundador.",
          evidence: ["Saída planejada de fundadores sem regimento homologado"],
          lineageHash: `LIN-GDTL-FE-1-${baseTime}`,
          approvedByBoard: true,
          approvedAt: new Date().toISOString()
        });
        mockDecisions.push({
          id: `DEC-FE-02-${baseTime}`,
          title: "Contratar CEO Externo Profissional",
          description: "Recrutamento de liderança executiva de mercado para transicionar a gestão familiar para governança colegiada.",
          source: "GRE",
          category: "INSTITUTIONAL",
          decisionType: "STRATEGIC_INITIATIVE",
          originEngine: "GRE",
          executionRisk: "HIGH",
          assignedTo: "Lucas Silva (COO)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(180),
          status: "OPEN",
          expectedBenefit: "Desvinculação operacional da imagem e gestão pessoal do fundador.",
          evidence: ["Risco de gargalo sucessório operacional e dependência corporativa"],
          lineageHash: `LIN-GDTL-FE-2-${baseTime}`,
          approvedByBoard: false
        });
        break;

      case 'MARKET_DISRUPTION':
        mockDecisions.push({
          id: `DEC-MD-01-${baseTime}`,
          title: "Instituir Comitê de Inteligência Prospectiva",
          description: "Criação de comitê de tecnologia focado em modelar novos canais digitais e portfólio concorrencial concorrente.",
          source: "BPE",
          category: "STRATEGIC",
          decisionType: "BOARD_RESOLUTION",
          originEngine: "BPE",
          executionRisk: "HIGH",
          assignedTo: "Helena Ramos (Compliance)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(30),
          status: "IN_PROGRESS",
          expectedBenefit: "Reduzir risco de obsolescência tecnológica frente a concorrentes digitais.",
          evidence: ["Erosão prospectiva com declínio concorrencial de médio ciclo"],
          lineageHash: `LIN-GDTL-MD-1-${baseTime}`,
          approvedByBoard: true,
          approvedAt: new Date().toISOString()
        });
        mockDecisions.push({
          id: `DEC-MD-02-${baseTime}`,
          title: "Alocar Orçamento para Novas Tecnologias",
          description: "Transferência de capital para o desenvolvimento de infraestrutura digital e e-commerce fiduciário.",
          source: "GRE",
          category: "STRATEGIC",
          decisionType: "STRATEGIC_INITIATIVE",
          originEngine: "GRE",
          executionRisk: "HIGH",
          assignedTo: "Carlos Santos (CFO)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(90),
          status: "OPEN",
          expectedBenefit: "Criação de novos fluxos de receita digital recorrente.",
          evidence: ["Core business saturado de canal físico único"],
          lineageHash: `LIN-GDTL-MD-2-${baseTime}`,
          approvedByBoard: false
        });
        break;

      case 'MISSION_STRESS':
        mockDecisions.push({
          id: `DEC-MS-01-${baseTime}`,
          title: "Auditar Orçamento de Despesas Administrativas",
          description: "Revisão e redução de custos operacionais de escala para proteger repasses à atividade social principal.",
          source: "BPE",
          category: "MISSION",
          decisionType: "CORRECTIVE_ACTION",
          originEngine: "BPE",
          executionRisk: "HIGH",
          assignedTo: "Lucas Silva (COO)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(30),
          status: "IN_PROGRESS",
          expectedBenefit: "Restabelecer alinhamento orçamentário social e mitigar desvio do propósito.",
          evidence: ["Custos operacionais estrangulando orçamento social fundador"],
          lineageHash: `LIN-GDTL-MS-1-${baseTime}`,
          approvedByBoard: false
        });
        mockDecisions.push({
          id: `DEC-MS-02-${baseTime}`,
          title: "Vincular Propósito ao Regimento de Marca",
          description: "Alteração estatutária blindando o propósito existencial e o legado original de marca holding.",
          source: "GRE",
          category: "MISSION",
          decisionType: "BOARD_RESOLUTION",
          originEngine: "GRE",
          executionRisk: "MODERATE",
          assignedTo: "Helena Ramos (Compliance)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(180),
          status: "OPEN",
          expectedBenefit: "Blindagem de reputação e garantia de alinhamento com fundos de investimento de impacto.",
          evidence: ["Risco de fracionamento de marca holding"],
          lineageHash: `LIN-GDTL-MS-2-${baseTime}`,
          approvedByBoard: true,
          approvedAt: new Date().toISOString()
        });
        break;

      case 'STANDARD':
      default:
        mockDecisions.push({
          id: `DEC-ST-01-${baseTime}`,
          title: "Revisar Manuais de Governança Corporativa",
          description: "Atualização ordinária anual de limites operacionais e responsabilidades dos comitês decisórios.",
          source: "BOARD",
          category: "GOVERNANCE",
          decisionType: "MANAGEMENT_ACTION",
          originEngine: "BOARD",
          executionRisk: "LOW",
          assignedTo: "Helena Ramos (Compliance)",
          createdAt: new Date(baseTime - 35 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(baseTime - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "COMPLETED",
          expectedBenefit: "Manutenção de processos formais atualizados em conformidade.",
          evidence: ["Revisão periódica de conformidade estatutária"],
          lineageHash: `LIN-GDTL-ST-1-${baseTime}`,
          approvedByBoard: true,
          approvedAt: new Date(baseTime - 35 * 24 * 60 * 60 * 1000).toISOString()
        });
        mockDecisions.push({
          id: `DEC-ST-02-${baseTime}`,
          title: "Diversificar Portfólio de Investimentos",
          description: "Distribuição das reservas líquidas fiduciárias em ativos de alta liquidez e baixo risco.",
          source: "GRE",
          category: "STRATEGIC",
          decisionType: "STRATEGIC_INITIATIVE",
          originEngine: "GRE",
          executionRisk: "MODERATE",
          assignedTo: "Carlos Santos (CFO)",
          createdAt: new Date().toISOString(),
          dueDate: parseDateOffset(60),
          status: "IN_PROGRESS",
          expectedBenefit: "Preservação de reserva fiduciária contra choques e oscilações do mercado financeiro.",
          evidence: ["Reserva líquida concentrada em ativo único"],
          lineageHash: `LIN-GDTL-ST-2-${baseTime}`,
          approvedByBoard: false
        });
        break;
    }

    this.decisions = mockDecisions.map(d => {
      const gklResult = governanceKnowledgeEngine.matchFinding(d.id, 'GDTL', `${d.title} ${d.description}`);
      return {
        ...d,
        principleMatches: gklResult.principleMatches
      };
    });
    this.saveToLocalStorage();
  }

  /**
   * Fetches decisions, ensuring baseline is initialized.
   */
  public getDecisions(clientId: string, scenario: ESGIMScenario): GovernanceDecision[] {
    this.ensureBaselineDecisions(scenario);
    return this.decisions;
  }

  /**
   * Registers a new decision.
   */
  public addDecision(decision: GovernanceDecision): void {
    if (!decision.principleMatches || decision.principleMatches.length === 0) {
      const gklResult = governanceKnowledgeEngine.matchFinding(decision.id, 'GDTL', `${decision.title} ${decision.description}`);
      decision.principleMatches = gklResult.principleMatches;
    }
    this.decisions.push(decision);
    this.saveToLocalStorage();
  }

  /**
   * Mutates status and persists changes.
   */
  public updateDecisionStatus(id: string, status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "CANCELLED"): void {
    const dec = this.decisions.find(d => d.id === id);
    if (dec) {
      dec.status = status;
      if (status === 'COMPLETED' && dec.source === 'BOARD' && !dec.approvedByBoard) {
        dec.approvedByBoard = true;
        dec.approvedAt = new Date().toISOString();
      }
      this.saveToLocalStorage();
    }
  }

  /**
   * Assigns owner and due date.
   */
  public assignDecision(id: string, assignedTo: string, dueDate: string): void {
    const dec = this.decisions.find(d => d.id === id);
    if (dec) {
      dec.assignedTo = assignedTo;
      dec.dueDate = dueDate;
      this.saveToLocalStorage();
    }
  }

  /**
   * Check if a decision is overdue.
   */
  private isOverdue(dec: GovernanceDecision): boolean {
    if (dec.status === 'COMPLETED' || dec.status === 'CANCELLED') return false;
    if (dec.status === 'OVERDUE') return true;
    if (dec.dueDate) {
      const due = new Date(dec.dueDate);
      const today = new Date();
      // Reset hours to compare dates only
      due.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      return due < today;
    }
    return false;
  }

  // ==========================================
  // SCORE & METRICS CALCULATIONS
  // ==========================================

  /**
   * Governance Execution Index 2.0 (GEI Simple Score)
   * Formula: (completed / total) * 100
   */
  public calculateGeiSimpleScore(scenario: ESGIMScenario): number {
    this.ensureBaselineDecisions(scenario);
    const total = this.decisions.length;
    if (total === 0) return 100;
    const completed = this.decisions.filter(d => d.status === 'COMPLETED').length;
    return Math.round((completed / total) * 100);
  }

  /**
   * Governance Execution Index 2.0 (GEI Weighted Score)
   * Formula: 40% execution completion + 30% on-time status + 30% risk-weighted completion
   */
  public calculateGeiWeightedScore(scenario: ESGIMScenario): number {
    this.ensureBaselineDecisions(scenario);
    const total = this.decisions.length;
    if (total === 0) return 100;

    // 1. Completion (40% weight)
    const completedCount = this.decisions.filter(d => d.status === 'COMPLETED').length;
    const completionPart = (completedCount / total) * 40;

    // 2. On-Time / Delay (30% weight)
    // Non-overdue rate
    const overdueCount = this.decisions.filter(d => this.isOverdue(d)).length;
    const onTimePart = ((total - overdueCount) / total) * 30;

    // 3. Risk-weighted (30% weight)
    // Map risks: Critical = 4, High = 3, Moderate = 2, Low = 1
    const getRiskWeight = (risk: DecisionExecutionRisk): number => {
      switch (risk) {
        case 'CRITICAL': return 4;
        case 'HIGH': return 3;
        case 'MODERATE': return 2;
        case 'LOW':
        default: return 1;
      }
    };

    let totalWeight = 0;
    let completedWeight = 0;
    this.decisions.forEach(d => {
      const w = getRiskWeight(d.executionRisk);
      totalWeight += w;
      if (d.status === 'COMPLETED') {
        completedWeight += w;
      }
    });

    const riskWeightedPart = totalWeight > 0 ? (completedWeight / totalWeight) * 30 : 30;

    return Math.round(completionPart + onTimePart + riskWeightedPart);
  }

  /**
   * Governance Accountability Index (GAI™)
   * Formula: (assigned / total) * 100
   */
  public calculateGaiScore(scenario: ESGIMScenario): number {
    this.ensureBaselineDecisions(scenario);
    const total = this.decisions.length;
    if (total === 0) return 100;
    const assigned = this.decisions.filter(d => d.assignedTo && d.assignedTo.trim().length > 0).length;
    return Math.round((assigned / total) * 100);
  }

  /**
   * Overdue Rate
   */
  public calculateOverdueRate(scenario: ESGIMScenario): number {
    this.ensureBaselineDecisions(scenario);
    const total = this.decisions.length;
    if (total === 0) return 0;
    const overdue = this.decisions.filter(d => this.isOverdue(d)).length;
    return Math.round((overdue / total) * 100);
  }

  /**
   * Decision Aging statistics
   */
  public calculateAgingBuckets(scenario: ESGIMScenario) {
    this.ensureBaselineDecisions(scenario);
    let bucket30 = 0;   // 0-30 days
    let bucket90 = 0;   // 31-90 days
    let bucket180 = 0;  // 91-180 days
    let bucket180Plus = 0; // 180+ days

    const today = new Date().getTime();

    this.decisions.forEach(d => {
      const created = new Date(d.createdAt).getTime();
      const ageMs = today - created;
      const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

      if (ageDays <= 30) bucket30++;
      else if (ageDays <= 90) bucket90++;
      else if (ageDays <= 180) bucket180++;
      else bucket180Plus++;
    });

    return {
      bucket30,
      bucket90,
      bucket180,
      bucket180Plus
    };
  }
}

export const decisionRegistryEngine = DecisionRegistryEngine.getInstance();
