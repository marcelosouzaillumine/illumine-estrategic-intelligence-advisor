import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../types';

export const LegacyDFCAdapter: EngineDefinition = {
  name: 'LegacyDFCAdapter',
  priority: 30, // Executa depois do DRE e Financial (BP)
  dependencies: [],
  requiredData: ['rawFinancialData'], // Vai varrer todo o histórico do db
  inferenceScope: 'Inteligência de Caixa (DFC)',
  minimumEvidenceLevel: 'Balanço Patrimonial e DRE (Método Indireto)',
  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const input = context.input;
      
      // O rawFinancialData deve passar allHistoryData para calcular variação de anos
      const allHistoryData = input.rawFinancialData?.allHistoryData || [];
      const filterYear = Number(input.rawFinancialData?.filterYear || new Date().getFullYear());

      if (!allHistoryData || allHistoryData.length === 0) {
        return {
          engineName: 'LegacyDFCAdapter',
          success: false,
          confidence: 'LOW',
          violations: [{
            rule: 'MISSING_ALL_FINANCIAL_DATA',
            severity: 'CRITICAL',
            message: 'Análise bloqueada por ausência de dados de DFC, Balanço Patrimonial ou DRE.',
            blocked: true
          }]
        };
      }

      // Utils locais que vieram da UI
      const normalizeString = (s: string) => 
        s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/^[0-9.]+\s*[-]\s*/, '').replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '').trim();

      const getHistoricalValue = (y: number, docTypes: string[], nameFilters: string[]) => {
        const yearEntries = allHistoryData.filter((d: any) => 
          Number(d.year) === y && docTypes.some(t => normalizeString(d.type || '') === normalizeString(t))
        );
        const normalizedFilters = nameFilters.map(normalizeString);
        const match = yearEntries.find((d: any) => {
          const c = normalizeString(d.conta || d.category || '');
          return normalizedFilters.some(n => c === n || c.includes(n));
        });
        return match?.val || match?.valor || match?.value || 0;
      };
      
      const getHistoricalSum = (y: number, docTypes: string[], nameFilters: string[]) => {
        const yearEntries = allHistoryData.filter((d: any) => 
          Number(d.year) === y && docTypes.some(t => normalizeString(d.type || '') === normalizeString(t))
        );
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

      // Temos dados puramente de DFC oficial nesse ano?
      const isOfficialDfcAvailable = allHistoryData.some((d: any) => Number(d.year) === filterYear && (normalizeString(d.type || '') === 'dfc' || normalizeString(d.docType || '') === 'dfc'));

      // Se não temos DFC Oficial, tentamos inferir por BP/DRE Indireto
      // E verificamos se há DRE/BP no ano atual E no ano anterior
      const hasDRE = allHistoryData.some((d: any) => Number(d.year) === filterYear && (normalizeString(d.type || '') === 'dre' || normalizeString(d.docType || '') === 'dre'));
      const hasBP_current = allHistoryData.some((d: any) => Number(d.year) === filterYear && ['balanço patrimonial', 'bp', 'balanco patrimonial'].includes(normalizeString(d.type || d.docType || '')));
      const hasBP_previous = allHistoryData.some((d: any) => Number(d.year) === filterYear - 1 && ['balanço patrimonial', 'bp', 'balanco patrimonial'].includes(normalizeString(d.type || d.docType || '')));

      let confidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
      let violations: any[] = [];
      let evidenceLevel = 'DFC Validada';

      if (!isOfficialDfcAvailable) {
        evidenceLevel = 'Inferência Indireta (BP/DRE)';
        confidence = 'LOW';
        violations.push({
          rule: 'INFERRED_CASHFLOW_ONLY',
          severity: 'MEDIUM',
          message: 'Fluxo de Caixa inferido via Método Indireto. Não houve importação de DFC oficial. Não se pode tirar conclusões absolutas sobre resiliência.',
          blocked: false
        });

        if (!hasDRE || !hasBP_current || !hasBP_previous) {
            return {
              engineName: 'LegacyDFCAdapter',
              success: false,
              confidence: 'LOW',
              violations: [{
                rule: 'MISSING_INDIRECT_PREREQUISITES',
                severity: 'CRITICAL',
                message: 'Fluxo de caixa não disponível pelo runtime. Faltam DRE ou Balanços sequenciais para inferência indireta.',
                blocked: true
              }]
            };
        }
      }

      // Cálculos do Fluxo Indireto
      const lucroLiquido = getHistoricalValue(filterYear, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);
      const depreciacaoDre = Math.abs(getHistoricalSum(filterYear, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));

      const clientesAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
      const clientesAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
      const varClientes = clientesAnt - clientesAtual;

      const estoqueAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
      const estoqueAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
      const varEstoque = estoqueAnt - estoqueAtual;

      const fornecedoresAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
      const fornecedoresAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
      const varFornecedores = fornecedoresAtual - fornecedoresAnt;

      let fco = lucroLiquido + depreciacaoDre + varClientes + varEstoque + varFornecedores;

      const imobAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['imobilizado', 'intangivel', 'investimentos']);
      const imobAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['imobilizado', 'intangivel', 'investimentos']);
      const varImob = imobAnt - imobAtual;
      let fci = varImob - depreciacaoDre;

      const dividasAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos']);
      const dividasAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos']);
      const varDividas = dividasAtual - dividasAnt;

      const capAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
      const capAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
      const varCapital = capAtual - capAnt;

      const saldoInicialLucro = getHistoricalValue(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['lucros acumulados', 'lucro acumulado', 'prejuizos acumulados', 'lucros ou prejuizos']);
      const saldoFinalLucro = getHistoricalValue(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['lucros acumulados', 'lucro acumulado', 'prejuizos acumulados', 'lucros ou prejuizos']);
      const dividendos = saldoInicialLucro + lucroLiquido - saldoFinalLucro;

      let fcf = varDividas + varCapital - dividendos;

      // Helper to match DFC lines
      const getDfcValue = (entries: any[], keywords: string[]) => {
         const matches = entries.filter((s:any) => {
             const name = normalizeString(s?.conta || s?.category || '');
             return keywords.some(k => name.includes(k));
         });
         
         if (matches.length === 0) return 0;
         
         // Se houver apenas 1 correspondência, assumimos que é a linha de total ou item único
         if (matches.length === 1) {
             return matches[0]?.val || matches[0]?.valor || matches[0]?.value || 0;
         }
         
         // Se houver múltiplas correspondências, procuramos uma que pareça ser o subtotal explícito
         const totalMatch = matches.find((s:any) => {
             const name = normalizeString(s?.conta || s?.category || '');
             return name.includes('total') || name.includes('liquido') || name.includes('fluxo de caixa das') || name === 'fco' || name === 'fci' || name === 'fcf';
         });
         
         if (totalMatch) {
             return totalMatch?.val || totalMatch?.valor || totalMatch?.value || 0;
         }
         
         // Caso contrário, somamos os valores encontrados (útil para listas analíticas importadas de sistemas como Granatum)
         return matches.reduce((acc, curr) => acc + (curr?.val || curr?.valor || curr?.value || 0), 0);
      };

      // Se tiver DFC oficial, sobrescrevemos o total por lá. Como a DFCPage antes só pegava o valor indireto caso dbData vazio:
      // O código legado usava dbData (DFC real).
      if (isOfficialDfcAvailable) {
        const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && normalizeString(d.type || '') === 'dfc');
        
        // As linhas de subtotal podem existir ou ser linhas analíticas (ex: "Prejuízo líquido", "Capital social")
        const realFCO = getDfcValue(yearDfcEntries, ['operacional', 'operacionais', 'fco', 'prejuizo', 'lucro', 'resultado', 'receita', 'despesa', 'fornecedor', 'estoque', 'imposto', 'salario']);
        const realFCI = getDfcValue(yearDfcEntries, ['investimento', 'investimentos', 'fci', 'imobilizado', 'intangivel', 'aquisicao', 'venda', 'equipamento']);
        const realFCF = getDfcValue(yearDfcEntries, ['financiamento', 'financiamentos', 'fcf', 'capital', 'emprestimo', 'dividendo', 'distribuicao', 'socio', 'banco']);
        
        if (realFCO !== 0 || realFCI !== 0 || realFCF !== 0) {
            fco = realFCO;
            fci = realFCI;
            fcf = realFCF;
        }
      }

      let variacaoCaixa = fco + fci + fcf;

      // Gráfico histórico de 5 anos
      const chartData = [5, 4, 3, 2, 1, 0].map(offset => {
        const y = filterYear - offset;
        const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y && (normalizeString(d.type || '') === 'dfc' || normalizeString(d.docType || '') === 'dfc'));
        let o = 0; let i = 0; let f = 0;
        if (yearEntries.length > 0) {
          o = getDfcValue(yearEntries, ['operacional', 'operacionais', 'fco', 'prejuizo', 'lucro', 'resultado', 'receita', 'despesa', 'fornecedor', 'estoque', 'imposto', 'salario']);
          i = getDfcValue(yearEntries, ['investimento', 'investimentos', 'fci', 'imobilizado', 'intangivel', 'aquisicao', 'venda', 'equipamento']);
          f = getDfcValue(yearEntries, ['financiamento', 'financiamentos', 'fcf', 'capital', 'emprestimo', 'dividendo', 'distribuicao', 'socio', 'banco']);
        }
        return {
          year: y.toString(),
          operacional: o,
          investimento: i,
          financiamento: f
        };
      }).filter(d => d.operacional !== 0 || d.investimento !== 0 || d.financiamento !== 0);

      // Linhas detalhadas para a tabela (se não tiver DFC oficial, usa as indiretas)
      let tableRows: any[] = [];
      if (isOfficialDfcAvailable) {
          tableRows = allHistoryData.filter((d: any) => Number(d.year) === filterYear && (normalizeString(d.type || '') === 'dfc' || normalizeString(d.docType || '') === 'dfc'));
      } else {
          tableRows = [
            { item: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: fco, isTotal: true },
            { item: '  Lucro Líquido', val: lucroLiquido, isSubTotal: false },
            { item: '  Depreciação e Amortização', val: depreciacaoDre, isSubTotal: false },
            { item: '  Variação de Clientes', val: varClientes, isSubTotal: false },
            { item: '  Variação de Estoques', val: varEstoque, isSubTotal: false },
            { item: '  Variação de Fornecedores', val: varFornecedores, isSubTotal: false },
            { item: 'Fluxo de Caixa das Atividades de Investimento (FCI)', val: fci, isTotal: true },
            { item: '  Aquisição/Alienação de Imob. e Intangível', val: fci, isSubTotal: false },
            { item: 'Fluxo de Caixa das Atividades de Financiamento (FCF)', val: fcf, isTotal: true },
            { item: '  Captação/Amortização de Empréstimos', val: varDividas, isSubTotal: false },
            { item: '  Aumento de Capital', val: varCapital, isSubTotal: false },
            { item: '  Distribuição de Dividendos e Lucros', val: -dividendos, isSubTotal: false },
            { item: 'Aumento / Redução de Caixa (Variação Líquida)', val: variacaoCaixa, isTotal: true },
          ];
      }

      const reinvestmentCapacity = fco > 0 ? ((Math.abs(fci) / fco) * 100).toFixed(1) : '0';

      const metrics = {
          fco,
          fci,
          fcf,
          variacaoCaixa,
          reinvestmentCapacity,
          chartData,
          tableRows,
          isGenerated: !isOfficialDfcAvailable
      };

      // Causalidade básica governada
      const causality: CausalityChain[] = [];
      if (fco < 0) {
          causality.push({
            trigger: 'FCO Negativo',
            consequence: 'Consumo orgânico de caixa, pressionando tesouraria e exigindo injeção de capital (FCF).',
            amplification: null,
            mitigation: null,
            businessImpact: 'Operação deficitária em geração de disponibilidade.',
            structuralRisk: 'Alto',
            institutionalImpact: 'Desaceleração recomendada.'
          });
      }
      if (fco > 0 && Math.abs(fci) > fco && fci < 0) {
          causality.push({
            trigger: 'Investimentos excedem FCO',
            consequence: 'O negócio demanda mais capital fixo do que a operação é capaz de sustentar sozinha, exigindo dívida (FCF).',
            amplification: null,
            mitigation: null,
            businessImpact: 'Alavancagem inevitável para sustentar CAPEX.',
            structuralRisk: 'Médio',
            institutionalImpact: 'Atenção ao custo da dívida.'
          });
      }

      const narrative: AdvisoryNarrative = {
        diagnostic: isOfficialDfcAvailable 
          ? 'Diagnóstico estabelecido através de Fluxo de Caixa oficial.'
          : 'Inferência de caixa gerada com base em método indireto (Variações de BP). Limitação informacional impede diagnósticos absolutos de Runway.',
        cause: fco > 0 ? 'Operação geradora de caixa' : 'Operação consumidora de caixa',
        consequence: variacaoCaixa > 0 ? 'Aumento da disponibilidade' : 'Queima de disponibilidade',
        sensitivity: confidence === 'LOW' ? 'Alta incerteza' : 'Estruturada',
        risk: fco < 0 ? 'Alto' : 'Estável',
        priority: 'Monitoramento contínuo de liquidez',
        strategicMovement: 'Ajuste de ciclo financeiro e contenção de evasões.'
      };

      return {
        engineName: 'LegacyDFCAdapter',
        success: true,
        confidence,
        violations,
        inference: {
          domain: 'Inteligência de Caixa (DFC)',
          metrics,
          causality,
          narrative,
          confidence,
          evidenceLevel,
          score: null
        }
      };
    } catch (error: any) {
      return {
        engineName: 'LegacyDFCAdapter',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'DFC_PROCESSING_ERROR',
          severity: 'CRITICAL',
          message: error.message || 'Erro catastrófico no processamento da DFC.',
          blocked: true
        }]
      };
    }
  }
};
