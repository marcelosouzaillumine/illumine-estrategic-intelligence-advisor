import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../types';

export const EconomicNormalizationAdapter: EngineDefinition = {
  name: 'EconomicNormalizationAdapter',
  priority: 35, // Runs after DFC (30) and before Stress (40) / BRM (60)
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter'],
  requiredData: ['rawFinancialData'],
  inferenceScope: 'Normalização Econômica (Economic Normalization Engine)',
  minimumEvidenceLevel: 'Balanço Patrimonial e DRE básico',
  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const input = context.input.rawFinancialData || {};
      const filterYear = Number(input.filterYear || input.year || new Date().getFullYear());
      const allHistoryData = input.allHistoryData || [];
      const historicalCyclesCount = context.input.historicalCyclesCount ?? 1;

      // Inferences from downstream
      const financialInference = context.inferences['LegacyFinancialAdapter'];
      const dreInference = context.inferences['LegacyDREAdapter'];
      const dfcInference = context.inferences['LegacyDFCAdapter'];

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
          const c = normalizeString(d.conta || d.category || '');
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
          const c = normalizeString(d.conta || d.category || '');
          return normalizedFilters.some(n => c === n || c.includes(n));
        });
        return match?.val || match?.valor || match?.value || 0;
      };

      // ── 1. ACCOUNTING BASELINE METRICS ──
      const bpSummary = financialInference?.metrics?.bpSummary || {};
      const dreMetrics = dreInference?.metrics || {};
      const dfcMetrics = dfcInference?.metrics || {};

      const ebitdaContabil = dreMetrics.ebitda ?? getHistoricalValue(filterYear, ['dre', 'resultado'], ['ebitda', 'lajida']);
      const lucroLiquido = dreMetrics.lucroLiq ?? getHistoricalValue(filterYear, ['dre', 'resultado'], ['lucro liquido', 'resultado liquido']);
      const receitaLiquida = dreMetrics.recLiquida ?? getHistoricalValue(filterYear, ['dre', 'resultado'], ['receita liquida', 'receita operacional liquida']);
      
      const ativoCirculante = bpSummary.ativoCirculante ?? getHistoricalSum(filterYear, ['bp', 'balanco'], ['ativo circulante'], 'ativo');
      const passivoCirculante = bpSummary.passivoCirculante ?? getHistoricalSum(filterYear, ['bp', 'balanco'], ['passivo circulante'], 'passivo');
      const patrimonioLiquido = bpSummary.patrimonioLiquido ?? getHistoricalSum(filterYear, ['bp', 'balanco'], ['patrimonio liquido', 'capital social'], 'passivo');
      const ativoTotal = bpSummary.ativoTotal ?? 1;

      const estoques = getHistoricalSum(filterYear, ['bp', 'balanco'], ['estoque', 'estoques', 'mercadorias'], 'ativo');
      const fornecedores = getHistoricalSum(filterYear, ['bp', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar'], 'passivo');
      const caixaCaixa = getHistoricalSum(filterYear, ['bp', 'balanco'], ['caixa', 'equivalentes', 'bancos', 'disponibilidades'], 'ativo');
      
      const passivosFinanceiros = bpSummary.passivosFinanceiros ?? getHistoricalSum(filterYear, ['bp', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos'], 'passivo');
      const shortTermDebt = passivosFinanceiros * (passivoCirculante > 0 ? (passivosFinanceiros > 0 ? 0.5 : 1) : 1); // Estimated short-term debt
      const availableCash = caixaCaixa;
      const fco = dfcMetrics.fco ?? 0;

      // ── 2. ADJUSTMENT & NORMALIZATION BALANCES ──
      const receitasNaoRecorrentes = Math.abs(getHistoricalSum(filterYear, ['dre', 'resultado'], ['não recorrente', 'nao recorrente', 'alienacao', 'alienação', 'outras receitas', 'ganho na venda', 'recuperacao de impostos', 'recuperação de impostos', 'creditos judiciais', 'créditos judiciais']));
      const creditosSocios = getHistoricalSum(filterYear, ['bp', 'balanco'], ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios', 'creditos com socios', 'conta corrente socios'], 'ativo');
      
      // Related party liabilities / shareholder loans
      const passivosSocietarios = getHistoricalSum(filterYear, ['bp', 'balanco'], ['mútuo sócios', 'mutuo socios', 'partes relacionadas credores', 'emprestimos de socios', 'emprestimos socios', 'conta corrente socios passivo', 'conta corrente socios', 'socio', 'socios'], 'passivo');
      const passivosArtificiais = passivosSocietarios; // shareholder loans contributing to artificial structure
      const impactosSocietarios = getHistoricalSum(filterYear, ['dre', 'resultado'], ['socio', 'partes relacionadas', 'mutuo', 'jscp', 'pro-labore', 'retirada', 'diretoria']);
      const eventosExtraordinarios = getHistoricalSum(filterYear, ['dre', 'resultado'], ['extraordinario', 'provisao', 'contingencia', 'sinistro', 'baixa de ativo', 'reestruturacao']);

      const sga = getHistoricalSum(filterYear, ['dre', 'resultado'], ['despesas operacionais', 'despesa operacional', 'despesas administrativas', 'despesas com vendas', 'admin', 'vendas', 'sg&a', 'sga']);

      // ── 3. ENE DOMAINS COMPUTATIONS ──

      // Domain 1: EBITDA Normalization
      const ebitdaOperacionalReal = ebitdaContabil - eventosExtraordinarios;
      const ebitdaRecorrente = ebitdaContabil - receitasNaoRecorrentes;
      const ebitdaNormalizado = ebitdaContabil - receitasNaoRecorrentes - impactosSocietarios - eventosExtraordinarios;

      let ebitdaScore = 100;
      const absEbitda = Math.abs(ebitdaContabil) || 1;
      if (receitasNaoRecorrentes > 0.1 * absEbitda) ebitdaScore -= 30;
      if (Math.abs(impactosSocietarios) > 0.1 * absEbitda) ebitdaScore -= 30;
      if (Math.abs(eventosExtraordinarios) > 0.1 * absEbitda) ebitdaScore -= 20;
      ebitdaScore = Math.max(0, ebitdaScore);

      // Domain 2: Working Capital Normalization
      const capitalDeGiroContabil = ativoCirculante - passivoCirculante;
      const capitalDeGiroOperacionalLiquidoAjustado = ativoCirculante - estoques - creditosSocios - passivosArtificiais;
      const liquidezAjustada = (ativoCirculante - estoques - creditosSocios) / Math.max(1, passivoCirculante - passivosArtificiais);
      const dependenciaGiro = fornecedores / Math.max(1, ativoCirculante);

      let wcScore = 100;
      if (creditosSocios > 0.15 * (ativoCirculante || 1)) wcScore -= 30;
      if (passivosArtificiais > 0.15 * (passivoCirculante || 1)) wcScore -= 30;
      if (estoques > 0.5 * (ativoCirculante || 1)) wcScore -= 20;
      if (dependenciaGiro > 0.4) wcScore -= 20;
      wcScore = Math.max(0, wcScore);

      // Domain 3: ROIC / EVA Normalization
      const depreciacao = Math.abs(getHistoricalSum(filterYear, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));
      const ebitNormalizado = ebitdaNormalizado - depreciacao;
      const ebitContabil = ebitdaContabil - depreciacao;
      const impostos = getHistoricalSum(filterYear, ['dre', 'resultado'], ['irpj', 'csll', 'imposto de renda', 'contribuicao social', 'provisao ir']);
      const lair = getHistoricalValue(filterYear, ['dre', 'resultado'], ['lair', 'lucro antes']);
      const effectiveTaxRate = lair > 0 ? Math.max(0, Math.min(0.34, impostos / lair)) : 0.34;

      const nopatContabil = ebitContabil * (1 - effectiveTaxRate);
      const nopatRecorrente = ebitNormalizado * (1 - effectiveTaxRate);

      const capitalInvestidoContabil = Math.max(1, patrimonioLiquido + passivosFinanceiros - caixaCaixa);
      const capitalInvestidoOperacionalReal = patrimonioLiquido + passivosFinanceiros - caixaCaixa - creditosSocios - passivosArtificiais;

      let roicNormalizadoStatus = 'OK';
      let roicNormalizadoReason = '';
      let roicNormalizadoValue: number | null = null;
      let evaEconomicoReal: number | null = null;

      if (capitalInvestidoOperacionalReal <= 0) {
        roicNormalizadoStatus = 'NOT_COMPUTABLE';
        roicNormalizadoReason = 'Insufficient or invalid operational invested capital base';
      } else {
        roicNormalizadoValue = nopatRecorrente / capitalInvestidoOperacionalReal;
      }

      const roicContabil = nopatContabil / capitalInvestidoContabil;
      const wacc = 0.12;
      const evaContabil = nopatContabil - (capitalInvestidoContabil * wacc);
      if (roicNormalizadoStatus === 'OK' && roicNormalizadoValue !== null) {
        evaEconomicoReal = nopatRecorrente - (capitalInvestidoOperacionalReal * wacc);
      }

      let roicScore = 100;
      if (roicNormalizadoStatus === 'NOT_COMPUTABLE') {
        roicScore = 50; // Neutral fallback for not computable
      } else if (roicNormalizadoValue !== null) {
        if (roicNormalizadoValue < 0.05) roicScore -= 30;
        if (roicNormalizadoValue < roicContabil - 0.05) roicScore -= 35;
        if (evaEconomicoReal !== null && evaEconomicoReal < 0) roicScore -= 35;
      }
      roicScore = Math.max(0, roicScore);

      // Domain 4: Debt Structure Normalization
      const dividaFinanceiraReal = Math.max(0, passivosFinanceiros - passivosSocietarios);
      const passivosOperacionais = fornecedores + (passivoCirculante - shortTermDebt - fornecedores); // Operational payables
      const passivosSocietariosVal = passivosSocietarios;
      const pressaoCurtoPrazo = shortTermDebt / Math.max(1, availableCash + fco);
      const dependenciaRefinanciamento = shortTermDebt / Math.max(1, passivosFinanceiros);

      let debtScore = 100;
      if (passivosSocietariosVal > 0.3 * (dividaFinanceiraReal || 1)) debtScore -= 30;
      if (dependenciaRefinanciamento > 0.7) debtScore -= 35;
      if (pressaoCurtoPrazo > 1.5) debtScore -= 35;
      debtScore = Math.max(0, debtScore);

      // Domain 5: Margin Integrity Normalization
      const margemEbitdaReal = ebitdaOperacionalReal / Math.max(1, receitaLiquida);
      const margemOperacionalAjustada = ebitNormalizado / Math.max(1, receitaLiquida);
      const margemRecorrente = ebitdaNormalizado / Math.max(1, receitaLiquida);
      const pressaoEstruturalCustos = sga / Math.max(1, receitaLiquida);

      let marginScore = 100;
      if (margemEbitdaReal < 0) marginScore -= 30;
      if (margemRecorrente < margemEbitdaReal - 0.05) marginScore -= 30;
      if (pressaoEstruturalCustos > 0.5) marginScore -= 40;
      marginScore = Math.max(0, marginScore);

      // Domain 6: Institutional Economic Stability
      let stabilityScore = 100;
      let ebitdaVol = 0;
      let lossCyclesCount = 0;

      const isEarlyStage = historicalCyclesCount < 3;

      if (isEarlyStage) {
        stabilityScore = 80; // Protected score
      } else {
        // Track losses and volatility
        const marginList: number[] = [];
        [filterYear, filterYear - 1, filterYear - 2].forEach(y => {
          const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y);
          const hasDRE = yearEntries.some((d: any) => matchDocType(d, ['dre', 'resultado']));
          if (hasDRE) {
            const yEbitda = getHistoricalValue(y, ['dre', 'resultado'], ['ebitda', 'lajida']);
            const yRev = getHistoricalValue(y, ['dre', 'resultado'], ['receita liquida', 'receita operacional liquida']);
            const yLL = getHistoricalValue(y, ['dre', 'resultado'], ['lucro liquido', 'resultado liquido']);
            
            if (yLL < 0) lossCyclesCount++;
            if (yRev > 0) marginList.push(yEbitda / yRev);
          }
        });

        if (lossCyclesCount > 0) {
          stabilityScore -= 20 * lossCyclesCount;
        }
        if (marginList.length >= 2) {
          ebitdaVol = Math.max(...marginList) - Math.min(...marginList);
          if (ebitdaVol > 0.15) {
            stabilityScore -= 30;
          }
        }
        stabilityScore = Math.max(0, stabilityScore);
      }

      // Early-Stage Protections: attenuate penalties
      if (isEarlyStage) {
        ebitdaScore = Math.max(70, ebitdaScore);
        wcScore = Math.max(70, wcScore);
        roicScore = Math.max(70, roicScore);
        debtScore = Math.max(70, debtScore);
        marginScore = Math.max(70, marginScore);
      }

      // Consolidated ENS Calculation
      const ensScore = Math.round(
        (ebitdaScore * 0.20) +
        (wcScore * 0.20) +
        (roicScore * 0.15) +
        (debtScore * 0.15) +
        (marginScore * 0.15) +
        (stabilityScore * 0.15)
      );

      let ensLevel = 'Transitional Economic Structure';
      if (ensScore >= 85) ensLevel = 'Highly Normalized Institutional Economics';
      else if (ensScore >= 70) ensLevel = 'Stable Economic Structure';
      else if (ensScore >= 50) ensLevel = 'Transitional Economic Structure';
      else if (ensScore >= 30) ensLevel = 'Distorted Economic Structure';
      else ensLevel = 'Critical Economic Distortion';

      // ── 4. REQUIRED ALERTS ──
      const alerts: string[] = [];
      if (receitasNaoRecorrentes > 0.1 * absEbitda) {
        alerts.push('Reported EBITDA demonstrates material dependency on non-recurring economic effects.');
      }
      if (wcScore < 70 && (fornecedores > 0.4 * passivoCirculante || estoques > 0.5 * ativoCirculante)) {
        alerts.push('Operational liquidity demonstrates elevated dependency on structurally fragile working capital components.');
      }
      if (roicNormalizadoValue !== null && roicContabil > roicNormalizadoValue && fco < lucroLiquido) {
        alerts.push('Reported capital returns are not fully supported by recurring operational treasury generation.');
      }
      if (shortTermDebt > 0.7 * passivosFinanceiros) {
        alerts.push('Capital structure demonstrates elevated refinancing sensitivity.');
      }
      if (margemRecorrente < margemEbitdaReal - 0.05 && fco < ebitdaContabil) {
        alerts.push('Margin expansion demonstrates weak operational cash reinforcement.');
      }

      // ── 5. NARRATIVE GUARDS AND SANITIZATION ──
      const sanitizeNarrative = (text: string): string => {
        if (!text) return '';
        let clean = text;
        const forbidden = [
          { pattern: /fake economics/gi, replacement: 'estrutura econômica ajustada' },
          { pattern: /manipulated profitability/gi, replacement: 'distorções econômicas relevantes' },
          { pattern: /manipulação/gi, replacement: 'estrutura econômica ajustada' },
          { pattern: /fraude/gi, replacement: 'distorções econômicas relevantes' },
          { pattern: /lucro falso/gi, replacement: 'efeitos não recorrentes' },
          { pattern: /economia falsa/gi, replacement: 'dependência societária' },
          { pattern: /terminal failure/gi, replacement: 'fragilidade de recorrência' },
          { pattern: /irreversible collapse/gi, replacement: 'fragilidade de recorrência' }
        ];
        forbidden.forEach(rule => {
          clean = clean.replace(rule.pattern, rule.replacement);
        });
        return clean;
      };

      let diagnostic = `A estrutura econômica ajustada apresenta um score de normalização de ${ensScore}/100, indicando um status de ${ensLevel}.`;
      if (isEarlyStage) {
        diagnostic += ` Contexto de escala inicial com proteção de amortização e ramp-up operacional ativo.`;
      }
      diagnostic = sanitizeNarrative(diagnostic);

      const narrative: AdvisoryNarrative = {
        diagnostic,
        cause: ebitdaNormalizado > 0 ? 'Lucratividade recorrente desprovida de suportes extraordinários.' : 'Pressão de custos estruturais opex no ciclo corrente.',
        consequence: ensScore < 50 ? 'Presença de distorções econômicas relevantes que exigem monitoramento preventivo de governança.' : 'Manutenção de resiliência e estabilidade da estrutura econômica.',
        sensitivity: isEarlyStage ? 'Atenuado sob ciclo inicial de escala' : 'Determinístico sob histórico longitudinal',
        risk: ensScore < 50 ? 'Sensibilidade a oscilações sazonais' : 'Risco de volatilidade sob controle',
        priority: 'Otimização operacional e expurgo de efeitos extraordinários.',
        strategicMovement: 'Alinhamento fiduciário continuado com comitê de auditoria.'
      };

      const auditability = {
        ebitda: {
          accountingBase: ebitdaContabil,
          removedDistortions: receitasNaoRecorrentes + impactosSocietarios + eventosExtraordinarios,
          reconciliationTrace: `Contábil: ${ebitdaContabil.toFixed(2)} | Não Recorrentes: -${receitasNaoRecorrentes.toFixed(2)} | Partes Relacionadas: -${impactosSocietarios.toFixed(2)} | Extraordinários: -${eventosExtraordinarios.toFixed(2)}`,
          lineage: 'DRE.EBITDA, DRE.ReceitasNaoRecorrentes, DFC.PartesRelacionadas, DRE.Extraordinario',
          fiduciaryRationale: 'Separa o EBITDA em parcelas operacional, extraordinária, e recorrente para avaliar a geração sustentável do core business.',
          reconstructionLogic: 'EBITDA Normalizado = EBITDA Contábil - Não Recorrentes - Impactos Societários - Eventos Extraordinários'
        },
        workingCapital: {
          accountingBase: capitalDeGiroContabil,
          removedDistortions: estoques + creditosSocios + passivosArtificiais,
          reconciliationTrace: `Contábil: ${capitalDeGiroContabil.toFixed(2)} | Estoques: ${estoques.toFixed(2)} | Créditos Sócios: ${creditosSocios.toFixed(2)} | Passivos Artificiais: ${passivosArtificiais.toFixed(2)}`,
          lineage: 'BP.AtivoCirculante, BP.PassivoCirculante, BP.Estoques, BP.CreditosSocios, BP.PassivosArtificiais',
          fiduciaryRationale: 'Avalia a liquidez core descontando ativos ilíquidos ou relacionados para mensurar capital operacional real.',
          reconstructionLogic: 'Capital de Giro Operacional Líquido Ajustado = Ativo Circulante - Estoques - Créditos Sócios - Passivos Artificiais'
        },
        roic: {
          accountingBase: roicContabil,
          removedDistortions: roicNormalizadoValue !== null ? roicContabil - roicNormalizadoValue : 0,
          reconciliationTrace: roicNormalizadoStatus === 'NOT_COMPUTABLE' 
            ? 'Não calculável devido a Capital Investido Operacional nulo ou negativo' 
            : `Contábil: ${(roicContabil * 100).toFixed(2)}% | Normalizado: ${(roicNormalizadoValue! * 100).toFixed(2)}%`,
          lineage: 'DRE.EBITDA, DRE.Depreciacao, DRE.LAIR, DRE.Taxes, BP.PL, BP.NetDebt, BP.CreditosSocios',
          fiduciaryRationale: 'Mede o retorno sobre capital puramente operacional desprovido de injeções e mútuos societários.',
          reconstructionLogic: 'ROIC Normalizado = NOPAT Recorrente / Capital Investido Operacional Real'
        }
      };

      const inference: InferenceBlock = {
        domain: 'Economic Normalization Engine (ENE)',
        metrics: {
          ensScore,
          ensLevel,
          ebitda: {
            contabil: ebitdaContabil,
            operacionalReal: ebitdaOperacionalReal,
            recorrente: ebitdaRecorrente,
            normalizado: ebitdaNormalizado,
            score: ebitdaScore
          },
          workingCapital: {
            contabil: capitalDeGiroContabil,
            operacionalLiquidoAjustado: capitalDeGiroOperacionalLiquidoAjustado,
            liquidezAjustada,
            dependenciaGiro,
            score: wcScore
          },
          roic: {
            contabil: roicContabil,
            normalizado: roicNormalizadoValue,
            normalizadoStatus: roicNormalizadoStatus,
            normalizadoReason: roicNormalizadoReason,
            evaContabil,
            evaEconomicoReal,
            score: roicScore
          },
          debt: {
            dividaFinanceiraReal,
            passivosOperacionais,
            passivosSocietarios: passivosSocietariosVal,
            passivosArtificiais,
            pressaoCurtoPrazo,
            dependenciaRefinanciamento,
            score: debtScore
          },
          margin: {
            margemEbitdaReal,
            margemOperacionalAjustada,
            margemRecorrente,
            pressaoEstruturalCustos,
            score: marginScore
          },
          stability: {
            lossCyclesCount,
            ebitdaVol,
            score: stabilityScore
          },
          alerts,
          isEarlyStage,
          auditability,
          receitasNaoRecorrentes,
          impactosSocietarios,
          estoques,
          creditosSocios,
          passivosArtificiais
        },
        causality: [],
        narrative,
        confidence: isEarlyStage ? 'LOW' : 'HIGH', // Downgraded on scale protected companies
        evidenceLevel: 'Auditado Patrimonial e DRE',
        score: ensScore
      };

      return {
        engineName: 'EconomicNormalizationAdapter',
        success: true,
        confidence: isEarlyStage ? 'LOW' : 'HIGH',
        inference
      };

    } catch (err: any) {
      return {
        engineName: 'EconomicNormalizationAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'NORMALIZATION_ENGINE_ERROR',
          severity: 'CRITICAL',
          message: `Internal runtime error in ENE: ${err.message || err}`,
          blocked: true
        }]
      };
    }
  }
};
