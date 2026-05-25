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
      const filterYear = input.rawFinancialData?.filterYear || new Date().getFullYear();

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
      const isOfficialDfcAvailable = allHistoryData.some((d: any) => Number(d.year) === filterYear && normalizeString(d.type || '') === 'dfc');

      // Se não temos DFC Oficial, tentamos inferir por BP/DRE Indireto
      // E verificamos se há DRE/BP no ano atual E no ano anterior
      const hasDRE = allHistoryData.some((d: any) => Number(d.year) === filterYear && normalizeString(d.type || '') === 'dre');
      const hasBP_current = allHistoryData.some((d: any) => Number(d.year) === filterYear && ['balanço patrimonial', 'bp', 'balanco patrimonial'].includes(normalizeString(d.type || '')));
      const hasBP_previous = allHistoryData.some((d: any) => Number(d.year) === filterYear - 1 && ['balanço patrimonial', 'bp', 'balanco patrimonial'].includes(normalizeString(d.type || '')));

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

      // Se tiver DFC oficial, sobrescrevemos o total por lá. Como a DFCPage antes só pegava o valor indireto caso dbData vazio:
      // O código legado usava dbData (DFC real).
      if (isOfficialDfcAvailable) {
        const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && normalizeString(d.type || '') === 'dfc');
        const getValue = (name: string) => yearDfcEntries.find((s:any) => (s.conta || s.category || '').toLowerCase().includes(name.toLowerCase()))?.val || 0;
        
        // As linhas de subtotal podem existir
        const realFCO = getValue('Atividades Operacionais');
        const realFCI = getValue('Atividades de Investimento');
        const realFCF = getValue('Atividades de Financiamento');
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
        const yearEntries = allHistoryData.filter((d: any) => d.year === y && d.type === 'DFC');
        let o = 0; let i = 0; let f = 0;
        if (yearEntries.length > 0) {
          o = yearEntries.filter((d:any) => (d.conta || d.category || '').toLowerCase().includes('operacionais')).reduce((acc:any, d:any) => acc + (d.val || d.valor || d.value || 0), 0);
          i = yearEntries.filter((d:any) => (d.conta || d.category || '').toLowerCase().includes('investimento')).reduce((acc:any, d:any) => acc + (d.val || d.valor || d.value || 0), 0);
          f = yearEntries.filter((d:any) => (d.conta || d.category || '').toLowerCase().includes('financiamento')).reduce((acc:any, d:any) => acc + (d.val || d.valor || d.value || 0), 0);
        }
        // Se quisermos poderíamos calcular método indireto para o passado, mas o legado só fazia se existisse DFC para o gráfico!
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
          tableRows = allHistoryData.filter((d: any) => Number(d.year) === filterYear && normalizeString(d.type || '') === 'dfc');
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
