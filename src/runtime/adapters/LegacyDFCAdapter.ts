import { EngineDefinition, InstitutionalContext, EngineExecutionResult, InferenceBlock, CausalityChain, AdvisoryNarrative } from '../types';
import { EarlyStageNarrativeEngine } from '../../core/runtime/semantic/EarlyStageNarrativeEngine';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateDreCascade } from '../../lib/dreCascade';
import { RunwayAuditEngine } from '../../core/runtime/semantic/RunwayAuditEngine';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
import { DFCSemanticCanonicalRootResolver } from '../../core/runtime/lifecycle/DFCSemanticCanonicalRootResolver';
import { ExecutiveLifecycleContextResolver } from '../../core/runtime/lifecycle/ExecutiveLifecycleContextResolver';
import { FiduciaryCashIntelligenceRuntime } from '../../core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime';
import { CashQualityExplainabilityEngine } from '../../core/runtime/cash-intelligence/CashQualityExplainabilityEngine';

const localNormalizeString = (s: string) => 
  s.toLowerCase()
   .normalize('NFD')
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]/g, '');

export function extractSovereignNetIncomeWithAccount(dre: any[]): { value: number; account: string } | null {
  if (!dre || dre.length === 0) return null;
  const aliases = [
    'netIncome',
    'net income',
    'resultadoLiquido',
    'resultado líquido',
    'lucroLiquido',
    'lucro líquido',
    'prejuizoLiquido',
    'prejuízo líquido',
    'lucroPrejuizoDoExercicio',
    'lucro/prejuízo do exercício',
    'lucro ou prejuízo do exercício',
    'resultado do exercício',
    'prejuízo do exercício',
    'prejuizo do exercicio',
    'lucro do exercício',
    'lucro do exercicio',
    'resultado do período',
    'resultado do periodo',
    'resultado líquido do período',
    'resultado liquido do periodo',
    'lucro líquido do período',
    'lucro liquido do periodo',
    'prejuízo líquido do período',
    'prejuizo liquido do periodo'
  ];
  
  const normalizedAliases = aliases.map(localNormalizeString);

  const matchedEntry = dre.find((d: any) => {
    const c = localNormalizeString(d.conta || d.category || d.item || '');
    return normalizedAliases.some(alias => c === alias || c.includes(alias));
  });

  if (matchedEntry) {
    const val = matchedEntry.val ?? matchedEntry.valor ?? matchedEntry.value;
    if (val !== undefined && val !== null) {
      let numVal = Number(val);
      const nameNorm = localNormalizeString(matchedEntry.conta || matchedEntry.category || matchedEntry.item || '');
      // If the alias contains "prejuízo", make sure it is negative
      if (nameNorm.includes('prejuizo') && numVal > 0) {
        numVal = -numVal;
      }
      return {
        value: numVal,
        account: matchedEntry.conta || matchedEntry.category || matchedEntry.item || ''
      };
    }
  }
  return null;
}

export function extractSovereignNetIncome(dre: any[]): number | null {
  const res = extractSovereignNetIncomeWithAccount(dre);
  return res ? res.value : null;
}

