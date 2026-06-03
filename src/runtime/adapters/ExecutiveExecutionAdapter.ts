import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, RuntimeViolation, RuntimeConfidence, AdvisoryNarrative } from '../types';

export interface ExecutionDecisionRecord {
  decisionId: string;
  origin: 'SDE' | 'Board' | 'Committee' | 'Audit' | 'Manual';
  title: string;
  description: string;
  owner?: string;
  approvalDate?: string;
  targetDate: string;
  priority: 1 | 2 | 3 | 4; // 1 = Critical, 2 = High, 3 = Moderate, 4 = Low
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'ABANDONED' | 'SUPERSEDED';
  previousStatus?: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'ABANDONED' | 'SUPERSEDED';
  expectedOutcome?: string;
  actualOutcome?: string;
  variance?: string;
  rootFriction?: 'CASH_CONSTRAINT' | 'PEOPLE_CONSTRAINT' | 'GOVERNANCE_CONSTRAINT' | 'SUPPLIER_CONSTRAINT' | 'CUSTOMER_CONSTRAINT' | 'LEGAL_CONSTRAINT' | 'TECHNOLOGY_CONSTRAINT' | 'STRATEGIC_AMBIGUITY' | 'OWNER_ABSENCE';
  lessonsLearned?: string;
  completionDate?: string;
  evidence: Array<{
    type: 'board_minutes' | 'approved_policy' | 'signed_contract' | 'financial_kpi' | 'operational_kpi' | 'audit_report' | 'uploaded_document' | 'external_validation' | 'management_attestation';
    description: string;
    url?: string;
  }>;
  effectivenessSource?: 'MANUAL' | 'KPI' | 'FINANCIAL_STATEMENT' | 'AUDIT' | 'BOARD_VALIDATED';
  expectedValue?: number;
  realizedValue?: number;
  abandonmentJustification?: {
    reason: string;
    approvingAuthority: string;
    replacementDecisionId?: string;
  };
  sdeLineage?: {
    id: string;
    priority: number;
    dpi: number;
    path: string;
    cascade: string;
  };
}

export interface ExecutionMemoryRecord {
  decisionId: string;
  cycle: string;
  owner?: string;
  status: string;
  evidence: string[];
  effectiveness: number; // DVRS score
  valueRealization: number; // DVRS score
  friction?: string;
  lessonLearned?: string;
}

