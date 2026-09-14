import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../../../../runtime/types';

export const InstitutionalMemoryAdapter: EngineDefinition = {
  name: 'InstitutionalMemoryEngine',
  priority: 60, // Runs after ENE (35) and ExecutiveDecisionEngine (50)
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter', 'EconomicNormalizationAdapter', 'StressTestAdapter', 'ExecutiveDecisionEngine'],
  requiredData: ['historicalCyclesCount'],
  inferenceScope: 'institutional_memory',
  minimumEvidenceLevel: 'EVIDENCE_BASED',

  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const allHistoryData = context.input.rawFinancialData?.allHistoryData || [];
      const filterYear = Number(context.input.rawFinancialData?.filterYear || context.input.rawFinancialData?.year || new Date().getFullYear());
      const historicalCyclesCount = context.input.historicalCyclesCount ?? 1;

      // Downstream inferences
      const eneInference = context.inferences['EconomicNormalizationAdapter'];
      const eneMetrics = eneInference?.metrics || {};

      // Text normalization helpers
      const normalizeString = (s: string): string => 
        s.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/^[0-9.]+\s*[-]\s*/, '')
          .replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '')
          .trim();

      const matchDocType = (d: any, docTypes: string[]): boolean => {
        const typeNorm = normalizeString(d.type || '');
        const docTypeNorm = normalizeString(d.docType || '');
        const entryTypeNorm = normalizeString(d.entryType || '');
        return docTypes.some(t => {
          const tNorm = normalizeString(t);
          return (
            typeNorm === tNorm || typeNorm.includes(tNorm) ||
            docTypeNorm === tNorm || docTypeNorm.includes(tNorm) ||
            entryTypeNorm === tNorm || entryTypeNorm.includes(tNorm)
          );
        });
      };

      const getHistoricalSum = (y: number, docTypes: string[], nameFilters: string[], typeFilter?: string): number => {
        const yearEntries = allHistoryData.filter((d: any) => {
          const matchesYear = Number(d.year) === y;
          const matchesDoc = matchDocType(d, docTypes);
          const matchesType = !typeFilter || normalizeString(d.type || '') === normalizeString(typeFilter);
          return matchesYear && matchesDoc && matchesType;
        });
        let sum = 0;
        const normalizedFilters = nameFilters.map(normalizeString);
        yearEntries.forEach((d: any) => {
          const c = normalizeString(d.conta || d.category || d.item || '');
          if (normalizedFilters.some(n => c === n || c.includes(n))) {
            sum += (d.val || d.valor || d.value || 0);
          }
        });
        return sum;
      };

      const getHistoricalValue = (y: number, docTypes: string[], nameFilters: string[], typeFilter?: string): number => {
        const yearEntries = allHistoryData.filter((d: any) => {
          const matchesYear = Number(d.year) === y;
          const matchesDoc = matchDocType(d, docTypes);
          const matchesType = !typeFilter || normalizeString(d.type || '') === normalizeString(typeFilter);
          return matchesYear && matchesDoc && matchesType;
        });
        const normalizedFilters = nameFilters.map(normalizeString);
        const match = yearEntries.find((d: any) => {
          const c = normalizeString(d.conta || d.category || d.item || '');
          return normalizedFilters.some(n => c === n || c.includes(n));
        });
        return match?.val || match?.valor || match?.value || 0;
      };

      // ── 1. MAP AND COMPUTE PER-CYCLE HISTORICAL METRICS ──
      const yearsInDb = Array.from(new Set(allHistoryData.map((d: any) => Number(d.year)).filter(Boolean)));
      const cycleYears = Array.from({ length: 5 }, (_, i) => filterYear - i).filter(y => yearsInDb.includes(y));
      const sortedCycles = [...cycleYears].sort((a, b) => a - b); // chronological: e.g. [2021, 2022, 2023]

      const rawCycleMetricsList: Array<{
        year: number;
        ebitdaContabil: number;
        ebitdaNormalizado: number;
        capitalDeGiroContabil: number;
        capitalDeGiroOperacionalLiquidoAjustado: number;
        roicNormalizado: number | null;
        dividaFinanceiraReal: number;
        passivosSocietarios: number;
        fco: number;
        receitasNaoRecorrentes: number;
        estoques: number;
        creditosSocios: number;
        passivoCirculante: number;
        ativoCirculante: number;
        receitaLiquida: number;
        sga: number;
        shortTermDebt: number;
        caixaCaixa: number;
        capex: number;
        eventosExtraordinarios: number;
        patrimonioLiquido: number;
      }> = [];

      sortedCycles.forEach(y => {
        const ebitdaContabil = getHistoricalValue(y, ['dre', 'resultado'], ['ebitda', 'lajida']);
        const ebitdaNormalizado = y === filterYear && eneMetrics.ebitda?.normalizado !== undefined 
          ? eneMetrics.ebitda.normalizado
          : ebitdaContabil - getHistoricalSum(y, ['dre', 'resultado'], ['não recorrente', 'nao recorrente', 'alienacao', 'alienação', 'outras receitas', 'ganho na venda', 'recuperacao de impostos', 'recuperação de impostos', 'creditos judiciais', 'créditos judiciais']) 
                           - getHistoricalSum(y, ['dre', 'resultado'], ['socio', 'partes relacionadas', 'mutuo', 'jscp', 'pro-labore', 'retirada', 'diretoria'])
                           - getHistoricalSum(y, ['dre', 'resultado'], ['extraordinario', 'provisao', 'contingencia', 'sinistro', 'baixa de ativo', 'reestruturacao']);

        const ativoCirculante = getHistoricalSum(y, ['bp', 'balanco'], ['ativo circulante'], 'ativo');
        const passivoCirculante = getHistoricalSum(y, ['bp', 'balanco'], ['passivo circulante'], 'passivo');
        const estoques = getHistoricalSum(y, ['bp', 'balanco'], ['estoque', 'estoques', 'mercadorias'], 'ativo');
        const creditosSocios = getHistoricalSum(y, ['bp', 'balanco'], ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios', 'creditos com socios', 'conta corrente socios'], 'ativo');
        const passivosSocietarios = getHistoricalSum(y, ['bp', 'balanco'], ['mútuo sócios', 'mutuo socios', 'partes relacionadas credores', 'emprestimos de socios', 'emprestimos socios', 'conta corrente socios passivo', 'conta corrente socios', 'socio', 'socios'], 'passivo');
        
        const capitalDeGiroContabil = ativoCirculante - passivoCirculante;
        const capitalDeGiroOperacionalLiquidoAjustado = ativoCirculante - estoques - creditosSocios - passivosSocietarios;

        const patrimonioLiquido = getHistoricalSum(y, ['bp', 'balanco'], ['patrimonio liquido', 'capital social'], 'passivo');
        const passivosFinanceiros = getHistoricalSum(y, ['bp', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos'], 'passivo');
        const caixaCaixa = getHistoricalSum(y, ['bp', 'balanco'], ['caixa', 'equivalentes', 'bancos', 'disponibilidades'], 'ativo');
        const creditosSociosAtivo = getHistoricalSum(y, ['bp', 'balanco'], ['mútuo', 'sócios', 'partes relacionadas'], 'ativo');
        const capitalInvestidoOperacionalReal = patrimonioLiquido + passivosFinanceiros - caixaCaixa - creditosSociosAtivo - passivosSocietarios;
        const depreciacao = getHistoricalSum(y, ['dre', 'resultado'], ['depreciacao', 'amortizacao']);
        const ebitNormalizado = ebitdaNormalizado - depreciacao;
        const impostos = getHistoricalSum(y, ['dre', 'resultado'], ['irpj', 'csll', 'imposto de renda', 'contribuicao social', 'provisao ir']);
        const lair = getHistoricalValue(y, ['dre', 'resultado'], ['lair', 'lucro antes']);
        const effectiveTaxRate = lair > 0 ? Math.max(0, Math.min(0.34, impostos / lair)) : 0.34;
        const nopatRecorrente = ebitNormalizado * (1 - effectiveTaxRate);
        const roicNormalizado = capitalInvestidoOperacionalReal > 0 ? nopatRecorrente / capitalInvestidoOperacionalReal : null;

        const dividaFinanceiraReal = Math.max(0, passivosFinanceiros - passivosSocietarios);
        const shortTermDebt = passivosFinanceiros * (passivoCirculante > 0 ? (passivosFinanceiros > 0 ? 0.5 : 1) : 1);
        const fco = getHistoricalSum(y, ['dfc'], ['fluxo de caixa das atividades operacionais', 'fco', 'geracao operacional', 'geração operacional']) || ebitdaNormalizado;

        const capex = getHistoricalSum(y, ['dfc', 'fluxo', 'bp'], ['capex', 'investimento em imobilizado', 'aquisicao de ativo', 'aquisição de ativo']);
        const sga = getHistoricalSum(y, ['dre', 'resultado'], ['despesas operacionais', 'despesa operacional', 'despesas administrativas', 'despesas com vendas', 'admin', 'vendas', 'sg&a', 'sga']);
        const receitaLiquida = getHistoricalValue(y, ['dre', 'resultado'], ['receita liquida', 'receita operacional liquida']) || getHistoricalSum(y, ['dre', 'resultado'], ['receitas', 'faturamento']);

        rawCycleMetricsList.push({
          year: y,
          ebitdaContabil,
          ebitdaNormalizado,
          capitalDeGiroContabil,
          capitalDeGiroOperacionalLiquidoAjustado,
          roicNormalizado,
          dividaFinanceiraReal,
          passivosSocietarios,
          fco,
          receitasNaoRecorrentes: Math.abs(getHistoricalSum(y, ['dre', 'resultado'], ['não recorrente', 'nao recorrente'])),
          estoques,
          creditosSocios,
          passivoCirculante,
          ativoCirculante,
          receitaLiquida,
          sga,
          shortTermDebt,
          caixaCaixa,
          capex,
          eventosExtraordinarios: Math.abs(getHistoricalSum(y, ['dre', 'resultado'], ['extraordinario'])),
          patrimonioLiquido
        });
      });

      const isEarlyStage = historicalCyclesCount < 3;

      // ── 2. DEPENDENCY NATURE CLASSIFICATION ──
      const societaryCyclesCount = rawCycleMetricsList.filter(c => c.passivosSocietarios > 0.05 * (c.passivoCirculante || 1)).length;
      
      const cycleMetricsList = rawCycleMetricsList.map(c => {
        let dependencyNature: 'EXPANSION_SUPPORT' | 'SURVIVABILITY_SUPPORT' | 'RECURRING_TREASURY_SUPPORT' | 'STRATEGIC_CAPITALIZATION' = 'STRATEGIC_CAPITALIZATION';
        const hasSocietaryDebt = c.passivosSocietarios > 0.05 * (c.passivoCirculante || 1);
        
        if (hasSocietaryDebt) {
          if (societaryCyclesCount >= 2) {
            dependencyNature = 'RECURRING_TREASURY_SUPPORT';
          } else {
            const isHighCapex = c.capex > 0.1 * (c.receitaLiquida || 1);
            const isTreasuryStressed = c.fco < 0 || c.caixaCaixa < c.shortTermDebt;
            if (isHighCapex) {
              dependencyNature = 'EXPANSION_SUPPORT';
            } else if (isTreasuryStressed) {
              dependencyNature = 'SURVIVABILITY_SUPPORT';
            } else {
              dependencyNature = 'STRATEGIC_CAPITALIZATION';
            }
          }
        }
        return {
          ...c,
          dependencyNature
        };
      });

      const reverseCycles = [...cycleMetricsList].reverse(); // newest first
      const currentCycle = reverseCycles[0] || null;

      // ── 3. ADVISORY SEVERITY TIERS & UNRESOLVED PERSISTENCE SCALING ──
      // Track unresolved critical advisories over cycles
      let unresolvedCriticalCount = 0;
      let consecutiveCriticalCycles = 0;

      cycleMetricsList.forEach((c, idx) => {
        const isCritical = c.fco < 0 || (c.passivoCirculante > c.ativoCirculante) || (c.caixaCaixa < 0.05 * (c.receitaLiquida || 1));
        if (isCritical) {
          consecutiveCriticalCycles++;
        } else {
          consecutiveCriticalCycles = 0;
        }
        if (consecutiveCriticalCycles >= 3) {
          unresolvedCriticalCount = consecutiveCriticalCycles;
        }
      });

      // Severity scaling multiplier
      const severityMultiplier = unresolvedCriticalCount >= 3 ? 1.0 + 0.25 * (unresolvedCriticalCount - 2) : 1.0;

      // ── 4. LONGITUDINAL DECAY WEIGHTS ──
      const getDecayWeight = (cycleIndexFromCurrent: number): number => {
        if (cycleIndexFromCurrent === 0) return 1.0;
        if (cycleIndexFromCurrent === 1) return 0.7;
        if (cycleIndexFromCurrent === 2) return 0.4;
        return 0.2;
      };

      // ── 5. COMPUTE ANNUAL DOMAIN SCORES (For Heatmaps and Decay Average) ──
      const cycleScores: Record<number, {
        treasury: number;
        earnings: number;
        governance: number;
        advisory: number;
        drift: number;
        strategic: number;
      }> = {};

      cycleMetricsList.forEach((c, idx) => {
        const prev = idx > 0 ? cycleMetricsList[idx - 1] : null;

        // Domain 1: Treasury
        let treasury = 100;
        if (c.fco < 0) treasury -= 20;
        if (c.shortTermDebt > c.caixaCaixa + Math.max(0, c.fco)) treasury -= 15;
        if (prev && c.caixaCaixa < 0.8 * prev.caixaCaixa) treasury -= 10;
        treasury = Math.max(0, treasury);

        // Domain 2: Earnings
        let earnings = 100;
        if (c.receitasNaoRecorrentes > 0.15 * Math.abs(c.ebitdaContabil || 1)) earnings -= 20;
        if (c.ebitdaContabil > 0 && c.fco < 0.5 * c.ebitdaContabil) earnings -= 15;
        if (c.ebitdaNormalizado < 0) earnings -= 25;
        earnings = Math.max(0, earnings);

        // Domain 3: Governance
        let governance = 100;
        if (c.dependencyNature === 'SURVIVABILITY_SUPPORT') {
          governance -= 25;
        } else if (c.dependencyNature === 'RECURRING_TREASURY_SUPPORT') {
          governance -= 20;
        }
        if (c.creditosSocios > 0.1 * (c.ativoCirculante || 1)) governance -= 15;
        governance = Math.max(0, governance);

        // Domain 4: Advisory
        let advisory = 100;
        if (c.fco < 0 && prev && prev.fco < 0) {
          advisory -= 30; // Unresolved critical FCO advisory
        }
        if (c.dependencyNature === 'RECURRING_TREASURY_SUPPORT') {
          advisory -= 15;
        }
        advisory = Math.max(0, advisory);

        // Domain 5: Drift
        let drift = 100;
        let driftDeductions = 0;
        if (prev) {
          const marginCurr = c.ebitdaNormalizado / Math.max(1, c.receitaLiquida);
          const marginPrev = prev.ebitdaNormalizado / Math.max(1, prev.receitaLiquida);
          if (marginCurr < marginPrev) {
            driftDeductions += 20;
          }
          if (c.caixaCaixa < prev.caixaCaixa) {
            driftDeductions += 20;
          }
        }
        drift -= driftDeductions * severityMultiplier;
        drift = Math.max(0, drift);

        // Domain 6: Strategic
        let strategic = 100;
        if (prev) {
          const highGrowth = c.receitaLiquida > 1.15 * prev.receitaLiquida;
          const highCapex = c.capex > 0.1 * (c.patrimonioLiquido + c.passivoCirculante || 1);
          const highRestructuring = c.eventosExtraordinarios > 0.1 * Math.abs(c.ebitdaContabil || 1);
          const isPlannedTransition = highGrowth || highCapex || highRestructuring;

          if (!isPlannedTransition) {
            const opexLatest = c.sga / Math.max(1, c.receitaLiquida);
            const opexPrev = prev.sga / Math.max(1, prev.receitaLiquida);
            if (Math.abs(opexLatest - opexPrev) > 0.10) {
              strategic -= 30; // Unplanned opex shift
            }
          }
        }
        strategic = Math.max(0, strategic);

        cycleScores[c.year] = { treasury, earnings, governance, advisory, drift, strategic };
      });

      // ── 6. DECAYED INTEGRATION CALCULATIONS FOR CURRENT STATE ──
      const domains = ['treasury', 'earnings', 'governance', 'advisory', 'drift', 'strategic'] as const;
      const finalDomainScores: Record<string, number> = {};

      domains.forEach(domain => {
        let totalWeight = 0;
        let weightedSum = 0;

        reverseCycles.forEach((c, idx) => {
          let bypassDecay = false;
          if (domain === 'treasury') {
            bypassDecay = currentCycle && (currentCycle.fco < 0 || currentCycle.caixaCaixa < currentCycle.shortTermDebt);
          } else if (domain === 'earnings') {
            bypassDecay = currentCycle && (currentCycle.ebitdaNormalizado < 0 || currentCycle.receitasNaoRecorrentes > 0.15 * Math.abs(currentCycle.ebitdaContabil || 1));
          } else if (domain === 'governance') {
            bypassDecay = currentCycle && (currentCycle.passivosSocietarios > 0.05 * currentCycle.passivoCirculante);
          } else if (domain === 'advisory' || domain === 'drift') {
            bypassDecay = unresolvedCriticalCount > 0;
          }

          const weight = bypassDecay ? 1.0 : getDecayWeight(idx);
          weightedSum += (cycleScores[c.year]?.[domain] ?? 100) * weight;
          totalWeight += weight;
        });

        finalDomainScores[domain] = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 100;
      });

      let treasuryScore = finalDomainScores.treasury;
      let earningsScore = finalDomainScores.earnings;
      let governanceScore = finalDomainScores.governance;
      let advisoryScore = finalDomainScores.advisory;
      let driftScore = finalDomainScores.drift;
      let strategicScore = finalDomainScores.strategic;

      // Early stage protections
      if (isEarlyStage) {
        treasuryScore = Math.max(70, treasuryScore);
        earningsScore = Math.max(70, earningsScore);
        governanceScore = Math.max(70, governanceScore);
        advisoryScore = Math.max(70, advisoryScore);
        driftScore = Math.max(70, driftScore);
        strategicScore = Math.max(70, strategicScore);
      }

      // Composite IMS Score
      const imsScore = Math.round(
        (treasuryScore * 0.20) +
        (earningsScore * 0.20) +
        (governanceScore * 0.15) +
        (advisoryScore * 0.15) +
        (driftScore * 0.15) +
        (strategicScore * 0.15)
      );

      let imsLevel = 'Transitional Institutional Consistency';
      if (imsScore >= 85) imsLevel = 'Institutional Learning Organization';
      else if (imsScore >= 70) imsLevel = 'Stable Institutional Memory';
      else if (imsScore >= 50) imsLevel = 'Transitional Institutional Consistency';
      else if (imsScore >= 30) imsLevel = 'Fragile Institutional Continuity';
      else imsLevel = 'Critical Institutional Drift';

      // ── 7. INSTITUTIONAL TRAJECTORY CLASSIFICATION ──
      let trajectoryClassification: 'RECOVERING' | 'STABILIZING' | 'VOLATILE' | 'DETERIORATING' | 'STRUCTURALLY_FRAGILE' = 'VOLATILE';
      if (cycleMetricsList.length >= 2) {
        const latest = cycleMetricsList[cycleMetricsList.length - 1];
        const prev = cycleMetricsList[cycleMetricsList.length - 2];
        
        const isImproving = latest.ebitdaNormalizado > prev.ebitdaNormalizado;
        const isStable = Math.abs(latest.ebitdaNormalizado - prev.ebitdaNormalizado) / Math.max(1, Math.abs(prev.ebitdaNormalizado)) < 0.05;

        if (isImproving && latest.fco > 0) {
          trajectoryClassification = 'RECOVERING';
        } else if (isStable && latest.fco >= 0 && latest.ebitdaNormalizado > 0) {
          trajectoryClassification = 'STABILIZING';
        } else if (latest.ebitdaNormalizado < prev.ebitdaNormalizado && latest.ebitdaNormalizado < 0) {
          trajectoryClassification = 'DETERIORATING';
        } else if (latest.ebitdaNormalizado < 0 && latest.fco < 0) {
          trajectoryClassification = 'STRUCTURALLY_FRAGILE';
        }
      }

      // ── 8. SYSTEMIC ALERTS ──
      const alerts: string[] = [];
      if (cycleMetricsList.filter(c => c.fco < 0).length >= 3) {
        alerts.push('Treasury fragility demonstrates persistent longitudinal recurrence.');
      }
      if (cycleMetricsList.filter(c => c.dependencyNature === 'RECURRING_TREASURY_SUPPORT').length >= 1) {
        alerts.push('Institutional continuity demonstrates recurring dependency on shareholder-supported structures.');
      }
      if (unresolvedCriticalCount >= 3) {
        alerts.push('Repeated fiduciary recommendations remain structurally unresolved.');
      }
      if (driftScore < 70) {
        alerts.push('Institutional structure demonstrates progressive longitudinal deterioration.');
      }
      if (cycleMetricsList.length >= 2) {
        const latest = cycleMetricsList[cycleMetricsList.length - 1];
        const prev = cycleMetricsList[cycleMetricsList.length - 2];
        if (latest.ebitdaContabil > prev.ebitdaContabil && latest.ebitdaNormalizado < prev.ebitdaNormalizado) {
          alerts.push('Reported recovery demonstrates partial divergence from normalized institutional economics.');
        }
      }

      // ── 9. EXPLAINABILITY TIMELINE ──
      const timeline: Array<{
        period: number;
        events: string[];
        engine: string;
        metric: string;
        advisory: string;
        duration: number;
        status: 'ACTIVE' | 'RESOLVED' | 'MITIGATED' | 'RECURRING' | 'ESCALATED';
      }> = [];

      cycleMetricsList.forEach((c, index) => {
        const events: string[] = [];
        let status: 'ACTIVE' | 'RESOLVED' | 'MITIGATED' | 'RECURRING' | 'ESCALATED' = 'ACTIVE';

        if (c.fco < 0) {
          events.push('Estresse operacional de fluxo de caixa (FCO < 0).');
          status = index > 0 && cycleMetricsList[index - 1].fco < 0 ? 'RECURRING' : 'ACTIVE';
          if (index >= 2 && cycleMetricsList[index - 1].fco < 0 && cycleMetricsList[index - 2].fco < 0) {
            status = 'ESCALATED';
          }
        }
        if (c.dependencyNature === 'RECURRING_TREASURY_SUPPORT' || c.dependencyNature === 'SURVIVABILITY_SUPPORT') {
          events.push('Dependência estrutural de capital societário/mútuo.');
        }
        if (events.length === 0) {
          events.push('Operação estabilizada.');
          status = 'RESOLVED';
        }

        timeline.push({
          period: c.year,
          events,
          engine: 'InstitutionalMemoryEngine',
          metric: `IMS: ${imsScore}`,
          advisory: events[0] || 'Nenhuma recomendação pendente',
          duration: index + 1,
          status
        });
      });

      // ── 10. NARRATIVE GUARDS AND SANITIZATION ──
      const sanitizeNarrative = (text: string): string => {
        if (!text) return '';
        let clean = text;
        const forbidden = [
          { pattern: /management incompetence/gi, replacement: 'The institution demonstrates recurring exposure to similar fiduciary pressures across historical cycles.' },
          { pattern: /incompetência da gestão/gi, replacement: 'A instituição demonstra exposição recorrente a pressões fiduciárias semelhantes ao longo dos ciclos históricos.' },
          
          { pattern: /fraudulent continuity/gi, replacement: 'Certain fiduciary recommendations remain longitudinally unresolved.' },
          { pattern: /continuidade fraudulenta/gi, replacement: 'Certas recomendações fiduciárias permanecem estruturalmente não resolvidas ao longo do tempo.' },
          
          { pattern: /institutional collapse/gi, replacement: 'The institutional trajectory demonstrates progressive structural sensitivity.' },
          { pattern: /colapso institucional/gi, replacement: 'A trajetória da instituição demonstra sensibilidade estrutural progressiva.' },
          
          { pattern: /terminal deterioration/gi, replacement: 'Certain fiduciary recommendations remain longitudinally unresolved.' },
          { pattern: /deterioração terminal/gi, replacement: 'Certas recomendações fiduciárias permanecem estruturalmente não resolvidas ao longo do tempo.' },
          
          { pattern: /irreversible decline/gi, replacement: 'The institutional trajectory demonstrates progressive structural sensitivity.' },
          { pattern: /declínio irreversível/gi, replacement: 'A trajetória da instituição demonstra sensibilidade estrutural progressiva.' }
        ];
        forbidden.forEach(rule => {
          clean = clean.replace(rule.pattern, rule.replacement);
        });
        return clean;
      };

      let diagnostic = `A integridade de memória institucional apresenta um score de ${imsScore}/100, indicando um status de ${imsLevel}. A classificação de trajetória é ${trajectoryClassification}.`;
      if (isEarlyStage) {
        diagnostic += ` Contexto de scale-up e ramping operacional com amortecimento fiduciário ativo.`;
      }
      diagnostic = sanitizeNarrative(diagnostic);

      const narrative: AdvisoryNarrative = {
        diagnostic,
        cause: trajectoryClassification === 'RECOVERING' ? 'Recuperação consistente dos fundamentos sob otimização operacional.' : 'Exposição longitudinal recorrente a pressões sob análise fiduciária.',
        consequence: imsScore < 50 ? 'Presença de fragilidade de recorrência que exige supervisão do comitê executivo.' : 'Sustentação fiduciária sólida com histórico consistente.',
        sensitivity: isEarlyStage ? 'Atenuado sob ramp-up' : 'Consolidado sob base temporal de longo prazo',
        risk: imsScore < 50 ? 'Risco de inconsistência operacional' : 'Risco sob controle fiduciário',
        priority: 'Mitigar dependências societárias e otimizar conversão de caixa.',
        strategicMovement: 'Refinanciamento planejado e expurgo de gargalos OPEX.'
      };

      // ── 11. RECONCILIATION & AUDITABILITY ──
      const auditability = {
        imsScore,
        imsLevel,
        trajectoryClassification,
        lineage: 'BP.PL, BP.NetDebt, BP.AtivoCirculante, BP.PassivoCirculante, DFC.FCO, DRE.EBITDA',
        reconciliationTrace: `Treasury score: ${treasuryScore.toFixed(0)} | Earnings score: ${earningsScore.toFixed(0)} | Governance score: ${governanceScore.toFixed(0)} | Advisory compliance: ${advisoryScore.toFixed(0)}`,
        fiduciaryRationale: 'IME assegura a memória institucional ao ponderar tendências e recorrências ao longo de múltiplos ciclos de auditoria.',
        reconstructionLogic: 'IMS = (Treasury * 0.20) + (Earnings * 0.20) + (Governance * 0.15) + (Advisory * 0.15) + (Drift * 0.15) + (Strategic * 0.15)'
      };

      // ── 12. HEATMAPS ──
      const heatmaps = {
        treasury: sortedCycles.map(y => ({ year: y, score: cycleScores[y]?.treasury ?? 100 })),
        governance: sortedCycles.map(y => ({ year: y, score: cycleScores[y]?.governance ?? 100 })),
        advisory: sortedCycles.map(y => ({ year: y, score: cycleScores[y]?.advisory ?? 100 })),
        drift: sortedCycles.map(y => ({ year: y, score: cycleScores[y]?.drift ?? 100 })),
        strategic: sortedCycles.map(y => ({ year: y, score: cycleScores[y]?.strategic ?? 100 })),
        recoveryMomentum: sortedCycles.map(y => ({
          year: y,
          momentum: trajectoryClassification === 'RECOVERING' ? 'ACCELERATING' : trajectoryClassification === 'STABILIZING' ? 'STABILIZING' : 'INCONSISTENT'
        }))
      };

      const memoryType = isEarlyStage ? 'STRUCTURAL_SNAPSHOT' : (imsScore >= 85 ? 'ROBUST_LONGITUDINAL_MEMORY' : 'MODERATE_TREND');
      const confidence = isEarlyStage ? 'LOW' : 'HIGH';

      const inference: InferenceBlock = {
        domain: 'institutional_memory',
        metrics: {
          memoryType,
          periodsAvailable: sortedCycles.length,
          allowedInferences: isEarlyStage ? ['Diagnóstico do período vigente'] : ['Memória executiva consolidada'],
          blockedInferences: isEarlyStage ? ['Tendência longitudinal de crescimento'] : [],
          historicalSignals: [],
          causalContinuity: isEarlyStage ? 'Inexistente' : 'Consolidada e Rastreável',
          narrativeBoundary: isEarlyStage ? 'Narrativa limitada ao momento presente.' : 'Abertura total para análises de tendências.',
          imsScore,
          imsLevel,
          trajectoryClassification,
          isEarlyStage,
          domains: {
            treasury: { score: treasuryScore },
            earnings: { score: earningsScore },
            governance: { score: governanceScore },
            advisory: { score: advisoryScore },
            drift: { score: driftScore },
            strategic: { score: strategicScore }
          },
          alerts,
          timeline,
          heatmaps,
          auditability
        },
        causality: [],
        narrative,
        confidence,
        evidenceLevel: isEarlyStage ? 'INFERRED_LOW_CONFIDENCE' : 'EVIDENCE_BASED',
        score: imsScore
      };

      return {
        engineName: 'InstitutionalMemoryEngine',
        success: true,
        confidence,
        inference,
        violations: undefined
      };

    } catch (e: any) {
      return {
        engineName: 'InstitutionalMemoryEngine',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'memory_engine_error',
          severity: 'CRITICAL',
          message: `Erro ao processar Institutional Memory Engine: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