export const LegacyDFCAdapter: EngineDefinition = {
  name: 'LegacyDFCAdapter',
  priority: 12, // Executa depois do DRE e Financial (BP)
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

      const matchDocType = (d: any, docTypes: string[]) => {
        const typeNorm = normalizeString(d.type || '');
        const docTypeNorm = normalizeString(d.docType || '');
        const entryTypeNorm = normalizeString(d.entryType || '');
        return docTypes.some(t => {
          const tNorm = normalizeString(t);
          return typeNorm === tNorm || docTypeNorm === tNorm || entryTypeNorm === tNorm;
        });
      };

      const getHistoricalValue = (y: number, docTypes: string[], nameFilters: string[]) => {
        const yearEntries = allHistoryData.filter((d: any) => 
          Number(d.year) === y && matchDocType(d, docTypes)
        );
        const normalizedFilters = nameFilters.map(normalizeString);
        const match = yearEntries.find((d: any) => {
          const c = normalizeString(d.conta || d.category || '');
          return normalizedFilters.some(n => c === n || c.includes(n));
        });
        return match?.val || match?.valor || match?.value || 0;
      };
      
      const getHistoricalSum = (y: number, docTypes: string[], nameFilters: string[], excludePassivo = false) => {
        const yearEntries = allHistoryData.filter((d: any) => 
          Number(d.year) === y && matchDocType(d, docTypes) && (!excludePassivo || (d.type || d.entryType || '').toLowerCase() !== 'passivo')
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

      const getHistoricalSumFiltered = (y: number, docTypes: string[], nameFilters: string[], excludeKeywords: string[] = []) => {
        const yearEntries = allHistoryData.filter((d: any) => 
          Number(d.year) === y && matchDocType(d, docTypes)
        );
        let sum = 0;
        const normalizedFilters = nameFilters.map(normalizeString);
        const normalizedExcludes = excludeKeywords.map(normalizeString);
        yearEntries.forEach((d: any) => {
          const c = normalizeString(d.conta || d.category || '');
          const parent = normalizeString(d.parentId || d.parent || '');
          if (normalizedFilters.some(n => c === n || c.includes(n))) {
             const matchesExclude = normalizedExcludes.some(ex => c.includes(ex) || parent.includes(ex));
             if (!matchesExclude) {
                sum += (d.val || d.valor || d.value || 0);
             }
          }
        });
        return sum;
      };

      // Temos dados puramente de DFC oficial nesse ano?
      const isOfficialDfcAvailable = allHistoryData.some((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));

      // Se não temos DFC Oficial, tentamos inferir por BP/DRE Indireto
      // E verificamos se há DRE/BP no ano atual E no ano anterior
      const hasDRE = allHistoryData.some((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dre', 'resultado']));
      const hasBP_current = allHistoryData.some((d: any) => Number(d.year) === filterYear && matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco']));
      const hasBP_previous = allHistoryData.some((d: any) => Number(d.year) === filterYear - 1 && matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco']));

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

      // hasDRE is already declared in the outer scope
      
      let netIncome: number | null = null;
      let netIncomeSourceAccount: string | null = null;
      let netIncomeSourceValue: number | null = null;

      if (hasDRE) {
        const dreEntries = allHistoryData.filter((d: any) => 
          Number(d.year) === filterYear && matchDocType(d, ['dre', 'resultado'])
        );

        // Calculate via cascade first to get the mathematically correct value, bypassing corrupted 0 rows
        const m = dreEntries.map((d: any) => ({ ...d, value: d.val || d.valor || d.value || 0 }));
        const cascadeRes = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map(a => ({ ...a, value: 0 })), ...m]);
        const calculatedLL = cascadeRes.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue;
        
        if (calculatedLL !== undefined && calculatedLL !== null && calculatedLL !== 0) {
          netIncome = calculatedLL;
          netIncomeSourceAccount = 'DRE Cascade (Soberano)';
          netIncomeSourceValue = calculatedLL;
        } else {
          // Fallback to raw extraction
          const extracted = extractSovereignNetIncomeWithAccount(dreEntries);
          if (extracted) {
            netIncome = extracted.value;
            netIncomeSourceAccount = extracted.account;
            netIncomeSourceValue = extracted.value;
          }
        }
      }

      if (netIncome === null) {
        violations.push({
          rule: 'NET_INCOME_SOURCE_MISSING',
          severity: 'HIGH',
          message: 'Divergência fiduciária: Demonstração de Resultado do Exercício (DRE) não apresenta a linha de Lucro Líquido válida.',
          blocked: false
        });
      }

      const lucroLiquido = netIncome !== null ? netIncome : 0;
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
      // Helper to classify DFC entry group based on keywords
      const getEntryDfcGroup = (name: string): 'FCO' | 'FCI' | 'FCF' => {
        const norm = normalizeString(name);
        if (
          norm.includes('investimento') || 
          norm.includes('fci') || 
          norm.includes('imobilizado') || 
          norm.includes('intangivel') || 
          norm.includes('aquisicao') || 
          norm.includes('equipamento') || 
          norm.includes('alienacao') ||
          norm.includes('compra de ativo') ||
          norm.includes('outros investimentos')
        ) {
          return 'FCI';
        }
        if (
          norm.includes('financiamento') || 
          norm.includes('fcf') || 
          norm.includes('capital') || 
          norm.includes('aporte') || 
          norm.includes('integralizacao') || 
          norm.includes('emprestimo') || 
          norm.includes('dividendo') || 
          norm.includes('distribuicao') || 
          norm.includes('banco')
        ) {
          return 'FCF';
        }
        return 'FCO';
      };

      // Helper to find specific section subtotal
      const getDfcSectionSubtotal = (entries: any[], section: 'FCO' | 'FCI' | 'FCF') => {
         const match = entries.find((s:any) => {
             const name = normalizeString(s?.conta || s?.category || s?.item || '');
             if (section === 'FCO') {
                 return (
                     (name.includes('liquido') && (name.includes('operacio') || name.includes('operaco'))) ||
                     (name.includes('fco') && (name.includes('liquido') || name.includes('consumido') || name.includes('gerado') || name.includes('das atividades')))
                 ) && !name.includes('prejuizo') && !name.includes('lucro') && !name.includes('resultado');
             } else if (section === 'FCI') {
                 return (
                     (name.includes('liquido') && name.includes('investimento')) ||
                     (name.includes('fci') && (name.includes('liquido') || name.includes('consumido') || name.includes('gerado') || name.includes('das atividades') || name.includes('fluxo liquido')))
                 );
             } else {
                 return (
                     (name.includes('liquido') && name.includes('financiamento')) ||
                     (name.includes('fcf') && (name.includes('liquido') || name.includes('consumido') || name.includes('gerado') || name.includes('das atividades') || name.includes('fluxo liquido')))
                 );
             }
         });
         return match ? (match.val ?? match.valor ?? match.value ?? 0) : 0;
      };

      // Helper to sum detailed rows of a section as fallback
      const getDfcSectionSum = (entries: any[], section: 'FCO' | 'FCI' | 'FCF') => {
         let sum = 0;
         entries.forEach((s:any) => {
             const name = normalizeString(s?.conta || s?.category || s?.item || '');
             
             const isSubtotal = (
                 (name.includes('liquido') && (name.includes('operacio') || name.includes('operaco') || name.includes('investimento') || name.includes('financiamento'))) ||
                 name.includes('fluxo de caixa das') || name === 'fco' || name === 'fci' || name === 'fcf' || name.includes('fluxo liquido de')
             );
             const isSummary = name.includes('inicial') || name.includes('final') || name.includes('abertura') || name.includes('fechamento') || name.includes('estimada de caixa') || name.includes('teorico') || name.includes('saldo');
             
             if (!isSubtotal && !isSummary) {
                 const group = getEntryDfcGroup(s?.conta || s?.category || s?.item || '');
                 if (group === section) {
                     sum += (s.val ?? s.valor ?? s.value ?? 0);
                 }
             }
         });
         return sum;
      };

      let originalFco = fco;
      let originalFci = fci;
      let originalFcf = fcf;

      if (isOfficialDfcAvailable) {
         const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));
         let realFCO = getDfcSectionSubtotal(yearDfcEntries, 'FCO');
         let realFCI = getDfcSectionSubtotal(yearDfcEntries, 'FCI');
         let realFCF = getDfcSectionSubtotal(yearDfcEntries, 'FCF');
         
         if (realFCO === 0) realFCO = getDfcSectionSum(yearDfcEntries, 'FCO');
         if (realFCI === 0) realFCI = getDfcSectionSum(yearDfcEntries, 'FCI');
         if (realFCF === 0) realFCF = getDfcSectionSum(yearDfcEntries, 'FCF');
         
         fco = realFCO;
         fci = realFCI;
         fcf = realFCF;
         
         originalFco = realFCO;
         originalFci = realFCI;
         originalFcf = realFCF;
      }

      let variacaoCaixa = fco + fci + fcf;

      // ── SISTEMA FIDUCIÁRIO DE CAIXA ─────────────────────────────────────────
      const normalizeForMatch = (s: string) => {
        if (!s) return '';
        return s.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, "") // remove accents
          .trim();
      };

      const classifyEntry = (name: string): 'RELATED_PARTY' | 'CAPITAL_INJECTION' | 'ARTIFICIAL_LIQUIDITY' | 'NON_RECURRING' | 'TAX' | 'FINANCIAL' | 'OPERATIONAL' => {
        const norm = normalizeForMatch(name);

        // 1. Related Party (Checking first to give absolute priority, but excluding Capital Injections)
        const capitalKeywords = ['aporte', 'capital social', 'integralizacao', 'aumento de capital'];
        const isCapital = capitalKeywords.some(k => norm.includes(k));

        const rpKeywords = [
          'socio', 'socios', 'acionista', 'acionistas', 'partes relacionadas',
          'mutuo', 'conta corrente socios', 'adiantamento socios', 'emprestimo socios',
          'emprestimo acionistas', 'creditos com socios', 'debitos com socios',
          'retirada socios', 'distribuicao socios', 'pro labore socios'
        ];
        const isRP = rpKeywords.some(k => norm.includes(k));

        if (isRP && !isCapital) {
          return 'RELATED_PARTY';
        }
        if (isCapital) {
          return 'CAPITAL_INJECTION';
        }
        
        // 3. Artificial Liquidity
        const artificialKeywords = ['artificial', 'inflador', 'infladores', 'liquidez artificial'];
        if (artificialKeywords.some(k => norm.includes(k))) {
          return 'ARTIFICIAL_LIQUIDITY';
        }

        // 4. Non-Recurring
        const nonRecurringKeywords = ['venda de ativo', 'alienacao', 'alienacaode', 'imobilizado', 'investimentos'];
        if (nonRecurringKeywords.some(k => norm.includes(k))) {
          return 'NON_RECURRING';
        }

        // 5. Tax
        const taxKeywords = ['imposto', 'tributo', 'irpj', 'csll', 'federal', 'impostos', 'tributos'];
        if (taxKeywords.some(k => norm.includes(k))) {
          return 'TAX';
        }

        // 6. Financial
        const financialKeywords = ['emprestimo', 'financiamento', 'debentures', 'juros', 'banco', 'dividendos', 'amortizacao'];
        if (financialKeywords.some(k => norm.includes(k))) {
          return 'FINANCIAL';
        }

        // 7. Operational
        return 'OPERATIONAL';
      };

      const isRelatedParty = (name: string): boolean => {
        return classifyEntry(name) === 'RELATED_PARTY';
      };

      // Coleta dados de balanço para cálculo de liquidez e governança
      const bpEntriesForYear = allHistoryData.filter((d: any) => 
        Number(d.year) === filterYear && 
        matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'])
      );
      
      const mappedBpEntries = bpEntriesForYear.map((d: any) => ({
        ...d,
        type: d.entryType || d.type
      }));
      const { summary: bpSummary, flatNodes } = buildBPHierarchy(mappedBpEntries);
      const ativoTotal = bpSummary.ativoTotal || 1;
      const ativoCirculante = bpSummary.ativoCirculante || 0;
      const passivoCirculante = bpSummary.passivoCirculante || 1;
      const estoques = bpSummary.estoques || 0;
      
      // Exclui crédito de partes relacionadas não circulantes da fórmula de liquidez Operacional Real
      let creditosSociosCirculantes = 0;
      const rpKeywords = ['mutuo', 'socio', 'partes relacionadas', 'adiantamento a socios', 'creditos com socios', 'conta corrente socios'];
      
      flatNodes.forEach((node: any) => {
        if (node.type === 'ativo' && !node.isSynthetic) {
          const name = normalizeString(node.category);
          if (rpKeywords.some(k => name.includes(k))) {
            // Check if this node is non-circulating by checking its ancestors
            let isNonCirculating = false;
            let current = node;
            while (current) {
              const currentName = normalizeString(current.category);
              if (currentName.includes('nao circulante') || currentName.includes('não circulante') || currentName.includes('longo prazo') || currentName.includes('realizavel a longo prazo')) {
                isNonCirculating = true;
                break;
              }
              if (!current.parentId) break;
              const parentNode = flatNodes.find((p: any) => p.id === current.parentId);
              if (!parentNode) break;
              current = parentNode;
            }
            if (!isNonCirculating) {
              creditosSociosCirculantes += node.value;
            }
          }
        }
      });

      const creditosSociosTotais = getHistoricalSum(
        filterYear,
        ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'],
        ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios', 'creditos com socios', 'conta corrente socios']
      );

      // EBITDA e outros dados DRE de apoio
      const ebitdaRow = getHistoricalValue(filterYear, ['dre', 'resultado'], ['ebitda', 'lajida', 'lajirda']);
      const despFin = getHistoricalSum(filterYear, ['dre', 'resultado'], ['despesa financeira', 'despesas financeiras', 'resultado financeiro', 'financeiras', 'juros']);
      const impostos = getHistoricalSum(filterYear, ['dre', 'resultado'], ['irpj', 'csll', 'imposto de renda', 'contribuicao social', 'provisao ir']);
      const ebitda = ebitdaRow !== 0 ? ebitdaRow : (lucroLiquido + depreciacaoDre + Math.abs(despFin) + Math.abs(impostos));

      // Try to extract initial and final cash from DFC if available
      let dfcCaixaInicial = 0;
      let dfcCaixaFinal = 0;
      let hasDfcCaixaInicial = false;
      let hasDfcCaixaFinal = false;

      if (isOfficialDfcAvailable) {
        const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));
        yearDfcEntries.forEach((d: any) => {
          const norm = normalizeForMatch(d.conta || d.category || d.item || '');
          const val = d.val || d.valor || d.value || 0;
          if (
            (norm.includes('saldo') || norm.includes('caixa')) &&
            (norm.includes('inicial') || norm.includes('inicio') || norm.includes('no inicio') || norm.includes('anterior'))
          ) {
            dfcCaixaInicial = val;
            hasDfcCaixaInicial = true;
          }
          if (
            (norm.includes('saldo') || norm.includes('caixa')) &&
            (norm.includes('final') || norm.includes('fim') || norm.includes('no fim') || norm.includes('atual'))
          ) {
            dfcCaixaFinal = val;
            hasDfcCaixaFinal = true;
          }
        });
      }

      // 1. Universal Cash Reconciliation Engine
      const bpEntriesPrevYear = allHistoryData.filter((d: any) => 
        Number(d.year) === filterYear - 1 && 
        matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'])
      );

      const buildCashReconciliation = () => {
        const caixaFinalReal = bpSummary.caixaEquivalentes || 0;

        let bpAnteriorCaixaEquivalentes: number | null = null;
        if (bpEntriesPrevYear.length > 0) {
          const mappedBpEntriesPrev = bpEntriesPrevYear.map((d: any) => ({ ...d, type: d.entryType || d.type }));
          const { summary: bpSummaryPrev } = buildBPHierarchy(mappedBpEntriesPrev);
          bpAnteriorCaixaEquivalentes = bpSummaryPrev.caixaEquivalentes || 0;
        }

        const caixaInicialReal = bpAnteriorCaixaEquivalentes ?? (hasDfcCaixaInicial ? dfcCaixaInicial : 0);
        const variacaoLiquidaReal = caixaFinalReal - caixaInicialReal;

        return {
          caixaInicialReal,
          caixaFinalReal,
          variacaoLiquidaReal
        };
      };

      const { caixaInicialReal, caixaFinalReal, variacaoLiquidaReal } = buildCashReconciliation();
      const variacaoLiquidaConciliada = variacaoLiquidaReal;

      // 2. Reconciliation Gap Engine
      const caixaInicialDFC = hasDfcCaixaInicial ? dfcCaixaInicial : caixaInicialReal;
      const variacaoDFC = variacaoCaixa;
      const caixaFinalEstimado = caixaInicialDFC + variacaoDFC;
      const reconciliationGap = Math.abs(caixaFinalEstimado - caixaFinalReal);

      if (reconciliationGap > Math.max(1, ativoTotal * 0.0001)) {
        violations.push({
          rule: 'DFC_RECONCILIATION_MISMATCH',
          severity: 'HIGH',
          message: `Divergência detectada na conciliação do fluxo de caixa fiduciário (Diferença: R$ ${reconciliationGap.toFixed(2)}).`,
          blocked: false
        });
      }

      // Disponível total
      const availableCash = caixaFinalReal || Math.max(0, variacaoLiquidaConciliada);

      // Identifica fluxos da DFC
      let relatedPartyEffectsInsideFCO = 0;
      let relatedPartyEffectsInsideFCI = 0;
      let relatedPartyEffectsInsideFCF = 0;
      let fluxoPartesRelacionadas = 0;
      let saidasParaPartesRelacionadas = 0;
      let fluxoCapitalizacao = 0;
      let fluxoArtificial = 0;

      let hasRpInDfc = false;
      const reconstructedFiduciaryEntries: any[] = [];

      if (isOfficialDfcAvailable) {
        const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));
        
        let currentGroup: 'FCO' | 'FCI' | 'FCF' = 'FCO';
        yearDfcEntries.forEach((d: any) => {
          const name = normalizeString(d.conta || d.category || d.item || '');
          if (name.includes('operacional') || name.includes('operacionais') || name === 'fco') {
            currentGroup = 'FCO';
          } else if (name.includes('investimento') || name.includes('investimentos') || name === 'fci') {
            currentGroup = 'FCI';
          } else if (name.includes('financiamento') || name.includes('financiamentos') || name === 'fcf') {
            currentGroup = 'FCF';
          }

          const val = d.val || d.valor || d.value || 0;
          const nature = classifyEntry(d.conta || d.category || d.item || '');

          if (nature === 'RELATED_PARTY') {
            fluxoPartesRelacionadas += val;
            if (val < 0) {
              saidasParaPartesRelacionadas += val;
            }
            if (currentGroup === 'FCO') {
              relatedPartyEffectsInsideFCO += val;
            } else if (currentGroup === 'FCI') {
              relatedPartyEffectsInsideFCI += val;
            } else if (currentGroup === 'FCF') {
              relatedPartyEffectsInsideFCF += val;
            }
          } else if (nature === 'CAPITAL_INJECTION') {
            fluxoCapitalizacao += val;
          } else if (nature === 'ARTIFICIAL_LIQUIDITY') {
            fluxoArtificial += val;
          }
        });

        // RECONSTRUCTION: If creditosSociosTotais exists in BP but no Related Party flow was mapped in DFC,
        // we create a reconstructed fiduciary entry for "Conta Corrente Sócios" = -creditosSociosTotais
        hasRpInDfc = yearDfcEntries.some(d => {
          const norm = normalizeString(d.conta || d.category || d.item || '');
          return norm.includes('socio') || norm.includes('partes relacionadas') || norm.includes('mutuo');
        });

        if (!hasRpInDfc && creditosSociosTotais !== 0) {
          const reconstructedVal = -creditosSociosTotais; // Outflow
          const entry = {
            item: 'Conta Corrente Sócios',
            val: reconstructedVal,
            nature: 'RELATED_PARTY' as const,
            isReconstructed: true,
            metadata: {
              source: 'Balance Sheet',
              status: 'Reconstructed',
              reason: 'Movimentação de partes relacionadas necessária para conciliação BP x DFC',
              account: 'Conta Corrente Sócios',
              value: reconstructedVal
            }
          };
          reconstructedFiduciaryEntries.push(entry);
          
          // Apply reconstructed effects
          fluxoPartesRelacionadas += reconstructedVal;
          if (reconstructedVal < 0) {
            saidasParaPartesRelacionadas += reconstructedVal;
          }
          // The omitted related party movement was inside operating working capital
          relatedPartyEffectsInsideFCO += reconstructedVal;
        }
      } else {
        // Indireto - calcula através de variações patrimoniais
        const creditosSociosAnt = getHistoricalSum(
          filterYear - 1,
          ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'],
          ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios', 'creditos com socios', 'conta corrente socios']
        );
        const varCreditosSocios = creditosSociosAnt - creditosSociosTotais;

        const passivoSociosAtual = getHistoricalSum(
          filterYear,
          ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'],
          ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento de sócios', 'conta corrente sócios', 'emprestimo socios']
        );
        const passivoSociosAnt = getHistoricalSum(
          filterYear - 1,
          ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'],
          ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento de sócios', 'conta corrente sócios', 'emprestimo socios']
        );
        const varPassivosSocios = passivoSociosAtual - passivoSociosAnt;

        fluxoPartesRelacionadas = varCreditosSocios + varPassivosSocios;
        saidasParaPartesRelacionadas = fluxoPartesRelacionadas < 0 ? fluxoPartesRelacionadas : 0;
        
        // Pelo método indireto clássico, assume-se que esses fluxos estão refletidos no FCF contábil
        relatedPartyEffectsInsideFCF = fluxoPartesRelacionadas;

        // Capitalizacao em modo indireto
        const capAtual = getHistoricalSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
        const capAnt = getHistoricalSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
        fluxoCapitalizacao = capAtual - capAnt;
      }

      // Reconstructed Official FCO for fiduciary reconciliation includes reconstructed related party effects
      const fcoContabilReconciled = fco + (hasRpInDfc ? 0 : relatedPartyEffectsInsideFCO);
      const fcoOperacionalReal = fcoContabilReconciled - relatedPartyEffectsInsideFCO;
      const caixaOperacionalAjustado = fcoOperacionalReal - fluxoArtificial;
      const fcoAjustado = caixaOperacionalAjustado;

      if (netIncome !== null) {
        if (netIncome > 0 && fcoOperacionalReal < 0) {
          violations.push({
            rule: 'PROFIT_WITHOUT_CASH',
            severity: 'HIGH',
            message: 'Divergência fiduciária crítica detectada: a empresa apresenta lucro líquido contábil positivo, mas o fluxo de caixa operacional real é negativo (Lucro sem suporte de caixa).',
            blocked: false
          });
        } else if (netIncome < 0 && fcoOperacionalReal < 0) {
          violations.push({
            rule: 'LOSS_WITH_CASH_CONSUMPTION',
            severity: 'HIGH',
            message: 'Prejuízo contábil acompanhado de consumo operacional de caixa.',
            blocked: false
          });
        }
      }

      // 4. EQE Integrity Validation
      const validateEQENetIncomeLineage = () => {
        const dreInf = context.inferences?.['LegacyDREAdapter'];
        const dreNetIncomeVal = dreInf?.metrics?.lucroLiq !== undefined ? dreInf.metrics.lucroLiq : null;
        if (netIncome !== dreNetIncomeVal) {
          violations.push({
            rule: 'EQS_NET_INCOME_LINEAGE_BREAK',
            severity: 'CRITICAL',
            message: `Divergência de linhagem: o Lucro Líquido no EQE (${netIncome}) diverge do Lucro Líquido soberano da DRE (${dreNetIncomeVal}).`,
            sourceEngine: 'LegacyDFCAdapter',
            blocked: false
          });
        }
      };

      validateEQENetIncomeLineage();

      const receitaLiquida = getHistoricalValue(filterYear, ['dre', 'resultado'], ['receita liquida', 'receita operacional liquida', 'receitas liquidas', 'faturamento liquido', 'rol']);

      // FCI e FCF Reais
      const fciReal = relatedPartyEffectsInsideFCI !== 0 ? (fci - relatedPartyEffectsInsideFCI) : fci;
      const fcfReal = relatedPartyEffectsInsideFCF !== 0 ? (fcf - relatedPartyEffectsInsideFCF) : fcf;

      // Novas métricas fiduciárias
      const intensidadePartesRelacionadas = fcoContabilReconciled !== 0 ? (Math.abs(fluxoPartesRelacionadas) / Math.abs(fcoContabilReconciled)) : 0;
      const partesRelacionadasAtivoTotal = Math.abs(creditosSociosTotais) / ativoTotal;
      const drenagemSocietaria = Math.abs(saidasParaPartesRelacionadas) / ativoTotal;
      
      const liquidezOperacionalReal = (ativoCirculante - estoques - creditosSociosCirculantes) / passivoCirculante;

      let availableCashForRunway = caixaFinalReal;
      if (availableCashForRunway <= 0 && ativoCirculante > 0) availableCashForRunway = ativoCirculante * 0.1;
      const runwayAudit = RunwayAuditEngine.calculate(availableCashForRunway, fcoOperacionalReal, `Exercício ${filterYear}`);
      const runwayFid = runwayAudit.runwayMeses === Infinity ? 99.0 : runwayAudit.runwayMeses;
      const operationalBurnFid = (fcoOperacionalReal < 0 ? Math.abs(fcoOperacionalReal) : 0) + (fciReal < 0 ? Math.abs(fciReal) : 0);

      // 5. EBITDA Conversion Stabilization Engine & 6. Safe Conversion Renderer Payload
      const buildCashConversionStatus = (eb: number, rl: number, fcoReal: number) => {
        if (eb <= 0 && fcoReal <= 0) {
          return {
            status: 'NOT_APPLICABLE_NEGATIVE_EBITDA_AND_CASH',
            value: null,
            label: 'Não Aplicável',
            description: 'EBITDA e fluxo operacional de caixa negativos. Não há conversão positiva de resultado em caixa; há consumo simultâneo de resultado e tesouraria.'
          };
        }
        if (eb <= 0) {
          return {
            status: 'NOT_APPLICABLE_NEGATIVE_EBITDA',
            value: null,
            label: 'Não Aplicável',
            description: 'EBITDA negativo impossibilita leitura econômica de conversão de caixa.'
          };
        }
        if (fcoReal <= 0) {
          return {
            status: 'SEVERE_DETERIORATION',
            value: null,
            label: 'Conversão Severamente Deteriorada',
            description: 'O resultado operacional não se converteu em geração positiva de caixa.'
          };
        }

        const threshold = Math.max(5000, (rl || 0) * 0.02);
        const isNearZero = Math.abs(eb) < threshold;
        
        if (isNearZero) {
          return {
            status: 'NOT_APPLICABLE',
            value: null,
            label: 'Não Aplicável',
            description: 'Métrica não aplicável devido ao EBITDA próximo de zero.'
          };
        } else {
          const value = fcoReal / eb;
          return {
            status: 'NORMAL',
            value,
            label: `${(value * 100).toFixed(1)}%`,
            description: 'Conversão normal de EBITDA em caixa operacional.'
          };
        }
      };

      const cashConversionDisplay = buildCashConversionStatus(ebitda, receitaLiquida, fcoOperacionalReal);
      const conversaoEbitdaCaixaFid = cashConversionDisplay.value ?? 0;
      const conversaoEbitdaCaixaStatus = cashConversionDisplay.status;

      let stressLiquidezStatus = 'Estável';
      if (liquidezOperacionalReal < 0.8) stressLiquidezStatus = 'Crítico';
      else if (liquidezOperacionalReal < 1.2) stressLiquidezStatus = 'Atenção';

      let sustentabilidadeTesouraria = 'Sustentável';
      if (fcoOperacionalReal < 0 && runwayFid < 6) sustentabilidadeTesouraria = 'Crítica';
      else if (fcoOperacionalReal < 0 || runwayFid < 12) sustentabilidadeTesouraria = 'Sensível';

      // Regras de Governança
      const governanceWarnings: string[] = [];
      if (partesRelacionadasAtivoTotal > 0.20) {
        governanceWarnings.push("Identificada dependência relevante de acionistas/sócios.");
      }
      if (Math.abs(fluxoPartesRelacionadas) > Math.abs(ebitda)) {
        governanceWarnings.push("Os fluxos com partes relacionadas excedem a capacidade de geração de caixa operacional.");
      }
      if (fcoOperacionalReal < 0 && (fcf > 0 || fluxoPartesRelacionadas > 0 || fluxoCapitalizacao > 0)) {
        governanceWarnings.push("A continuidade financeira do exercício dependeu predominantemente de suporte externo ou dos sócios.");
      }

      // Regra de Maturidade / Early-Stage
      const scope = context.input.rawFinancialData?.scope;
      const uniqueYears = [...new Set(allHistoryData.map((d: any) => Number(d.year)))] as number[];
      const historicalCyclesCount = scope?.historicalCycles ?? context.input.historicalCyclesCount ?? uniqueYears.length;
      const isEarlyStage = historicalCyclesCount < 3;
      const isFirstCycle = scope?.isFirstCycle === true || historicalCyclesCount <= 1;

      // Helper to calculate capitalization for a specific year
      const getYearCapitalization = (y: number) => {
        const yearDfc = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));
        if (yearDfc.length > 0) {
          let cap = 0;
          yearDfc.forEach((d: any) => {
            if (classifyEntry(d.conta || d.category || d.item || '') === 'CAPITAL_INJECTION') {
              cap += (d.val || d.valor || d.value || 0);
            }
          });
          return cap;
        } else {
          const capAtual = getHistoricalSum(y, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
          const capAnt = getHistoricalSum(y - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
          return capAtual - capAnt;
        }
      };

      const histYears = uniqueYears.filter(y => y !== filterYear);
      let capitalizationYearsCount = 0;
      histYears.forEach(y => {
        if (getYearCapitalization(y) > 0) {
          capitalizationYearsCount++;
        }
      });

      // ── CASH QUALITY SCORE (CQS) ENGINE ─────────────────────────────────────
      // 1. Operational Cash Conversion (25%)
      let conversionVal = 0;
      let conversionScore = 0;
      let conversionFormula = "FCO Operacional Real / EBITDA";
      let conversionLineage = `FCO Operacional Real: ${fcoOperacionalReal.toFixed(2)}, EBITDA: ${ebitda.toFixed(2)}`;
      let conversionAdjustments = "Reclassificação de partes relacionadas excluída do FCO Contábil Oficial.";
      let conversionRationale = "Mede a qualidade da conversão do lucro operacional (EBITDA) em caixa real. Valores baixos indicam que o lucro contábil não possui suporte financeiro.";

      if (cashConversionDisplay.status !== 'NORMAL') {
        conversionVal = 0;
        conversionScore = fcoOperacionalReal < 0 ? 0 : 20;
        conversionFormula = "Métrica não aplicável (EBITDA próximo de zero)";
        conversionLineage = `EBITDA: ${ebitda.toFixed(2)}, Receita Líquida: ${receitaLiquida.toFixed(2)}, Status: ${cashConversionDisplay.label}`;
      } else {
        if (ebitda <= 0) {
          if (fcoOperacionalReal > 0) {
            conversionVal = 1.0;
            conversionScore = 20; // Capped at 20/25
          } else {
            conversionVal = 0;
            conversionScore = 0;
          }
        } else {
          conversionVal = fcoOperacionalReal / ebitda;
          if (conversionVal > 1.0) {
            conversionScore = 25;
          } else if (conversionVal >= 0.7) {
            conversionScore = 20;
          } else if (conversionVal >= 0.4) {
            conversionScore = 10;
          } else if (conversionVal >= 0.0) {
            conversionScore = 5;
          } else {
            conversionScore = 0;
          }
        }
      }

      // 2. Shareholder Dependency (20%)
      let dependencyVal = 0;
      let dependencyScore = 0;
      let dependencyFormula = "|Fluxo Partes Relacionadas| / |FCO Reconstruído|";
      let dependencyLineage = `Fluxo Partes Relacionadas: ${Math.abs(fluxoPartesRelacionadas).toFixed(2)}, FCO Reconstruído: ${Math.abs(fcoContabilReconciled).toFixed(2)}`;
      let dependencyAdjustments = "Reconciliação e inclusão de fluxo mútuo de sócios estimado do BP.";
      let dependencyRationale = "Mede a dependência de fluxo com partes relacionadas para a sustentabilidade. Valores altos indicam que a operação é financiada artificialmente pelos sócios.";

      if (fcoContabilReconciled === 0) {
        if (fluxoPartesRelacionadas !== 0) {
          dependencyVal = 1.0;
          dependencyScore = 0;
        } else {
          dependencyVal = 0;
          dependencyScore = 20;
        }
      } else {
        dependencyVal = Math.abs(fluxoPartesRelacionadas) / Math.abs(fcoContabilReconciled);
        if (dependencyVal < 0.1) {
          dependencyScore = 20;
        } else if (dependencyVal < 0.25) {
          dependencyScore = 15;
        } else if (dependencyVal <= 0.5) {
          dependencyScore = 8;
        } else {
          dependencyScore = 0;
        }
      }

      // 3. Real Liquidity Integrity (20%)
      let liquidityVal = liquidezOperacionalReal;
      let liquidityScore = 0;
      let liquidityFormula = "(Ativo Circulante - Estoques - Créditos Sócios Circulantes) / Passivo Circulante";
      let liquidityLineage = `Ativo Circulante: ${ativoCirculante.toFixed(2)}, Estoques: ${estoques.toFixed(2)}, Créditos Sócios Circulantes: ${creditosSociosCirculantes.toFixed(2)}, Passivo Circulante: ${passivoCirculante.toFixed(2)}`;
      let liquidityAdjustments = "Exclusão de estoques (baixa liquidez) e créditos a receber de sócios de curto prazo.";
      let liquidityRationale = "Mede a capacidade de cumprir obrigações de curto prazo sem depender de ativos de conversão lenta ou mútuos fictícios.";

      if (liquidityVal > 1.5) {
        liquidityScore = 20;
      } else if (liquidityVal >= 1.0) {
        liquidityScore = 15;
      } else if (liquidityVal >= 0.7) {
        liquidityScore = 8;
      } else {
        liquidityScore = 0;
      }

      // 4. Treasury Stress (15%)
      let stressVal = runwayFid;
      let stressScore = 0;
      let stressFormula = "Caixa Disponível / Queima Mensal Real (FCO Real + FCI Real)";
      let stressLineage = `Caixa Disponível: ${availableCash.toFixed(2)}, Queima Operacional Real: ${operationalBurnFid.toFixed(2)}`;
      let stressAdjustments = "Uso do caixa físico do BP e FCO operacional real (líquido de aportes).";
      let stressRationale = "Avalia o horizonte de sobrevivência do caixa operacional. Runways curtos geram alto estresse de tesouraria.";

      if (stressVal >= 18.0) {
        stressScore = 15;
      } else if (stressVal >= 12.0) {
        stressScore = 12;
      } else if (stressVal >= 6.0) {
        stressScore = 6;
      } else {
        stressScore = 0;
      }

      // 5. Working Capital Quality (10%)
      let wcScore = 10;
      let wcFormula = "10 - deduções (dependência de estoques, fornecedores ou queima operacional)";
      const isEstoqueHeavy = ativoCirculante > 0 && (estoques / ativoCirculante) > 0.3;
      const isSupplierHeavy = passivoCirculante > 0 && (fornecedoresAtual / passivoCirculante) > 0.4;
      const isFCOBurn = fcoOperacionalReal < 0;

      let wcLineage = `Estoques/AC: ${ativoCirculante > 0 ? ((estoques/ativoCirculante)*100).toFixed(1) : 0}%, Fornecedores/PC: ${passivoCirculante > 0 ? ((fornecedoresAtual/passivoCirculante)*100).toFixed(1) : 0}%, FCO Burn: ${isFCOBurn}`;
      let wcAdjustments = "Análise estrutural de ativos e passivos operacionais circulantes.";
      let wcRationale = "Avalia se o capital de giro está sustentando ou consumindo a liquidez operacional.";

      if (isEstoqueHeavy) wcScore -= 3;
      if (isSupplierHeavy) wcScore -= 3;
      if (isFCOBurn) wcScore -= 4;
      if (wcScore < 0) wcScore = 0;

      // 6. Recurrence & Sustainability (10%)
      let sustainabilityScore = 10;
      let sustainabilityFormula = "10 - deduções (capitalização recorrente, liquidez artificial ou não-recorrentes)";
      const hasCap = fluxoCapitalizacao > 0;
      let capDeduction = 0;
      if (hasCap) {
        if (isEarlyStage) {
          capDeduction = 1;
        } else {
          if (capitalizationYearsCount > 0) {
            capDeduction = 5;
          } else {
            capDeduction = 3;
          }
        }
      }
      sustainabilityScore -= capDeduction;

      if (fluxoArtificial > 0) sustainabilityScore -= 3;

      let hasNonRecurringInflows = false;
      if (isOfficialDfcAvailable) {
        const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));
        hasNonRecurringInflows = yearDfcEntries.some(d => {
          return classifyEntry(d.conta || d.category || d.item || '') === 'NON_RECURRING' && (d.val || d.valor || d.value || 0) > 0;
        });
      }
      if (hasNonRecurringInflows) sustainabilityScore -= 4;
      if (sustainabilityScore < 0) sustainabilityScore = 0;

      let sustainabilityLineage = `Capitalização Atual: ${fluxoCapitalizacao.toFixed(2)}, Anos Anteriores com Aporte: ${capitalizationYearsCount}, Fluxo Artificial: ${fluxoArtificial.toFixed(2)}, Influxos Não-Recorrentes: ${hasNonRecurringInflows}`;
      let sustainabilityAdjustments = "Dedução de suportes de capital não operacionais e liquidez artificial.";
      let sustainabilityRationale = "Avalia se a geração de caixa decorre de operações recorrentes ou de eventos pontuais de financiamento ou desinvestimento.";

      const cashQualityScore = conversionScore + dependencyScore + liquidityScore + stressScore + wcScore + sustainabilityScore;

      let cqsLevel = 'Transitional Treasury';
      if (cashQualityScore >= 85) cqsLevel = 'Institutional Grade Cash';
      else if (cashQualityScore >= 70) cqsLevel = 'Healthy Operational Cash';
      else if (cashQualityScore >= 50) cqsLevel = 'Transitional Treasury';
      else if (cashQualityScore >= 30) cqsLevel = 'Fragile Treasury Structure';
      else cqsLevel = 'Critical Cash Integrity Risk';

      const runtimeCtx = context.input.financialRuntimeContext || context.input.rawFinancialData?.financialRuntimeContext;
      const profile = runtimeCtx?.lifecycleProfile;
      const isEarly = profile?.lifecycleStage === 'INITIAL_CAPITALIZATION' || profile?.lifecycleStage === 'EARLY_GROWTH';

      const lifecycleStage = scope?.lifecycleProfile?.lifecycleStage || scope?.lifecycleStage || 'ESTABLISHED_ANALYSIS';
      
      let cqsSemanticLabel = cqsLevel;
      if (isEarly && profile?.cashStatus?.semanticLabel) {
        cqsSemanticLabel = profile.cashStatus.semanticLabel;
      } else if (lifecycleStage === 'INITIAL_CAPITALIZATION' && cqsLevel === 'Critical Cash Integrity Risk') {
        cqsSemanticLabel = 'Estrutura de Caixa Dependente de Capitalização Inicial';
      }

      // Required Alerts
      const cqsAlerts: string[] = [];
      if (Math.abs(fluxoPartesRelacionadas) > 0.25 * Math.abs(fcoContabilReconciled)) {
        cqsAlerts.push("A continuidade operacional demonstra dependência elevada de liquidez suportada pelos sócios.");
      }
      const currentRatio = passivoCirculante > 0 ? (ativoCirculante / passivoCirculante) : 0;
      if (currentRatio > 1.0 && liquidezOperacionalReal < 0.7) {
        cqsAlerts.push("A estrutura de liquidez declarada depende materialmente de ativos de baixa conversão.");
      }
      if (netIncome !== null && netIncome > 0 && fcoOperacionalReal < 0) {
        cqsAlerts.push("A lucratividade contábil não está se convertendo em geração operacional de caixa.");
      }
      if (runwayFid < 6) {
        if (isEarly || lifecycleStage === 'INITIAL_CAPITALIZATION') {
          cqsAlerts.push("Runway reduzido para o estágio atual de estruturação, exigindo acompanhamento próximo da capitalização e do consumo operacional de caixa.");
        } else {
          cqsAlerts.push("O horizonte de sobrevivência da tesouraria está criticamente comprimido.");
        }
      }

      // ── EARNINGS QUALITY ENGINE (EQE) CALCULATIONS ─────────────────────────
      // receitaLiquida já foi declarada upstream
      const custosVar = getHistoricalSum(filterYear, ['dre', 'resultado'], ['custo', 'cmv', 'cpv', 'csv', 'csp']);
      let lucroBruto = getHistoricalValue(filterYear, ['dre', 'resultado'], ['lucro bruto', 'resultado bruto', 'margem bruta valor']);
      if (lucroBruto === 0) {
        lucroBruto = receitaLiquida - Math.abs(custosVar);
      }
      const sga = getHistoricalSum(filterYear, ['dre', 'resultado'], ['despesas operacionais', 'despesa operacional', 'despesas administrativas', 'despesas com vendas', 'despesas comerciais', 'admin', 'vendas', 'sg&a', 'sga']);
      const receitasNaoRecorrentes = getHistoricalSum(filterYear, ['dre', 'resultado'], ['não recorrente', 'nao recorrente', 'alienacao', 'alienação', 'outras receitas', 'ganho na venda', 'recuperacao de impostos', 'recuperação de impostos', 'creditos judiciais', 'créditos judiciais']);

      // 1. Cash-Backed Earnings (25%)
      let eqConversionVal = 0;
      let eqConversionScore = 0;
      if (netIncome === null) {
        eqConversionVal = 0;
        eqConversionScore = 0;
      } else if (netIncome > 0) {
        if (fcoOperacionalReal < 0) {
          eqConversionVal = fcoOperacionalReal / netIncome;
          eqConversionScore = 0;
        } else {
          eqConversionVal = fcoOperacionalReal / netIncome;
          if (eqConversionVal > 1.0) eqConversionScore = 25;
          else if (eqConversionVal >= 0.7) eqConversionScore = 20;
          else if (eqConversionVal >= 0.4) eqConversionScore = 10;
          else if (eqConversionVal >= 0.0) eqConversionScore = 5;
          else eqConversionScore = 0;
        }
      } else if (netIncome < 0) {
        eqConversionVal = fcoOperacionalReal / netIncome;
        if (fcoOperacionalReal > 0) {
          eqConversionScore = 20; // Maximum cap
        } else {
          eqConversionScore = 0;
        }
      } else {
        eqConversionScore = fcoOperacionalReal > 0 ? 20 : 0;
      }

      // 2. Recurrence Integrity (20%)
      const denomRecur = Math.max(Math.abs(ebitda), Math.abs(lucroLiquido), 0.05 * receitaLiquida);
      const eqRecurrenceRatio = denomRecur > 0 ? 1 - (Math.abs(receitasNaoRecorrentes) / denomRecur) : 1.0;
      let eqRecurrenceScore = 0;
      if (eqRecurrenceRatio >= 0.95) eqRecurrenceScore = 20;
      else if (eqRecurrenceRatio >= 0.8) eqRecurrenceScore = 15;
      else if (eqRecurrenceRatio >= 0.6) eqRecurrenceScore = 10;
      else if (eqRecurrenceRatio >= 0.4) eqRecurrenceScore = 5;
      else eqRecurrenceScore = 0;

      // 3. Margin Sustainability (20%)
      const grossMargin = receitaLiquida > 0 ? lucroBruto / receitaLiquida : 0;
      const ebitdaMargin = receitaLiquida > 0 ? ebitda / receitaLiquida : 0;
      const sgaIntensity = receitaLiquida > 0 ? Math.abs(sga) / receitaLiquida : 0;

      // EBITDA margin volatility over past years (last 3 cycles)
      const marginList: number[] = [];
      [filterYear, filterYear - 1, filterYear - 2].forEach(y => {
        const yEbitdaRow = getHistoricalValue(y, ['dre', 'resultado'], ['ebitda', 'lajida', 'lajirda']);
        const yLL = getHistoricalValue(y, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);
        const yDep = Math.abs(getHistoricalSum(y, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));
        const yDF = getHistoricalSum(y, ['dre', 'resultado'], ['despesa financeira', 'despesas financeiras', 'resultado financeiro', 'financeiras', 'juros']);
        const yImp = getHistoricalSum(y, ['dre', 'resultado'], ['irpj', 'csll', 'imposto de renda', 'contribuicao social', 'provisao ir']);
        const yEbitda = yEbitdaRow !== 0 ? yEbitdaRow : (yLL + yDep + Math.abs(yDF) + Math.abs(yImp));
        const yRev = getHistoricalValue(y, ['dre', 'resultado'], ['receita liquida', 'receita operacional liquida', 'receitas liquidas', 'faturamento liquido', 'rol']);
        if (yRev > 0) {
          marginList.push(yEbitda / yRev);
        }
      });
      let ebitdaVol = 0;
      if (marginList.length >= 2) {
        ebitdaVol = Math.max(...marginList) - Math.min(...marginList);
      }

      let eqMarginScore = 20;
      if (ebitdaMargin <= 0) {
        eqMarginScore -= 10;
      }
      if (grossMargin > 0.4 && ebitdaMargin <= 0.05) {
        eqMarginScore -= 8;
      }
      if (grossMargin < 0.2) {
        eqMarginScore -= 4;
      }
      if (sgaIntensity > 0.5) {
        eqMarginScore -= 4;
      }
      if (ebitdaVol > 0.15) {
        eqMarginScore -= 4;
      }
      if (eqMarginScore < 0) eqMarginScore = 0;

      // 4. Shareholder-Supported Earnings (15%)
      const supportRatio = (Math.abs(fluxoPartesRelacionadas) + Math.abs(fluxoCapitalizacao)) / Math.max(Math.abs(ebitda), 1);
      let eqSupportDeduction = 0;
      if (supportRatio < 0.05) eqSupportDeduction = 0;
      else if (supportRatio < 0.2) eqSupportDeduction = 3;
      else if (supportRatio <= 0.5) eqSupportDeduction = 7;
      else eqSupportDeduction = 13;

      // Early stage protection - 50% cap
      if (isEarlyStage) {
        eqSupportDeduction = Math.min(eqSupportDeduction, 6.5);
      }

      // Progressive recurrence penalty across cycles
      let historicalSupportYears = 0;
      [filterYear - 1, filterYear - 2].forEach(y => {
        let yRp = 0;
        let yCap = 0;
        const yDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));
        if (yDfcEntries.length > 0) {
          yDfcEntries.forEach((d: any) => {
            const nature = classifyEntry(d.conta || d.category || d.item || '');
            const val = d.val || d.valor || d.value || 0;
            if (nature === 'RELATED_PARTY') yRp += val;
            if (nature === 'CAPITAL_INJECTION') yCap += val;
          });
        } else {
          const bpEntriesForY = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco']));
          if (bpEntriesForY.length > 0) {
            const yCreditosSocios = getHistoricalSum(y, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios', 'creditos com socios', 'conta corrente socios']);
            const yCreditosSociosAnt = getHistoricalSum(y - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['mútuo', 'sócios', 'partes relacionadas', 'adiantamento a sócios', 'creditos com socios', 'conta corrente socios']);
            yRp = yCreditosSociosAnt - yCreditosSocios;
            
            const yCapAtual = getHistoricalSum(y, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
            const yCapAnt = getHistoricalSum(y - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
            yCap = yCapAtual - yCapAnt;
          }
        }
        if (Math.abs(yRp) > 0 || Math.abs(yCap) > 0) {
          historicalSupportYears++;
        }
      });

      if (historicalSupportYears > 0 && supportRatio >= 0.05) {
        eqSupportDeduction += 2 * historicalSupportYears;
      }

      let eqSupportScore = 15;
      if (ebitda === 0) {
        eqSupportScore = (Math.abs(fluxoPartesRelacionadas) + Math.abs(fluxoCapitalizacao)) > 0 ? 0 : 15;
      } else {
        eqSupportScore = Math.max(0, 15 - eqSupportDeduction);
      }

      // 5. Accounting Aggressiveness (10%)
      const deprRatio = imobAtual > 0 ? depreciacaoDre / imobAtual : 0;
      const isAssetHeavy = ativoTotal > 0 ? (imobAtual / ativoTotal) > 0.3 : false;
      const varConciliacao = Math.abs(fcoContabilReconciled - (lucroLiquido + depreciacaoDre + varClientes + varEstoque + varFornecedores));
      
      let prevEbitdaMargin = 0;
      let prevFCO = 0;
      const prevYear = filterYear - 1;
      const prevRev = getHistoricalValue(prevYear, ['dre', 'resultado'], ['receita liquida', 'receita operacional liquida', 'receitas liquidas', 'faturamento liquido', 'rol']);
      if (prevRev > 0) {
        const prevEbitdaRow = getHistoricalValue(prevYear, ['dre', 'resultado'], ['ebitda', 'lajida', 'lajirda']);
        const prevLL = getHistoricalValue(prevYear, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);
        const prevDep = Math.abs(getHistoricalSum(prevYear, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));
        const prevDF = getHistoricalSum(prevYear, ['dre', 'resultado'], ['despesa financeira', 'despesas financeiras', 'resultado financeiro', 'financeiras', 'juros']);
        const prevImp = getHistoricalSum(prevYear, ['dre', 'resultado'], ['irpj', 'csll', 'imposto de renda', 'contribuicao social', 'provisao ir']);
        const prevEbitda = prevEbitdaRow !== 0 ? prevEbitdaRow : (prevLL + prevDep + Math.abs(prevDF) + Math.abs(prevImp));
        prevEbitdaMargin = prevEbitda / prevRev;
        
        const prevDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === prevYear && matchDocType(d, ['dfc']));
        if (prevDfcEntries.length > 0) {
          prevFCO = getDfcSectionSubtotal(prevDfcEntries, 'FCO');
          if (prevFCO === 0) prevFCO = getDfcSectionSum(prevDfcEntries, 'FCO');
        } else {
          const prevClientesAtual = getHistoricalSum(prevYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
          const prevClientesAnt = getHistoricalSum(prevYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
          const prevVarClientes = prevClientesAnt - prevClientesAtual;

          const prevEstoqueAtual = getHistoricalSum(prevYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
          const prevEstoqueAnt = getHistoricalSum(prevYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
          const prevVarEstoque = prevEstoqueAnt - prevEstoqueAtual;

          const prevFornecedoresAtual = getHistoricalSum(prevYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
          const prevFornecedoresAnt = getHistoricalSum(prevYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
          const prevVarFornecedores = prevFornecedoresAtual - prevFornecedoresAnt;
          prevFCO = prevLL + prevDep + prevVarClientes + prevVarEstoque + prevVarFornecedores;
        }
      }
      const hasMarginSpikeWithoutCash = (ebitdaMargin - prevEbitdaMargin > 0.05) && (fcoOperacionalReal < prevFCO * 0.9);

      let eqAccountingScore = 10;
      if (isAssetHeavy && deprRatio < 0.02) {
        eqAccountingScore -= 3;
      }
      if (receitaLiquida > 0 && varConciliacao > 0.05 * receitaLiquida) {
        eqAccountingScore -= 3;
      }
      if (hasMarginSpikeWithoutCash) {
        eqAccountingScore -= 4;
      }
      if (lucroLiquido > 0 && fcoOperacionalReal < 0) {
        eqAccountingScore -= 3;
      }
      if (eqAccountingScore < 0) eqAccountingScore = 0;

      // 6. Longitudinal Stability (10%)
      let eqStabilityScore = 10;
      let niVol = 0;
      let lossYearsCount = 0;
      
      const prevLL = getHistoricalValue(filterYear - 1, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);

      if (historicalCyclesCount < 3) {
        eqStabilityScore = 8; // Early-stage protection
      } else {
        const niList: number[] = [];
        [filterYear, filterYear - 1, filterYear - 2].forEach(y => {
          const hasDREForYear = allHistoryData.some((d: any) => Number(d.year) === y && matchDocType(d, ['dre', 'resultado']));
          if (hasDREForYear) {
            const yLL = getHistoricalValue(y, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);
            niList.push(yLL);
            if (yLL < 0) {
              lossYearsCount++;
            }
          }
        });
        if (niList.length >= 2) {
          const maxNI = Math.max(...niList);
          const minNI = Math.min(...niList);
          const avgNI = niList.reduce((a, b) => a + b, 0) / niList.length;
          niVol = Math.abs(maxNI - minNI) / Math.max(Math.abs(avgNI), 1);
        }
        
        eqStabilityScore -= 3 * lossYearsCount;
        if (niVol > 0.5) {
          eqStabilityScore -= 3;
        }
        if (prevLL < 0 && lucroLiquido > 0) {
          eqStabilityScore += 2; // Turnaround validation
        }
        if (eqStabilityScore < 0) eqStabilityScore = 0;
        if (eqStabilityScore > 10) eqStabilityScore = 10;
      }

      // EQS Score Sum
      let eqsScore = eqConversionScore + eqRecurrenceScore + eqMarginScore + eqSupportScore + eqAccountingScore + eqStabilityScore;
      
      let eqsLevel = 'Transitional Profitability';
      
      // Triple-negative cap
      if (lucroLiquido < 0 && ebitda < 0 && fcoOperacionalReal < 0) {
        if (eqsScore > 45) {
          eqsScore = 45;
        }
      }

      if (eqsScore >= 85) eqsLevel = 'Institutional Grade Earnings';
      else if (eqsScore >= 70) eqsLevel = 'Healthy Operational Earnings';
      else if (eqsScore >= 50) eqsLevel = 'Transitional Profitability';
      else if (eqsScore >= 30) eqsLevel = 'Fragile Earnings Structure';
      else eqsLevel = 'Critical Earnings Integrity Risk';

      if (lucroLiquido < 0 && ebitda < 0 && fcoOperacionalReal < 0 && lifecycleStage === 'INITIAL_CAPITALIZATION') {
        eqsLevel = 'Risco de Resultado em Fase Inicial de Capitalização';
      }

      let eqsConfidence = 'HIGH_CONFIDENCE';
      if (historicalCyclesCount === 1) {
        eqsConfidence = 'LOW_CONFIDENCE';
      } else if (historicalCyclesCount === 2) {
        eqsConfidence = 'MODERATE_CONFIDENCE';
      } else if (historicalCyclesCount >= 3) {
        eqsConfidence = 'HIGH_CONFIDENCE';
      }

      if (netIncome === null) {
        eqsConfidence = 'LOW_CONFIDENCE';
      }

      // Required EQS Alerts
      const eqsAlerts: string[] = [];
      if (netIncome === null) {
        eqsAlerts.push("NET_INCOME_SOURCE_MISSING");
        eqsAlerts.push("Divergência fiduciária: Demonstração de Resultado do Exercício (DRE) não apresenta a linha de Lucro Líquido válida.");
      } else {
        if (netIncome > 0 && fcoOperacionalReal < 0) {
          eqsAlerts.push("PROFIT_WITHOUT_CASH");
          eqsAlerts.push("A lucratividade contábil não é suportada pela geração de caixa operacional.");
        } else if (netIncome < 0 && fcoOperacionalReal < 0) {
          eqsAlerts.push("LOSS_WITH_CASH_CONSUMPTION");
          eqsAlerts.push("Prejuízo contábil acompanhado de consumo operacional de caixa.");
        }
      }
      if (receitasNaoRecorrentes > 0.1 * ebitda) {
        eqsAlerts.push("Eventos não recorrentes relevantes impactam materialmente a interpretação dos lucros.");
      }
      const supportFlow = Math.abs(fluxoPartesRelacionadas) + Math.abs(fluxoCapitalizacao);
      if (supportFlow > 0.25 * Math.abs(fcoContabilReconciled)) {
        eqsAlerts.push("A continuidade operacional demonstra dependência parcial de liquidez suportada pelos sócios.");
      }
      if (grossMargin > 0.4 && ebitdaMargin < 0.1) {
        eqsAlerts.push("A estrutura operacional está absorvendo a lucratividade bruta de forma ineficiente.");
      }
      if ((isAssetHeavy && deprRatio < 0.02) || (receitaLiquida > 0 && varConciliacao > 0.05 * receitaLiquida)) {
        eqsAlerts.push("A estrutura contábil apresenta indicadores de elevada sensibilidade de accrual ou capitalização.");
      }

      // Regra de Narrativa - Substituições e Filtros
      const cleanNarrativeText = (text: string) => {
        if (!text) return '';
        let cleaned = text;
        
        // Safeguards against forensic speculation
        cleaned = cleaned.replace(/fraude/gi, 'postura contábil agressiva');
        cleaned = cleaned.replace(/manipulacao/gi, 'sensibilidade de accrual');
        cleaned = cleaned.replace(/manipulação/gi, 'sensibilidade de accrual');
        cleaned = cleaned.replace(/lucros falsos/gi, 'lucro com baixa conversão');
        cleaned = cleaned.replace(/lucro falso/gi, 'lucro com baixa conversão');
        cleaned = cleaned.replace(/fraud/gi, 'aggressive accounting posture');
        cleaned = cleaned.replace(/manipulation/gi, 'accrual sensitivity');
        cleaned = cleaned.replace(/fake profits/gi, 'low conversion earnings');
        cleaned = cleaned.replace(/fake profit/gi, 'low conversion earnings');

        cleaned = cleaned.replace(/colapso irreversivel/gi, 'estresse de liquidez relevante');
        cleaned = cleaned.replace(/colapso irreversível/gi, 'estresse de liquidez relevante');
        cleaned = cleaned.replace(/irreversible collapse/gi, 'estresse de liquidez relevante');

        cleaned = cleaned.replace(/insolvencia definitiva/gi, 'elevado risco de continuidade');
        cleaned = cleaned.replace(/insolvência definitiva/gi, 'elevado risco de continuidade');
        cleaned = cleaned.replace(/terminal insolvency/gi, 'elevado risco de continuidade');

        cleaned = cleaned.replace(/liquidez confortavel/gi, 'liquidez momentaneamente estável');
        cleaned = cleaned.replace(/liquidez confortável/gi, 'liquidez momentaneamente estável');
        cleaned = cleaned.replace(/comfortable liquidity/gi, 'liquidez momentaneamente estável');
        
        if (isEarlyStage) {
          cleaned = cleaned.replace(/diagnóstico de colapso/gi, 'curva de escala em maturação');
          cleaned = cleaned.replace(/diagnostico de colapso/gi, 'curva de escala em maturação');
          cleaned = cleaned.replace(/colapso de/gi, 'fase de scale-up de');
          cleaned = cleaned.replace(/colapso/gi, 'maturação de escala');
          cleaned = cleaned.replace(/insolvência estrutural/gi, 'necessidade de aporte complementar para formação de escala');
          cleaned = cleaned.replace(/insolvencia estrutural/gi, 'necessidade de aporte complementar para formação de escala');
          cleaned = cleaned.replace(/structural insolvency/gi, 'necessidade de aporte complementar para formação de escala');
          cleaned = cleaned.replace(/deterioração irreversível/gi, 'intensidade de capital típica do estágio operacional');
          cleaned = cleaned.replace(/deterioracao irreversivel/gi, 'intensidade de capital típica do estágio operacional');
          cleaned = cleaned.replace(/permanent operational failure/gi, 'maturação operacional de early-stage');
        }

        // Apply replacement narratives
        if (ativoCirculante > 0 && estoques / ativoCirculante > 0.3) {
          cleaned = cleaned.replace(/.*liquidez.*depende.*estoque.*/gi, 'A estrutura de liquidez apresenta dependência elevada da conversão de estoques.');
        }
        if (Math.abs(fluxoPartesRelacionadas) > 0) {
          cleaned = cleaned.replace(/.*depende.*socios.*/gi, 'A estrutura de tesouraria demonstrou dependência parcial de liquidez suportada pelos sócios.');
        }
        if (fcoOperacionalReal < 0) {
          cleaned = cleaned.replace(/.*caixa operacional e negativo.*/gi, 'A geração de caixa operacional permanece insuficiente para sustentar de forma independente as obrigações da tesouraria.');
        }
        
        return cleaned;
      };

      let fiduciaryDiagnostic = '';
      if (ativoCirculante > 0 && estoques / ativoCirculante > 0.3) {
        fiduciaryDiagnostic += 'A estrutura de liquidez corrente apresenta dependência relevante da conversão de estoques. ';
      }
      if (fcoContabilReconciled < 0 && (fluxoPartesRelacionadas > 0 || fluxoCapitalizacao > 0)) {
        fiduciaryDiagnostic += 'A operação demonstrou dependência parcial de suporte societário para sustentabilidade de caixa. ';
      }
      if (reconstructedFiduciaryEntries.length > 0) {
        fiduciaryDiagnostic += 'Foram identificadas movimentações relevantes com partes relacionadas, reconstruídas a partir da conciliação entre BP e DFC, impactando materialmente a interpretação fiduciária da geração operacional de caixa. ';
      } else if (partesRelacionadasAtivoTotal > 0 || Math.abs(fluxoPartesRelacionadas) > 0) {
        fiduciaryDiagnostic += 'Foram identificadas movimentações relevantes com partes relacionadas que impactam materialmente a interpretação fiduciária da geração operacional de caixa. ';
      }
      if (!fiduciaryDiagnostic) {
        fiduciaryDiagnostic = isOfficialDfcAvailable 
          ? 'Diagnóstico fiduciário estabelecido através de Fluxo de Caixa oficial.'
          : 'Geração operacional de caixa fiduciária estável sem dependências societárias materiais.';
      }

      // Linhas detalhadas para a tabela contábil oficial
      let tableRows: any[] = [];
      if (isOfficialDfcAvailable) {
          tableRows = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));
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
            { item: 'Aumento / Redução de Caixa (Variação Líquida)', val: variacaoCaixa, isTotal: true }
          ];
      }

      // Reconstrução do tableRows para DFC Fiduciária Ajustada (7 required sections)
      let fiduciaryTableRows: any[] = [];
      if (isOfficialDfcAvailable) {
        const yearDfcEntries = allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']));
        
        let currentGroup: 'FCO' | 'FCI' | 'FCF' = 'FCO';
        const fcoDetails: any[] = [];
        const fciDetails: any[] = [];
        const fcfDetails: any[] = [];

        yearDfcEntries.forEach((d: any) => {
          const name = normalizeString(d.conta || d.category || d.item || '');

          const isSubtotal = (
            (name.includes('liquido') && (name.includes('operacio') || name.includes('operaco') || name.includes('investimento') || name.includes('financiamento'))) ||
            name.includes('fluxo de caixa das') || name === 'fco' || name === 'fci' || name === 'fcf' || name.includes('fluxo liquido de')
          );
          const isSummary = name.includes('inicial') || name.includes('final') || name.includes('abertura') || name.includes('fechamento') || name.includes('estimada de caixa') || name.includes('teorico') || name.includes('saldo');

          if (!isSubtotal && !isSummary) {
            const entry = {
              item: d.conta || d.category || d.item || '',
              val: d.val || d.valor || d.value || 0,
              nature: classifyEntry(d.conta || d.category || d.item || ''),
              isReconstructed: false
            };
            const group = getEntryDfcGroup(d.conta || d.category || d.item || '');
            if (group === 'FCO') {
              fcoDetails.push(entry);
            } else if (group === 'FCI') {
              fciDetails.push(entry);
            } else if (group === 'FCF') {
              fcfDetails.push(entry);
            }
          }
        });

        // Add reconstructed entries pure to the fiduciary detail sections
        reconstructedFiduciaryEntries.forEach(reconstructedEntry => {
          if (reconstructedEntry.nature === 'RELATED_PARTY') {
            fcoDetails.push(reconstructedEntry);
          }
        });

        const rpList = [...fcoDetails, ...fciDetails, ...fcfDetails].filter(e => e.nature === 'RELATED_PARTY');
        const capitalList = [...fcoDetails, ...fciDetails, ...fcfDetails].filter(e => e.nature === 'CAPITAL_INJECTION');
        const artificialList = [...fcoDetails, ...fciDetails, ...fcfDetails].filter(e => e.nature === 'ARTIFICIAL_LIQUIDITY');

        const otherFciEntries = fciDetails.filter(e => e.nature !== 'RELATED_PARTY' && e.nature !== 'CAPITAL_INJECTION' && e.nature !== 'ARTIFICIAL_LIQUIDITY');
        const otherFcfEntries = fcfDetails.filter(e => e.nature !== 'RELATED_PARTY' && e.nature !== 'CAPITAL_INJECTION' && e.nature !== 'ARTIFICIAL_LIQUIDITY');

        fiduciaryTableRows = [
          // 1. FCO Contábil Oficial
          { item: '1. FCO Contábil Oficial', val: fcoContabilReconciled, isTotal: true },
          ...fcoDetails.map(e => ({ item: `  ${e.item}`, val: e.val, isSubTotal: false, isReconstructed: e.isReconstructed, metadata: e.metadata })),
          
          // 2. FCO Operacional Real
          { item: '2. FCO Operacional Real', val: fcoOperacionalReal, isTotal: true },
          ...fcoDetails.filter(e => e.nature !== 'RELATED_PARTY').map(e => ({ item: `  ${e.item}`, val: e.val, isSubTotal: false })),
          
          // 3. Fluxo com Partes Relacionadas
          { item: '3. Fluxo com Partes Relacionadas', val: fluxoPartesRelacionadas, isTotal: true },
          ...rpList.map(e => ({ item: `  * ${e.item} (Relacionada)`, val: e.val, isSubTotal: false, isReconstructed: e.isReconstructed, metadata: e.metadata })),
          
          // 4. Fluxo de Capitalização Societária
          { item: '4. Fluxo de Capitalização Societária', val: fluxoCapitalizacao, isTotal: true },
          ...capitalList.map(e => ({ item: `  * ${e.item} (Capitalização)`, val: e.val, isSubTotal: false, isReconstructed: e.isReconstructed, metadata: e.metadata })),
          
          // 5. Fluxo Artificial de Liquidez
          { item: '5. Fluxo Artificial de Liquidez', val: fluxoArtificial, isTotal: true },
          ...artificialList.map(e => ({ item: `  * ${e.item} (Artificial)`, val: e.val, isSubTotal: false, isReconstructed: e.isReconstructed, metadata: e.metadata })),
          
          // 6. Caixa Operacional Ajustado
          { item: '6. Caixa Operacional Ajustado', val: caixaOperacionalAjustado, isTotal: true },
          
          // Fluxo de Investimento Fiduciário
          { item: 'Fluxo de Investimento Fiduciário', val: fciReal, isTotal: true },
          ...otherFciEntries.map(e => ({ item: `  ${e.item}`, val: e.val, isSubTotal: false })),
          
          // Fluxo de Financiamento Fiduciário (Outros)
          { item: 'Fluxo de Financiamento Fiduciário (Outros)', val: fcfReal - fluxoCapitalizacao, isTotal: true },
          ...otherFcfEntries.map(e => ({ item: `  ${e.item}`, val: e.val, isSubTotal: false })),
          
          // 7. Variação Líquida Conciliada
          { item: '7. Variação Líquida Conciliada', val: variacaoLiquidaConciliada, isTotal: true }
        ];
      } else {
        fiduciaryTableRows = [
          { item: '1. FCO Contábil Oficial', val: fcoContabilReconciled, isTotal: true },
          { item: '  Lucro Líquido', val: lucroLiquido, isSubTotal: false },
          { item: '  Depreciação e Amortização', val: depreciacaoDre, isSubTotal: false },
          { item: '  Variação de Clientes', val: varClientes, isSubTotal: false },
          { item: '  Variação de Estoques', val: varEstoque, isSubTotal: false },
          { item: '  Variação de Fornecedores', val: varFornecedores, isSubTotal: false },
          ...reconstructedFiduciaryEntries.map(e => ({ item: `  ${e.item}`, val: e.val, isSubTotal: false, isReconstructed: e.isReconstructed, metadata: e.metadata })),
          
          { item: '2. FCO Operacional Real', val: fcoOperacionalReal, isTotal: true },
          { item: '  Lucro Líquido', val: lucroLiquido, isSubTotal: false },
          { item: '  Depreciação e Amortização', val: depreciacaoDre, isSubTotal: false },
          { item: '  Variação de Clientes', val: varClientes, isSubTotal: false },
          { item: '  Variação de Estoques', val: varEstoque, isSubTotal: false },
          { item: '  Variação de Fornecedores', val: varFornecedores, isSubTotal: false },
          
          { item: '3. Fluxo com Partes Relacionadas', val: fluxoPartesRelacionadas, isTotal: true },
          { item: '  Variação de Mútuos e Adiantamentos Sócios', val: fluxoPartesRelacionadas, isSubTotal: false },
          
          { item: '4. Fluxo de Capitalização Societária', val: fluxoCapitalizacao, isTotal: true },
          { item: '  Aumento de Capital Social', val: varCapital, isSubTotal: false },
          
          { item: '5. Fluxo Artificial de Liquidez', val: 0, isTotal: true },
          
          { item: '6. Caixa Operacional Ajustado', val: caixaOperacionalAjustado, isTotal: true },
          
          { item: 'Fluxo de Investimento Fiduciário', val: fciReal, isTotal: true },
          { item: '  Aquisição/Alienação de Imob. e Intangível', val: fciReal, isSubTotal: false },
          
          { item: 'Fluxo de Financiamento Fiduciário (Outros)', val: fcfReal - fluxoCapitalizacao, isTotal: true },
          { item: '  Captação/Amortização de Empréstimos', val: varDividas, isSubTotal: false },
          { item: '  Distribuição de Dividendos e Lucros', val: -dividendos, isSubTotal: false },
          
          { item: '7. Variação Líquida Conciliada', val: variacaoLiquidaConciliada, isTotal: true }
        ];
      }

      // Gráfico histórico fiduciário de 5 anos
      const chartData = [5, 4, 3, 2, 1, 0].map(offset => {
          const y = filterYear - offset;
          const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));
        let o = 0; let i = 0; let f = 0;
        if (yearEntries.length > 0) {
          o = getDfcSectionSubtotal(yearEntries, 'FCO');
          if (o === 0) o = getDfcSectionSum(yearEntries, 'FCO');
          i = getDfcSectionSubtotal(yearEntries, 'FCI');
          if (i === 0) i = getDfcSectionSum(yearEntries, 'FCI');
          f = getDfcSectionSubtotal(yearEntries, 'FCF');
          if (f === 0) f = getDfcSectionSum(yearEntries, 'FCF');
        }
        
        // Ajusta operacional real
        let oReal = o;
        if (yearEntries.length > 0) {
          const yearRp = yearEntries.filter((d: any) => isRelatedParty(d.conta || d.category || d.item || ''));
          let rpFCO = yearRp.reduce((acc, curr) => acc + (curr.val || curr.valor || curr.value || 0), 0);
          if (y === filterYear && !hasRpInDfc && creditosSociosTotais !== 0) {
            o += (-creditosSociosTotais);
            rpFCO += (-creditosSociosTotais);
          }
          oReal = o - rpFCO;
        }

        const yLL = getHistoricalValue(y, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);
        const yDep = Math.abs(getHistoricalSum(y, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));
        const yDF = getHistoricalSum(y, ['dre', 'resultado'], ['despesa financeira', 'despesas financeiras', 'resultado financeiro', 'financeiras', 'juros']);
        const yImp = getHistoricalSum(y, ['dre', 'resultado'], ['irpj', 'csll', 'imposto de renda', 'contribuicao social', 'provisao ir']);
        const yEbitdaRow = getHistoricalValue(y, ['dre', 'resultado'], ['ebitda', 'lajida', 'lajirda']);
        const yEbitda = yEbitdaRow !== 0 ? yEbitdaRow : (yLL + yDep + Math.abs(yDF) + Math.abs(yImp));

        return {
          year: y.toString(),
          operacional: o,
          operacionalReal: oReal,
          investimento: i,
          financiamento: f,
          lucroLiquido: yLL,
          ebitda: yEbitda
        };
      }).filter(d => d.operacional !== 0 || d.investimento !== 0 || d.financiamento !== 0 || d.lucroLiquido !== 0 || d.ebitda !== 0);

      const reinvestmentCapacity = fco > 0 ? ((Math.abs(fci) / fco) * 100).toFixed(1) : '0';

      const resolvedThirdPartyFunding = varDividas > 0 ? varDividas : 0;
      const resolvedEquityFunding = varCapital > 0 ? varCapital : 0;
      const patrimonioLiquido = bpSummary.patrimonioLiquido || 0;
      const dfcDataEntries = isOfficialDfcAvailable 
        ? allHistoryData.filter((d: any) => Number(d.year) === filterYear && matchDocType(d, ['dfc']))
        : [];

      let consecutiveNegativeFCOCycles = 0;
      for (let offset = 0; offset < 5; offset++) {
        const y = filterYear - offset;
        const yearEntries = allHistoryData.filter((d: any) => Number(d.year) === y && matchDocType(d, ['dfc']));
        let o = 0;
        if (yearEntries.length > 0) {
          o = getDfcSectionSubtotal(yearEntries, 'FCO');
          if (o === 0) o = getDfcSectionSum(yearEntries, 'FCO');
        } else {
          const yLL = getHistoricalValue(y, ['dre', 'resultado'], ['lucro liquido', 'lucro do exercicio', 'resultado do exercicio', 'resultado liquido', 'lucro/prejuizo do exercicio']);
          const yDep = Math.abs(getHistoricalSum(y, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));
          const yClientesAtual = getHistoricalSum(y, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
          const yClientesAnt = getHistoricalSum(y - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
          const yEstoqueAtual = getHistoricalSum(y, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
          const yEstoqueAnt = getHistoricalSum(y - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
          const yFornecedoresAtual = getHistoricalSum(y, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
          const yFornecedoresAnt = getHistoricalSum(y - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
          o = yLL + yDep + (yClientesAnt - yClientesAtual) + (yEstoqueAnt - yEstoqueAtual) + (yFornecedoresAtual - yFornecedoresAnt);
        }
        if (o < 0) {
          consecutiveNegativeFCOCycles++;
        } else {
          break;
        }
      }

      const receitaAnt = getHistoricalValue(filterYear - 1, ['dre', 'resultado'], ['receita liquida', 'receita operacional liquida', 'receitas liquidas', 'faturamento liquido', 'rol']);
      const inventoryGrowth = estoqueAnt > 0 ? (estoqueAtual - estoqueAnt) / estoqueAnt : 0;
      const revenueGrowth = receitaAnt > 0 ? (receitaLiquida - receitaAnt) / receitaAnt : 0;
      const isInventoryGrowthExceedingRevenue = inventoryGrowth > revenueGrowth && estoqueAtual > estoqueAnt;

      const receivablesGrowth = clientesAnt > 0 ? (clientesAtual - clientesAnt) / clientesAnt : 0;
      const isReceivablesGrowthExceedingRevenue = receivablesGrowth > revenueGrowth && clientesAtual > clientesAnt;

      const cashSustainabilityReport = FiduciaryCashIntelligenceRuntime.evaluate(
        dfcDataEntries,
        lucroLiquido,
        ebitda,
        caixaInicialReal,
        caixaFinalReal,
        fco,
        fci,
        fcf,
        varClientes + varEstoque + varFornecedores,
        clientesAtual,
        estoqueAtual,
        caixaFinalReal,
        resolvedThirdPartyFunding,
        resolvedEquityFunding,
        historicalCyclesCount,
        12,
        fornecedoresAtual,
        passivoCirculante,
        creditosSociosTotais,
        patrimonioLiquido,
        undefined,
        undefined,
        receitaLiquida,
        varClientes,
        varEstoque,
        varFornecedores,
        Math.abs(sga),
        consecutiveNegativeFCOCycles,
        isInventoryGrowthExceedingRevenue,
        isReceivablesGrowthExceedingRevenue
      );

      const cashQualityObj = {
        score: cashQualityScore,
        level: cqsLevel,
        semanticLabel: (isEarly && profile?.cashStatus?.semanticLabel) ? profile.cashStatus.semanticLabel : cqsSemanticLabel,
        rawRiskLevel: (isEarly && profile?.cashStatus?.semanticLabel) ? 'Critical Cash Integrity Risk' : cqsLevel,
        alerts: cqsAlerts,
        dimensions: {
          conversion: {
            value: conversionVal,
            score: conversionScore,
            formula: conversionFormula,
            lineage: conversionLineage,
            adjustments: conversionAdjustments,
            rationale: conversionRationale
          },
          dependency: {
            value: dependencyVal,
            score: dependencyScore,
            formula: dependencyFormula,
            lineage: dependencyLineage,
            adjustments: dependencyAdjustments,
            rationale: dependencyRationale
          },
          liquidity: {
            value: liquidityVal,
            score: liquidityScore,
            formula: liquidityFormula,
            lineage: liquidityLineage,
            adjustments: liquidityAdjustments,
            rationale: liquidityRationale
          },
          stress: {
            value: stressVal,
            score: stressScore,
            formula: stressFormula,
            lineage: stressLineage,
            adjustments: stressAdjustments,
            rationale: stressRationale
          },
          workingCapital: {
            value: wcScore,
            score: wcScore,
            formula: wcFormula,
            lineage: wcLineage,
            adjustments: wcAdjustments,
            rationale: wcRationale
          },
          sustainability: {
            value: sustainabilityScore,
            score: sustainabilityScore,
            formula: sustainabilityFormula,
            lineage: sustainabilityLineage,
            adjustments: sustainabilityAdjustments,
            rationale: sustainabilityRationale
          }
        }
      };

      const metrics = {
          fco,
          fci,
          fcf,
          variacaoCaixa,
          reinvestmentCapacity,
          chartData,
          tableRows,
          isGenerated: !isOfficialDfcAvailable,
          lucroLiquido: netIncome,
          ebitda,
          receitaLiquida,
          
          cashConstraintDiagnosis: cashSustainabilityReport.cashConstraintDiagnosis,
          cashBurnAnalysis: cashSustainabilityReport.cashBurnAnalysis,
          shareholderDependencyAnalysis: cashSustainabilityReport.shareholderDependencyAnalysis,
          cashSustainabilityAnalysis: cashSustainabilityReport.cashSustainabilityAnalysis,
          cashConversionAnalysis: cashSustainabilityReport.cashConversionAnalysis,
          cashBoardDecisionFramework: cashSustainabilityReport.cashBoardDecisionFramework,
          cashExecutiveAdvisory: cashSustainabilityReport.cashExecutiveAdvisory,
          cashReinvestmentAnalysis: cashSustainabilityReport.cashReinvestmentAnalysis,
          
          // Métricas Fiduciárias acopladas no mesmo bloco
          fiduciary: {
            fcoOperacionalReal,
            fcoAjustado: fcoAjustado,
            fciReal,
            fcfReal,
            fluxoPartesRelacionadas,
            saidasParaPartesRelacionadas,
            intensidadePartesRelacionadas,
            partesRelacionadasAtivoTotal,
            drenagemSocietaria,
            liquidezOperacionalReal,
            runway: cashSustainabilityReport.runwayMonths ?? runwayFid,
            runwayAudit: runwayAudit,
            conversaoEbitdaCaixa: conversaoEbitdaCaixaFid,
            stressLiquidez: stressLiquidezStatus,
            sustentabilidadeTesouraria,
            governanceWarnings,
            tableRows: fiduciaryTableRows,
            isEarlyStage,
            fluxoCapitalizacao,
            fluxoArtificial,
            variacaoLiquidaConciliada,
            caixaInicialReal,
            caixaFinalReal,
            caixaInicialBP: caixaInicialReal,
            caixaFinalBP: caixaFinalReal,
            caixaInicialDFC,
            variacaoDFC,
            caixaFinalEstimadoDFC: caixaFinalEstimado,
            reconciliationGap,
            reconciliationMismatch: reconciliationGap > Math.max(1, ativoTotal * 0.0001),
            conversaoEbitdaCaixaStatus,
            cashConversionDisplay,
            netIncome,
            lifecycleProfile: profile,
            bpSourceStatus: (caixaFinalReal === 0) ? 'Inconsistente' : (bpEntriesPrevYear.length === 0 ? 'Limitada' : 'Consistente'),
            
            cashConstraintDiagnosis: cashSustainabilityReport.cashConstraintDiagnosis,
            cashBurnAnalysis: cashSustainabilityReport.cashBurnAnalysis,
            shareholderDependencyAnalysis: cashSustainabilityReport.shareholderDependencyAnalysis,
            cashSustainabilityAnalysis: cashSustainabilityReport.cashSustainabilityAnalysis,
            cashConversionAnalysis: cashSustainabilityReport.cashConversionAnalysis,
            cashBoardDecisionFramework: cashSustainabilityReport.cashBoardDecisionFramework,
            cashExecutiveAdvisory: cashSustainabilityReport.cashExecutiveAdvisory,
            cashReinvestmentAnalysis: cashSustainabilityReport.cashReinvestmentAnalysis,
            cashQuality: cashQualityObj,
            cqsExplainability: CashQualityExplainabilityEngine.explain(cashQualityObj),
            dfcExecutiveSnapshot: cashSustainabilityReport.dfcExecutiveSnapshot,
            dfcPriorities: cashSustainabilityReport.dfcPriorities,
            compressedAdvisory: cashSustainabilityReport.compressedAdvisory,
            consistencyAudit: cashSustainabilityReport.consistencyAudit,
            causalIntelligence: cashSustainabilityReport.causalIntelligence,
            scenarioIntelligence: cashSustainabilityReport.scenarioIntelligence,
            earlyWarningSystem: cashSustainabilityReport.earlyWarningSystem,
            treasurySustainability: cashSustainabilityReport.treasurySustainability,
            earningsQuality: {
              score: eqsScore,
              level: eqsLevel,
              semanticLabel: (isEarly && profile?.earningsStatus?.semanticLabel) ? profile.earningsStatus.semanticLabel : eqsLevel,
              rawRiskLevel: (isEarly && profile?.earningsStatus?.semanticLabel) ? 'Critical Earnings Integrity Risk' : eqsLevel,
              confidence: eqsConfidence,
              alerts: netIncome < 0 ? [...eqsAlerts, 'PREJUIZO_OPERACIONAL'] : eqsAlerts,
              netIncome: netIncome,
              netIncomeTrace: {
                source: 'DRE',
                sourceAccount: netIncomeSourceAccount,
                sourceValue: netIncomeSourceValue,
                consumedByEQE: netIncome,
                renderedValue: context.input.rawFinancialData?.renderingPayload?.netIncomeEQE !== undefined && context.input.rawFinancialData?.renderingPayload?.netIncomeEQE !== null
                  ? context.input.rawFinancialData.renderingPayload.netIncomeEQE
                  : null,
                status: netIncome === null 
                  ? 'MISSING_SOURCE' 
                  : (context.input.rawFinancialData?.renderingPayload?.netIncomeEQE === undefined || context.input.rawFinancialData?.renderingPayload?.netIncomeEQE === null
                      ? 'NOT_RENDERED'
                      : (context.input.rawFinancialData.renderingPayload.netIncomeEQE === netIncome ? 'CONSISTENT' : 'INCONSISTENT'))
              },
              dimensions: {
                cashBacked: {
                  value: netIncome === null ? null : eqConversionVal,
                  score: eqConversionScore,
                  formula: netIncome === null ? "Bloqueado (Lucro Líquido não disponível)" : "FCO Operacional Real / Lucro Líquido",
                  lineage: netIncome === null
                    ? "Bloqueado: Lucro Líquido DRE ausente"
                    : `FCO Operacional Real: ${fcoOperacionalReal.toFixed(2)}, Lucro Líquido: ${netIncome.toFixed(2)}`,
                  adjustments: "Expurgo de efeitos societários e conciliações de partes relacionadas.",
                  rationale: "Mede o alinhamento entre a competência contábil e a liquidez financeira real da operação."
                },
                recurrence: {
                  value: eqRecurrenceRatio,
                  score: eqRecurrenceScore,
                  formula: "1 - (Receitas Não Recorrentes / max(|EBITDA|, |Lucro Operacional|, 0.05 * Receita Líquida))",
                  lineage: `Receitas Não Recorrentes: ${receitasNaoRecorrentes.toFixed(2)}, EBITDA: ${ebitda.toFixed(2)}, Lucro Líquido: ${lucroLiquido.toFixed(2)}, Receita Líquida: ${receitaLiquida.toFixed(2)}`,
                  adjustments: "Estabilização por threshold mínimo de 5% da receita líquida para evitar instabilidade em bases pequenas.",
                  rationale: "Quantifica a dependência de eventos extraordinários ou alienações pontuais para a lucratividade declarada."
                },
                sustainability: {
                  value: grossMargin,
                  score: eqMarginScore,
                  formula: "20 - deduções (Margem EBITDA <= 0, SG&A > 50%, absorção ineficiente ou volatilidade excessiva)",
                  lineage: `Margem Gross: ${(grossMargin*100).toFixed(1)}%, Margem EBITDA: ${(ebitdaMargin*100).toFixed(1)}%, SG&A: ${(sgaIntensity*100).toFixed(1)}%, Volatilidade: ${(ebitdaVol*100).toFixed(1)}%`,
                  adjustments: "Análise de volatilidade histórica nos últimos 3 ciclos e verificação de dreno de OPEX.",
                  rationale: "Avalia a estabilidade estrutural das margens operacionais contra flutuações sazonais ou ineficiência estrutural."
                },
                shareholderSupport: {
                  value: supportRatio,
                  score: eqSupportScore,
                  formula: "(|Fluxo Partes Relacionadas| + |Fluxo Capitalização|) / max(|EBITDA|, 1)",
                  lineage: `Partes Relacionadas: ${fluxoPartesRelacionadas.toFixed(2)}, Capitalização: ${fluxoCapitalizacao.toFixed(2)}, EBITDA: ${ebitda.toFixed(2)}`,
                  adjustments: "Dedução atenuada em 50% para empresas em escala/early-stage e agravada se recorrente.",
                  rationale: "Mapeia a dependência de injeções de capital externo ou societário para simular sustentabilidade contábil."
                },
                accountingAggressiveness: {
                  value: deprRatio,
                  score: eqAccountingScore,
                  formula: "10 - deduções (depreciação incondizente, descompasso BPxDFC, margin spikes sem caixa)",
                  lineage: `Depreciação/Ativo Fixo: ${(deprRatio*100).toFixed(2)}%, Descompasso Conciliação: ${varConciliacao.toFixed(2)}, Margin Spike sem Caixa: ${hasMarginSpikeWithoutCash}`,
                  adjustments: "Detecção de acréscimo de margens sem suporte de caixa e testes de depreciação de ativos pesados.",
                  rationale: "Identifica posturas contábeis excessivamente agressivas, sub-depreciações ou descompassos de competência."
                },
                longitudinalStability: {
                  value: historicalCyclesCount,
                  score: eqStabilityScore,
                  formula: "Consistência de lucro e validação de turnarounds nos ciclos históricos",
                  lineage: `Ciclos Históricos: ${historicalCyclesCount}, Anos de Prejuízo: ${lossYearsCount}, Volatilidade NI: ${niVol.toFixed(2)}`,
                  adjustments: "Proteção estatística de early-stage (faturamento/escala recente) retornando nota base de 8/10.",
                  rationale: "Avalia a estabilidade do resultado líquido ao longo de múltiplos ciclos de mercado."
                }
              }
            }
          }
      };

      // Causalidade básica governada
      const causality: CausalityChain[] = [];
      if (fcoOperacionalReal < 0) {
          causality.push({
            trigger: 'FCO Operacional Real Negativo',
            consequence: 'Queima genuína de caixa operacional, desmascarada de suportes societários e aportes.',
            amplification: null,
            mitigation: null,
            businessImpact: 'Operação core deficitária e dependente de liquidez secundária.',
            structuralRisk: 'Crítico',
            institutionalImpact: 'Ajuste imediato de OPEX e Capex não essenciais.'
          });
      }

      let finalDiagnostic = cleanNarrativeText(fiduciaryDiagnostic);
      let executiveNarrative = finalDiagnostic;

      if (isEarlyStage || lifecycleStage === 'INITIAL_CAPITALIZATION') {
        executiveNarrative = EarlyStageNarrativeEngine.interpret(
          'INITIAL_CAPITALIZATION',
          finalDiagnostic,
          { hasPositiveEquity: true, analysisYear: filterYear }
        );
      }

      const narrative: AdvisoryNarrative = {
        diagnostic: finalDiagnostic,
        executiveNarrative,
        cause: fcoOperacionalReal > 0 ? 'Operação core geradora de caixa' : 'Operação core consumidora de caixa',
        consequence: variacaoCaixa > 0 ? 'Acúmulo líquido de disponibilidades' : 'Erosão líquida de disponibilidades',
        sensitivity: confidence === 'LOW' ? 'Alta volatilidade informacional' : 'Comportamento estruturado',
        risk: fcoOperacionalReal < 0 ? 'Alto' : 'Estável',
        priority: 'Segregação rigorosa de fluxos com partes relacionadas',
        strategicMovement: 'Conformidade fiduciária e contenção de saídas não operacionais.'
      };

      const semanticRoot = DFCSemanticCanonicalRootResolver.resolve({
        semanticSource: profile ? 'ELSA' : 'LEGACY',
        lifecycleProfile: profile,
        semanticContext: runtimeCtx?.semanticContext || null,
        cqsSemantic: profile?.cashStatus?.semanticLabel || null,
        eqsSemantic: profile?.earningsStatus?.semanticLabel || null,
        executiveNarrative
      });

      return {
        engineName: 'LegacyDFCAdapter',
        success: true,
        confidence,
        violations,
        inference: {
          domain: 'Inteligência de Caixa (DFC)',
          semanticSource: semanticRoot.canonicalRoot,
          lifecycleProfile: profile,
          semanticContext: {
            ...runtimeCtx?.semanticContext,
            semanticSource: semanticRoot.canonicalRoot,
            lifecycleStage: semanticRoot.lifecycleStage,
            lifecycleLabel: semanticRoot.lifecycleLabel
          },
          executiveLifecycleContext: ExecutiveLifecycleContextResolver.resolve(
            semanticRoot.lifecycleStage,
            semanticRoot.lifecycleLabel
          ),
          executiveNarrative,
          cqsSemantic: profile?.cashStatus?.semanticLabel || null,
          eqsSemantic: profile?.earningsStatus?.semanticLabel || null,
          semanticAudit: semanticRoot,
          metrics: {
            ...metrics,
            semanticDisplays: {
              executiveDisplay: {
                cashStatus: (isEarly && profile?.cashStatus?.semanticLabel) ? profile.cashStatus.semanticLabel : cqsLevel,
                treasuryStatus: (isEarly && profile?.treasuryStatus?.semanticLabel) ? profile.treasuryStatus.semanticLabel : sustentabilidadeTesouraria,
                liquidityStatus: (isEarly && profile?.liquidityStatus?.semanticLabel) ? profile.liquidityStatus.semanticLabel : stressLiquidezStatus,
                confidenceStatus: isEarly ? 'Histórico Insuficiente para Avaliação Longitudinal' : 'Comportamento Estruturado'
              },
              auditDisplay: {
                rawSeverity: 'CRITICAL', // Example, but let's map actual severity
                rawCashRisk: cqsLevel,
                rawTreasuryRisk: sustentabilidadeTesouraria
              }
            }
          },
          causality,
          narrative,
          confidence,
          evidenceLevel,
          score: cashQualityScore
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