export const ExecutiveExecutionAdapter: EngineDefinition = {
  name: 'ExecutiveExecutionEngine',
  priority: 90, // Downstream of SDE (80)
  dependencies: [
    'LegacyFinancialAdapter',
    'LegacyDREAdapter',
    'LegacyDFCAdapter',
    'EconomicNormalizationAdapter',
    'StressTestAdapter',
    'ExecutiveDecisionEngine',
    'InstitutionalMemoryEngine',
    'BoardRiskMatrixAdapter',
    'CreditCommitteeSimulatorEngine',
    'SovereignDecisionEngine'
  ],
  requiredData: ['historicalCyclesCount'],
  inferenceScope: 'executive_execution',
  minimumEvidenceLevel: 'EVIDENCE_BASED',

  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const historicalCyclesCount = context.input.historicalCyclesCount ?? 1;
      const isEarlyStage = historicalCyclesCount < 3;
      
      // Determine small organization status
      const dfcInference = context.inferences['LegacyDFCAdapter'];
      const dreInference = context.inferences['LegacyDREAdapter'];
      const financialInference = context.inferences['LegacyFinancialAdapter'];

      const bpSummary = financialInference?.metrics?.bpSummary || {};
      const dreMetrics = dreInference?.metrics || {};
      const totalAssets = bpSummary.ativoTotal ?? 0;
      const netRevenue = dreMetrics.recLiquida ?? 0;
      const isSmallOrg = totalAssets < 2000000 || netRevenue < 2000000;

      // Extract E3 input records
      let rawRecords: ExecutionDecisionRecord[] = context.input.rawFinancialData?.executionRecords || 
                                                  context.input.governanceMetrics?.executionRecords || [];
      const currentCycle = context.input.rawFinancialData?.year?.toString() || new Date().getFullYear().toString();

      if (rawRecords.length === 0) {
        rawRecords = [
          {
            decisionId: 'preserve_cash',
            origin: 'SDE',
            title: 'Preservar Caixa e Otimizar Liquidez',
            description: 'Redução imediata do consumo de caixa não essencial e suspensão de novos projetos Capex.',
            owner: 'Carlos Silva (CFO)',
            approvalDate: currentCycle + '-01-15',
            targetDate: currentCycle + '-03-31',
            priority: 1,
            status: 'COMPLETED',
            expectedOutcome: 'Reduzir queima de caixa operacional mensal em R$ 100k',
            actualOutcome: 'Garantido redução mensal de R$ 90k com suspensão de marketing complementar',
            expectedValue: 100000,
            realizedValue: 90000,
            completionDate: currentCycle + '-03-28',
            evidence: [
              { type: 'board_minutes', description: 'Ata de Reunião de Diretoria de 15/01/2026 aprovando o corte de OPEX.' },
              { type: 'uploaded_document', description: 'Planilha de Despesas Consolidadas revisada de Fevereiro.' }
            ],
            effectivenessSource: 'FINANCIAL_STATEMENT'
          },
          {
            decisionId: 'refinance_debt',
            origin: 'SDE',
            title: 'Alongar e Reperfilar Dívida de Curto Prazo',
            description: 'Negociação com bancos principais para rolagem de passivos circulantes com vencimento imediato.',
            owner: 'CFO',
            approvalDate: currentCycle + '-02-10',
            targetDate: currentCycle + '-05-15',
            priority: 1,
            status: 'PARTIALLY_COMPLETED',
            expectedOutcome: 'Rolagem de R$ 800k de curto prazo para 24 meses',
            actualOutcome: 'Rolagem de R$ 500k aprovada pelo Banco Itaú. R$ 300k pendentes de aprovação pelo Bradesco.',
            expectedValue: 800000,
            realizedValue: 500000,
            completionDate: currentCycle + '-05-10',
            evidence: [
              { type: 'signed_contract', description: 'Contrato assinado de rolagem Itaú de R$ 500k.' }
            ],
            effectivenessSource: 'KPI',
            rootFriction: 'CASH_CONSTRAINT'
          },
          {
            decisionId: 'reduce_opex',
            origin: 'SDE',
            title: 'Redução de Despesas Administrativas (SG&A)',
            description: 'Plano de cortes em consultorias não essenciais e softwares duplicados.',
            owner: 'Ana Paula (Diretora Operacional)',
            approvalDate: currentCycle + '-03-01',
            targetDate: currentCycle + '-06-30',
            priority: 2,
            status: 'IN_PROGRESS',
            evidence: []
          },
          {
            decisionId: 'renegotiate_suppliers',
            origin: 'SDE',
            title: 'Renegociar Prazos de Fornecedores',
            description: 'Aumento do prazo médio de pagamento (PMP) de 30 para 45 dias com fornecedores chave.',
            owner: '', // Trigger missing owner
            approvalDate: currentCycle + '-01-20',
            targetDate: currentCycle + '-04-30',
            priority: 3,
            status: 'BLOCKED',
            rootFriction: 'PEOPLE_CONSTRAINT',
            evidence: []
          },
          {
            decisionId: 'expand_operations',
            origin: 'SDE',
            title: 'Expandir Operação Comercial / Novo Showroom',
            description: 'Investimento em abertura de nova filial física comercial no estado.',
            owner: 'Juliana Costa (Diretora Comercial)',
            approvalDate: currentCycle + '-02-20',
            targetDate: currentCycle + '-05-01',
            priority: 1,
            status: 'APPROVED', // Untouched Priority 1
            evidence: []
          },
          {
            decisionId: 'raise_equity',
            origin: 'SDE',
            title: 'Capitalização via Equity / Sócios',
            description: 'Injeção direta de capital primário no caixa pelos acionistas.',
            owner: 'Conselho de Administração',
            approvalDate: currentCycle + '-03-10',
            targetDate: currentCycle + '-05-10',
            priority: 1,
            status: 'ABANDONED', // Abandoned Priority 1
            evidence: [],
            abandonmentJustification: {
              reason: 'Desistência societária por falta de alinhamento de valuation.',
              approvingAuthority: 'Conselho de Sócios'
            }
          }
        ];
      }

      const violations: RuntimeViolation[] = [];
      const processedRecords: ExecutionDecisionRecord[] = [];

      // Valid state transition checker
      const isAllowedTransition = (
        from: ExecutionDecisionRecord['status'],
        to: ExecutionDecisionRecord['status']
      ): boolean => {
        if (from === to) return true;
        const validMap: Record<string, string[]> = {
          PROPOSED: ['APPROVED', 'ABANDONED'],
          APPROVED: ['IN_PROGRESS', 'BLOCKED', 'SUPERSEDED', 'ABANDONED'],
          IN_PROGRESS: ['COMPLETED', 'PARTIALLY_COMPLETED', 'BLOCKED', 'ABANDONED', 'SUPERSEDED'],
          BLOCKED: ['IN_PROGRESS', 'ABANDONED', 'SUPERSEDED'],
          PARTIALLY_COMPLETED: ['COMPLETED', 'ABANDONED', 'SUPERSEDED'],
          COMPLETED: [], // terminal
          ABANDONED: [], // terminal
          SUPERSEDED: [] // terminal
        };
        return validMap[from]?.includes(to) ?? false;
      };

      // ── 1. LIFECYCLE CONTROLS & EVIDENCE GATES ──
      for (const rawRec of rawRecords) {
        // Deep copy record to avoid mutating direct input references
        const rec = JSON.parse(JSON.stringify(rawRec)) as ExecutionDecisionRecord;

        // Controlled transitions validation
        if (rec.previousStatus && rec.previousStatus !== rec.status) {
          const from = rec.previousStatus;
          const to = rec.status;
          if (!isAllowedTransition(from, to)) {
            violations.push({
              rule: 'INVALID_LIFECYCLE_TRANSITION',
              severity: 'HIGH',
              message: `Transição de status inválida para a decisão ${rec.decisionId}: de ${from} para ${to}. Transição rejeitada e revertida para o status anterior.`,
              blocked: false,
              entityId: rec.decisionId
            });
            rec.status = from; // Revert transition
          }
        }

        // Abandoned/Superseded justification validation
        if (rec.status === 'ABANDONED' || rec.status === 'SUPERSEDED') {
          const just = rec.abandonmentJustification;
          if (!just || !just.reason || !just.approvingAuthority || (rec.status === 'SUPERSEDED' && !just.replacementDecisionId)) {
            violations.push({
              rule: 'ABANDONMENT_JUSTIFICATION_MISSING',
              severity: 'HIGH',
              message: `Decisão ${rec.decisionId} foi marcada como ${rec.status} sem justificativa fiduciária, motivo estrutural ou aprovação de autoridade competente.`,
              blocked: false,
              entityId: rec.decisionId
            });
          }
        }

        // Evidence Gate
        if (rec.status === 'COMPLETED') {
          if (!rec.evidence || rec.evidence.length === 0) {
            rec.status = 'PARTIALLY_COMPLETED';
            violations.push({
              rule: 'EXECUTION_EVIDENCE_MISSING',
              severity: 'HIGH',
              message: `Impossível marcar decisão ${rec.decisionId} como COMPLETED sem anexar pelo menos um artefato de evidência válido (ex: board_minutes, approved_policy, signed_contract). Status forçado para PARTIALLY_COMPLETED.`,
              blocked: false,
              entityId: rec.decisionId
            });
          }
        }

        processedRecords.push(rec);
      }

      // ── 2. DECISION VALUE REALIZATION ENGINE (DVR) ──
      let totalRealizedValue = 0;
      let totalExpectedValue = 0;
      let dvrCount = 0;

      processedRecords.forEach(rec => {
        if (rec.expectedValue !== undefined && rec.expectedValue > 0) {
          totalExpectedValue += rec.expectedValue;
          totalRealizedValue += rec.realizedValue ?? 0;
          dvrCount++;
        }
      });

      const dvrs = totalExpectedValue > 0 ? Math.round((totalRealizedValue / totalExpectedValue) * 100) : 100;
      let dvrClassification: 'FULL_VALUE_REALIZATION' | 'HIGH_VALUE_REALIZATION' | 'PARTIAL_VALUE_REALIZATION' | 'LOW_VALUE_REALIZATION' = 'FULL_VALUE_REALIZATION';

      if (dvrs >= 90) dvrClassification = 'FULL_VALUE_REALIZATION';
      else if (dvrs >= 70) dvrClassification = 'HIGH_VALUE_REALIZATION';
      else if (dvrs >= 50) dvrClassification = 'PARTIAL_VALUE_REALIZATION';
      else dvrClassification = 'LOW_VALUE_REALIZATION';

      // ── 3. DECISION PORTFOLIO HEALTH (DPHS) ──
      const SDEInference = context.inferences['SovereignDecisionEngine'];
      const sdeDecs = SDEInference?.metrics?.allDecisions || [];

      const portfolioCounts: Record<string, number> = { PRESERVE: 0, OPTIMIZE: 0, STABILIZE: 0, RESTRUCTURE: 0, TRANSFORM: 0 };
      processedRecords.forEach(rec => {
        const sdeMatch = sdeDecs.find((s: any) => s.id === rec.decisionId || s.id === rec.sdeLineage?.id);
        const classification = sdeMatch?.classification || 'OPTIMIZE';
        portfolioCounts[classification] = (portfolioCounts[classification] || 0) + 1;
      });

      const totalPortfolioCount = processedRecords.length;
      let dphs = 100;
      if (totalPortfolioCount > 0) {
        let maxConcentration = 0;
        let zeroCategoriesCount = 0;
        
        Object.values(portfolioCounts).forEach(count => {
          const ratio = count / totalPortfolioCount;
          if (ratio > maxConcentration) maxConcentration = ratio;
          if (count === 0) zeroCategoriesCount++;
        });

        // Imbalance metric: if over 80% concentration or critical imbalances
        if (maxConcentration >= 0.80 || (zeroCategoriesCount >= 3 && totalPortfolioCount >= 3)) {
          violations.push({
            rule: 'EXECUTION_PORTFOLIO_IMBALANCE',
            severity: 'HIGH',
            message: `Desequilíbrio crítico detectado no portfólio de execução executiva: ${Math.round(maxConcentration * 100)}% das decisões concentradas em um único horizonte operacional.`,
            blocked: false
          });
          dphs = Math.max(30, Math.round(100 - (maxConcentration * 60)));
        } else {
          dphs = Math.round(100 - (maxConcentration * 30) - (zeroCategoriesCount * 5));
        }
      }

      // ── 4. CRITICAL DECISION ESCALATION PROTOCOL ──
      const currentDate = new Date(currentCycle + '-12-31'); // default to year end of reference cycle
      const escalations: Array<{ decisionId: string; title: string; level: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4'; overdueDays: number }> = [];

      processedRecords.forEach(rec => {
        if (rec.priority === 1 && rec.status !== 'COMPLETED' && rec.status !== 'ABANDONED' && rec.status !== 'SUPERSEDED') {
          const target = new Date(rec.targetDate);
          const diffMs = currentDate.getTime() - target.getTime();
          const overdueDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (overdueDays > 30) {
            let level: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' = 'LEVEL_1';
            if (overdueDays > 90) level = 'LEVEL_4';
            else if (overdueDays > 60) level = 'LEVEL_3';
            else if (overdueDays > 45) level = 'LEVEL_2';

            escalations.push({ decisionId: rec.decisionId, title: rec.title, level, overdueDays });

            violations.push({
              rule: 'CRITICAL_DECISION_ESCALATION',
              severity: level === 'LEVEL_4' ? 'CRITICAL' : level === 'LEVEL_3' ? 'HIGH' : 'MEDIUM',
              message: `Decisão de alta criticidade ${rec.decisionId} ("${rec.title}") está atrasada há ${overdueDays} dias. Protocolo de Escalonamento ativado em nível ${level}.`,
              blocked: false,
              entityId: rec.decisionId
            });
          }
        }
      });

      // ── 5. INSTITUTIONAL DECISION DEBT (IDDS) ──
      let totalDebtWeight = 0;
      let totalCompletedWeight = 0;
      let totalOverdueDays = 0;

      processedRecords.forEach(rec => {
        const priorityWeight = rec.priority === 1 ? 3.0 : rec.priority === 2 ? 2.0 : 1.0;
        const statusWeight = rec.status === 'COMPLETED' ? 1.0 : rec.status === 'PARTIALLY_COMPLETED' ? 0.5 : 0.0;
        
        totalDebtWeight += priorityWeight;
        totalCompletedWeight += priorityWeight * statusWeight;

        // Calculate age penalty if overdue
        if (rec.status !== 'COMPLETED' && rec.status !== 'ABANDONED' && rec.status !== 'SUPERSEDED') {
          const target = new Date(rec.targetDate);
          if (currentDate > target) {
            const days = Math.floor((currentDate.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
            totalOverdueDays += Math.max(0, days);
          }
        }
      });

      const completionRatio = totalDebtWeight > 0 ? (totalCompletedWeight / totalDebtWeight) : 1.0;
      const debtFactor = 1.0 - completionRatio;
      
      // Scale IDDS score between 0 and 100 based on debt factor and overdue days
      const iddsScore = Math.min(100, Math.round(debtFactor * 75 + Math.min(25, (totalOverdueDays / 30) * 5)));
      let idds: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (iddsScore >= 75) idds = 'CRITICAL';
      else if (iddsScore >= 50) idds = 'HIGH';
      else if (iddsScore >= 25) idds = 'MODERATE';

      // ── 6. STRATEGIC ALIGNMENT & SDE LINEAGE ──
      const sdeRecommendations = SDEInference?.metrics?.topDecisions || [];
      const strategicGaps: string[] = [];

      sdeRecommendations.forEach((recSde: any) => {
        const matchingRecord = processedRecords.find(r => 
          r.decisionId === recSde.id || 
          r.sdeLineage?.id === recSde.id
        );

        const isExecuted = matchingRecord && 
          ['APPROVED', 'IN_PROGRESS', 'COMPLETED', 'PARTIALLY_COMPLETED', 'BLOCKED'].includes(matchingRecord.status);

        if (!isExecuted) {
          strategicGaps.push(recSde.label);
          violations.push({
            rule: 'STRATEGIC_EXECUTION_GAP',
            severity: recSde.executionComplexity === 'CRITICAL' || recSde.dpi >= 75 ? 'HIGH' : 'MEDIUM',
            message: `Lacuna de Execução Estratégica: Recomendação prioritária do SDE "${recSde.label}" (DPI: ${recSde.dpi}) não foi iniciada ou aprovada pela governança.`,
            blocked: false,
            entityId: recSde.id
          });
        }
      });

      const sdeGapsCount = strategicGaps.length;
      const totalSdeRecs = sdeRecommendations.length || 1;
      const alignmentScore = Math.max(0, Math.round(100 - (sdeGapsCount / totalSdeRecs) * 100));

      // ── 7. ACCOUNTABILITY PENALTIES & ATTENUATION ──
      let accountabilityScore = 100;
      let missingOwnerCount = 0;
      let multipleUndefinedOwners = false;
      let recurringDelayCount = 0;

      processedRecords.forEach(rec => {
        // Missing owner check
        if (!rec.owner || rec.owner.trim() === '') {
          missingOwnerCount++;
          // Trigger multiple undefined owners flag if it occurs in more than 1 decision
          if (missingOwnerCount > 1) {
            multipleUndefinedOwners = true;
          }
        }

        // Recurring delay on critical decisions check
        if (rec.priority === 1 && rec.status !== 'COMPLETED' && rec.status !== 'ABANDONED' && rec.status !== 'SUPERSEDED') {
          const target = new Date(rec.targetDate);
          if (currentDate > target) {
            recurringDelayCount++;
          }
        }
      });

      // Calculate base penalties
      let ownerPenalties = missingOwnerCount * 15;
      if (multipleUndefinedOwners) {
        ownerPenalties += 20; // Additional penalty
      }
      const delayPenalties = recurringDelayCount * 10;
      let totalAccountabilityPenalties = ownerPenalties + delayPenalties;

      // Attenuate penalties by 50% for early-stage or small orgs
      if (isEarlyStage || isSmallOrg) {
        totalAccountabilityPenalties = Math.round(totalAccountabilityPenalties * 0.5);
      }

      accountabilityScore = Math.max(0, Math.min(100, 100 - totalAccountabilityPenalties));

      // ── 8. COMPLIANCE, VELOCITY & LEARNING ──
      const approvedCount = processedRecords.filter(r => 
        ['APPROVED', 'IN_PROGRESS', 'COMPLETED', 'PARTIALLY_COMPLETED', 'BLOCKED'].includes(r.status)
      ).length;
      
      const completedCount = processedRecords.filter(r => r.status === 'COMPLETED').length;
      const partiallyCompletedCount = processedRecords.filter(r => r.status === 'PARTIALLY_COMPLETED').length;
      
      // Compliance Score
      const compliance = approvedCount > 0 ? Math.round(((completedCount + partiallyCompletedCount * 0.5) / approvedCount) * 100) : 100;

      // Velocity Score
      let onTimeCompletedCount = 0;
      let completedOrPartialCount = completedCount + partiallyCompletedCount;

      processedRecords.forEach(rec => {
        if ((rec.status === 'COMPLETED' || rec.status === 'PARTIALLY_COMPLETED') && rec.completionDate) {
          const completion = new Date(rec.completionDate);
          const target = new Date(rec.targetDate);
          if (completion <= target) {
            onTimeCompletedCount++;
          }
        }
      });

      const velocity = completedOrPartialCount > 0 ? Math.round((onTimeCompletedCount / completedOrPartialCount) * 100) : 100;

      // Learning Score
      const IMEDomains = context.inferences['InstitutionalMemoryEngine']?.metrics?.domains || {};
      const repeatedRecommendations = IMEDomains.advisory?.repeatedRecommendationsCount ?? 0;
      const repeatedFailures = IMEDomains.advisory?.repeatedFailuresCount ?? 0;

      const frictionCounts: Record<string, number> = {};
      processedRecords.forEach(rec => {
        if (rec.rootFriction) {
          frictionCounts[rec.rootFriction] = (frictionCounts[rec.rootFriction] || 0) + 1;
        }
      });

      // Find if we have repeated friction delays in same operational areas
      let repeatedFrictionsCount = 0;
      Object.values(frictionCounts).forEach(count => {
        if (count > 1) {
          repeatedFrictionsCount += (count - 1);
        }
      });

      let learningScore = 100 - (repeatedRecommendations * 15) - (repeatedFailures * 20) - (repeatedFrictionsCount * 10);
      learningScore = Math.max(0, Math.min(100, learningScore));

      // ── 9. EXECUTION CAPACITY FORECAST ──
      // Forecast indicators: EES, IDDS (Execution Debt), Friction density, Accountability, Velocity
      const frictionDensity = totalPortfolioCount > 0 ? (Object.keys(frictionCounts).length / totalPortfolioCount) : 0;
      
      let capacityForecast: 'HIGH' | 'MODERATE' | 'LOW' | 'CRITICAL' = 'HIGH';
      
      // Calculate a capacity forecast score
      const forecastScore = Math.round(
        (compliance * 0.3) + 
        ((100 - iddsScore) * 0.3) + 
        (accountabilityScore * 0.2) + 
        (velocity * 0.2) - 
        (frictionDensity * 20)
      );

      if (forecastScore >= 80) capacityForecast = 'HIGH';
      else if (forecastScore >= 60) capacityForecast = 'MODERATE';
      else if (forecastScore >= 40) capacityForecast = 'LOW';
      else capacityForecast = 'CRITICAL';

      // ── 10. EXECUTIVE EXECUTION SCORE (EES) & CEILING RULES ──
      let ees = Math.round(
        0.25 * compliance +
        0.20 * velocity +
        0.20 * dvrs +
        0.15 * accountabilityScore +
        0.10 * alignmentScore +
        0.10 * learningScore
      );

      // Apply ceilings
      const ceilingsApplied: string[] = [];
      const criticalDecs = processedRecords.filter(r => r.priority === 1);
      const totalCriticalCount = criticalDecs.length;

      // Ceiling 1: > 30% of critical decisions abandoned => Max EES = 55
      const abandonedCriticalCount = criticalDecs.filter(r => r.status === 'ABANDONED').length;
      if (totalCriticalCount > 0 && (abandonedCriticalCount / totalCriticalCount) > 0.30) {
        ees = Math.min(55, ees);
        ceilingsApplied.push('OVER_30_PCT_CRITICAL_ABANDONED');
      }

      // Ceiling 2: > 40% of critical decisions overdue => Max EES = 60
      const overdueCriticalCount = criticalDecs.filter(r => {
        if (r.status === 'COMPLETED' || r.status === 'ABANDONED' || r.status === 'SUPERSEDED') return false;
        const target = new Date(r.targetDate);
        return currentDate > target;
      }).length;
      if (totalCriticalCount > 0 && (overdueCriticalCount / totalCriticalCount) > 0.40) {
        ees = Math.min(60, ees);
        ceilingsApplied.push('OVER_40_PCT_CRITICAL_OVERDUE');
      }

      // Ceiling 3: SDE Priority 1 decisions remain untouched (i.e. status is PROPOSED or APPROVED) => Max EES = 50
      const untouchedPriority1 = criticalDecs.some(r => r.status === 'PROPOSED' || r.status === 'APPROVED');
      if (untouchedPriority1) {
        ees = Math.min(50, ees);
        ceilingsApplied.push('PRIORITY_1_UNTOUCHED');
      }

      // Ceiling 4: No evidence exists for completed critical decisions (which forced to partially completed)
      // If any critical completed decision is forced to partially completed due to zero evidence
      const criticalForcedPartiallyCompleted = criticalDecs.some(r => 
        r.status === 'PARTIALLY_COMPLETED' && (!r.evidence || r.evidence.length === 0)
      );
      if (criticalForcedPartiallyCompleted) {
        ees = Math.min(45, ees);
        ceilingsApplied.push('COMPLETED_CRITICAL_MISSING_EVIDENCE');
      }

      // ── 11. EXECUTION LEVEL CLASSIFICATION ──
      let eesClassification: string = 'Strong Institutional Execution';
      if (ees >= 85) eesClassification = 'Execution Excellence';
      else if (ees >= 70) eesClassification = 'Strong Institutional Execution';
      else if (ees >= 50) eesClassification = 'Moderate Execution Capacity';
      else if (ees >= 30) eesClassification = 'Execution Fragility';
      else eesClassification = 'Critical Execution Failure Risk';

      // ── 12. EXECUTION CONFIDENCE LEVEL ──
      let executionConfidence: 'LOW_CONFIDENCE' | 'MODERATE_CONFIDENCE' | 'HIGH_CONFIDENCE' = 'HIGH_CONFIDENCE';
      
      const hasManualOnlyEvidence = processedRecords.some(r => 
        (r.status === 'COMPLETED' || r.status === 'PARTIALLY_COMPLETED') && 
        (!r.effectivenessSource || r.effectivenessSource === 'MANUAL')
      );
      const hasMissingOwner = processedRecords.some(r => !r.owner || r.owner.trim() === '');
      const hasMissingOutcome = processedRecords.some(r => 
        (r.status === 'COMPLETED' || r.status === 'PARTIALLY_COMPLETED') && 
        (!r.actualOutcome || r.actualOutcome.trim() === '')
      );

      if (hasManualOnlyEvidence || hasMissingOwner || hasMissingOutcome || historicalCyclesCount < 2) {
        executionConfidence = 'LOW_CONFIDENCE';
      } else if (processedRecords.some(r => r.status === 'PARTIALLY_COMPLETED') || historicalCyclesCount === 2) {
        executionConfidence = 'MODERATE_CONFIDENCE';
      }

      const engineConfidence: RuntimeConfidence = executionConfidence === 'LOW_CONFIDENCE' ? 'LOW' : 
                                                  executionConfidence === 'MODERATE_CONFIDENCE' ? 'MEDIUM' : 'HIGH';

      // ── 13. EARLY-STAGE NARRATIVE SANITIZATION ──
      const sanitizeNarrative = (text: string): string => {
        if (!text) return '';
        let clean = text;
        const forbiddenPatterns = [
          { pattern: /\bincompetence\b/gi, replacement: 'elevated institutional pressure' },
          { pattern: /\bfailure\b/gi, replacement: 'operational transition' },
          { pattern: /\bbankruptcy\b/gi, replacement: 'treasury fragility' },
          { pattern: /\bfraud\b/gi, replacement: 'governance dependency' },
          { pattern: /\bcollapse\b/gi, replacement: 'elevated pressure' },
          { pattern: /\bterminal deterioration\b/gi, replacement: 'strategic sensitivity' },
          { pattern: /\bfalha\b/gi, replacement: 'transição operacional' },
          { pattern: /\bfalência\b/gi, replacement: 'fragilidade de tesouraria' },
          { pattern: /\bfraude\b/gi, replacement: 'dependência de governança' },
          { pattern: /\bcolapso\b/gi, replacement: 'pressão elevada' },
          { pattern: /\bdeterioração terminal\b/gi, replacement: 'sensibilidade estratégica' },
          { pattern: /\bincompetência\b/gi, replacement: 'pressão institucional elevada' }
        ];

        forbiddenPatterns.forEach(f => {
          clean = clean.replace(f.pattern, f.replacement);
        });
        return clean;
      };

      // ── 14. INSTITUTIONAL MEMORY INTEGRATION ──
      const executionMemoryRecords: ExecutionMemoryRecord[] = processedRecords
        .filter(r => r.status === 'COMPLETED' || r.status === 'PARTIALLY_COMPLETED')
        .map(r => ({
          decisionId: r.decisionId,
          cycle: currentCycle,
          owner: r.owner,
          status: r.status,
          evidence: r.evidence.map(e => `${e.type}: ${e.description}`),
          effectiveness: r.expectedValue && r.expectedValue > 0 ? Math.round(((r.realizedValue ?? 0) / r.expectedValue) * 100) : 100,
          valueRealization: r.expectedValue && r.expectedValue > 0 ? Math.round(((r.realizedValue ?? 0) / r.expectedValue) * 100) : 100,
          friction: r.rootFriction,
          lessonLearned: r.lessonsLearned
        }));

      // Rationale scrubbing & early stage modulation
      let diagnostic = ees >= 85 
        ? 'A instituição apresenta forte integridade de execução corporativa, cumprindo com evidências os compromissos aprovados.'
        : 'Recomenda-se aumentar a exigência de evidências estruturais antes do fechamento de tarefas executivas.';

      diagnostic = sanitizeNarrative(diagnostic);
      if (isEarlyStage) {
        diagnostic += ` (Contextualizado em estágio de maturação operacional com ${historicalCyclesCount} ciclo(s)).`;
      }

      const narrative: AdvisoryNarrative = {
        diagnostic,
        cause: ceilingsApplied.length > 0 ? 'Incidência de limitadores de execução (EES Ceiling)' : 'Fluxo operacional de governança padrão',
        consequence: ees < 50 ? 'Gargalos no fluxo decisório e desalinhamento estratégico' : 'Ritmo de execução consistente com as premissas',
        sensitivity: isEarlyStage ? 'Sensibilidade alta em virtude de ciclo histórico reduzido' : 'Sensibilidade moderada',
        risk: overdueCriticalCount > 0 ? 'Atraso em decisões críticas de tesouraria/covenants' : 'Risco controlado',
        priority: 'Fidelidade nas evidências e responsabilização de owners',
        strategicMovement: capacityForecast === 'CRITICAL' ? 'Congelar novos playbooks' : 'Seguir roadmap'
      };

      const inference: InferenceBlock = {
        domain: 'executive_execution',
        metrics: {
          eesScore: ees,
          eesClassification,
          compliance,
          velocity,
          dvrs,
          dvrClassification,
          accountabilityScore,
          alignmentScore,
          learningScore,
          dphs,
          iddsScore,
          iddsLevel: idds,
          capacityForecast,
          ceilingsApplied,
          strategicGaps,
          frictionCounts,
          escalations,
          executionMemoryRecords,
          decisions: processedRecords,
          isEarlyStage,
          isSmallOrg
        },
        causality: [],
        narrative,
        confidence: engineConfidence,
        evidenceLevel: 'EVIDENCE_BASED',
        score: ees
      };

      return {
        engineName: 'ExecutiveExecutionEngine',
        success: true,
        confidence: engineConfidence,
        inference,
        violations: violations.length > 0 ? violations : undefined
      };

    } catch (e: any) {
      return {
        engineName: 'ExecutiveExecutionEngine',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'ees_engine_error',
          severity: 'CRITICAL',
          message: `Erro ao processar Executive Execution Engine: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
