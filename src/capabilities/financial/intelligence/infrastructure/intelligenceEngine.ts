import { buildBPHierarchy } from '../../../../lib/bpEngine';

export const CURRENT_METHODOLOGY_VERSION = "Illumine Governance Engine v1.1";

const getVal = (data: any[], names: string[]) => {
  const lowerNames = names.map(n => n.toLowerCase());
  const found = data.find(d => {
    const cat = (d.category || d.conta || '').toLowerCase();
    return lowerNames.includes(cat);
  });
  return found?.value || found?.valor || 0;
};

// Extrai o CMV/CPV/CSV da DRE de forma robusta, reconhecendo todas as variações
// comuns usadas em empresas brasileiras (Mercadoria, Produto, Serviço).
const extractCMV = (dreRows: any[]): number => {
  const CMV_TERMS = [
    'custo de mercadoria', 'custo das mercadorias', 'custo de mercadorias vendidas',
    'custo do produto', 'custo dos produtos', 'custo dos produtos vendidos',
    'custo de serviço', 'custo dos serviços', 'custo dos serviços prestados',
    'custo mercadorias/produtos/serviços vendidos', 'custo mercadorias', 'custo produtos',
    'cmv', 'cpv', 'csv', 'csp',
    'custo direto', 'custos diretos',
    'custo variável', 'custos variáveis',
  ];
  // Soma todas as linhas cujo nome contenha qualquer termo CMV
  const total = dreRows.reduce((acc, d) => {
    const cat = (d.category || d.conta || '').toLowerCase();
    const isCMV = CMV_TERMS.some(t => cat.includes(t));
    if (isCMV) {
      const val = Math.abs(d.value ?? d.val ?? d.valor ?? 0);
      return acc + val;
    }
    return acc;
  }, 0);
  return total;
};

export const IntelligenceEngine = {
  processFinancialData: (currentDre: any[], currentBp: any[], version: string = CURRENT_METHODOLOGY_VERSION) => {
    // Extração de Dados DRE
    const receita = getVal(currentDre, ['Receita Líquida', 'Receita Operacional Bruta', 'Receitas']);
    const ebitda = getVal(currentDre, ['EBITDA', 'LAJIDA']);
    const lucro = getVal(currentDre, ['Lucro Líquido', 'Resultado Líquido']);

    // CMV: Custo de Mercadoria / Produto / Serviço vendido
    // Prioridade: soma robusta de todas as linhas de custo direto na DRE
    const cmv = extractCMV(currentDre);
    
    // Extração de Dados BP (Robusta com bpEngine)
    const bpSummary = currentBp.length > 0 ? buildBPHierarchy(currentBp).summary : null;
    
    const ativoTotal = bpSummary?.ativoTotal || getVal(currentBp, ['Ativo Total', 'Ativo']);
    const pl = bpSummary?.patrimonioLiquido || getVal(currentBp, ['Patrimônio Líquido', 'PL']);
    const ac = bpSummary?.ativoCirculante || getVal(currentBp, ['Ativo Circulante']);
    const pc = bpSummary?.passivoCirculante || getVal(currentBp, ['Passivo Circulante']);
    const pnc = bpSummary?.passivoNaoCirculante || getVal(currentBp, ['Passivo Não Circulante']);
    const est = bpSummary?.estoques || getVal(currentBp, ['Estoques', 'Estoque']);
    const clientes = bpSummary?.clientes || getVal(currentBp, ['Clientes', 'Contas a Receber', 'Duplicatas a Receber']);
    const fornecedores = bpSummary?.fornecedores || getVal(currentBp, ['Fornecedores', 'Contas a Pagar']);

    // Cálculos Lógicos (Padrão v1.1)
    // ROE = Lucro Líquido / Patrimônio Líquido
    let roe = pl > 0 ? (lucro / pl) * 100 : 0;

    // Capital Investido = PL + Passivo Não Circulante (capital de longo prazo)
    let investedCapital = pl + pnc;

    // NOPLAT = EBITDA × (1 - alíquota efetiva presumida de 34%)
    let noplat = ebitda * 0.66;

    // ROIC = NOPLAT / Capital Investido
    let roic = investedCapital > 0 ? (noplat / investedCapital) * 100 : 0;

    // Custo de capital (premissas conservadoras para PMEs brasileiras)
    let costOfEquity = 0.15;  // Ke: CAPM simplificado (Selic + prêmio de risco)
    let costOfDebt   = 0.12;  // Kd bruto (taxa média de mercado para PMEs)
    const taxShield  = 1 - 0.34; // Benefício fiscal do IR/CSLL

    if (version === "Illumine Governance Engine v2.0") {
      costOfEquity = 0.16;
      costOfDebt   = 0.11;
      noplat = ebitda * 0.70;
      roic = investedCapital > 0 ? (noplat / investedCapital) * 100 : 0;
    }

    // WACC = (PL/CI) × Ke + (PNC/CI) × Kd × (1 - IR)
    let wacc = investedCapital > 0
      ? ((pl  / investedCapital) * costOfEquity
       + (pnc / investedCapital) * costOfDebt * taxShield) * 100
      : 0;

    // EVA = Capital Investido × (ROIC − WACC) / 100
    let eva = investedCapital > 0 ? investedCapital * ((roic - wacc) / 100) : 0;

    // DSCR = EBITDA / Serviço da Dívida
    // Serviço estimado: amortização anual do PNC (~15% ao ano) + juros do PC financeiro
    const servicoDivida = (pnc * 0.15) + (pc * 0.08);
    let dscr = servicoDivida > 0 ? ebitda / servicoDivida : 0;

    // GAF (Grau de Alavancagem Financeira) = EBIT / EBT
    // Com proxy: EBIT ≈ EBITDA; EBT ≈ Lucro antes do IR ≈ Lucro Líquido / 0.66
    const ebt = lucro > 0 ? lucro / 0.66 : 0;
    let gaf = ebt > 0 ? ebitda / ebt : 0;

    // Estrutura de Capital
    let totalThirdParty = pc + pnc;

    // CT: concentração do passivo circulante no total de terceiros
    let ct = totalThirdParty > 0 ? (pc / totalThirdParty) * 100 : 0;
    // CE: concentração do passivo não circulante no total de terceiros
    let ce = totalThirdParty > 0 ? (pnc / totalThirdParty) * 100 : 0;
    // IMPL: índice de imobilização do PL pelo capital de terceiros
    let impl = pl > 0 ? (totalThirdParty / pl) * 100 : 0;
    // IRPC: índice de endividamento geral (Capital de terceiros / Ativo Total)
    const ativoTotalCalc = pl + totalThirdParty;
    let irpc = ativoTotalCalc > 0 ? (totalThirdParty / ativoTotalCalc) * 100 : 0;

    // ── Ciclos de Atividade Operacional ─────────────────────────────────────
    // Giro do Ativo (×) = Receita / Ativo Total
    const giroAtivo = ativoTotal > 0 ? receita / ativoTotal : 0;

    // Denominador para cálculos de estoque:
    // Usa CMV real se disponível (mais preciso); caso contrário, cai para Receita como proxy.
    const baseCMV = cmv > 0 ? cmv : receita;

    // Giro do Estoque (×) = CMV / Estoque
    // (se CMV ausente, usa Receita como denominador)
    const giroEstoque = est > 0 ? baseCMV / est : 0;

    // PMR — Prazo Médio de Recebimento (dias) = (Clientes / Receita) × 365
    const pmr = receita > 0 ? (clientes / receita) * 365 : 0;

    // PME — Prazo Médio de Estoque (dias) = (Estoque / CMV) × 365
    // (se CMV ausente, usa Receita como denominador)
    const pme = baseCMV > 0 ? (est / baseCMV) * 365 : 0;

    // PMP — Prazo Médio de Pagamento (dias) = (Fornecedores / CMV) × 365
    // Fornecedores representa as compras a prazo; CMV é a base mais adequada que a Receita
    const pmp = baseCMV > 0 ? (fornecedores / baseCMV) * 365 : 0;

    // Ciclo Operacional (dias) = PMR + PME
    const cicloOperacional = pmr + pme;

    // Ciclo Financeiro (dias) = Ciclo Operacional − PMP
    const cicloFinanceiro = cicloOperacional - pmp;

    // Flag: indica se o CMV real foi encontrado na DRE ou se usamos proxy da Receita
    const cmvSource: 'real' | 'proxy' = cmv > 0 ? 'real' : 'proxy';

    return {
      methodologyVersion: version,
      processedAt: new Date().toISOString(),
      metrics: {
        receita, ebitda, lucro, ativoTotal, pl, ac, pc, pnc, est, clientes, fornecedores,
        cmv, cmvSource,
        roe, investedCapital, noplat, roic, wacc, eva, dscr,
        totalThirdParty, ct, ce, impl, irpc, gaf,
        giroAtivo, giroEstoque, pmr, pme, pmp, cicloOperacional, cicloFinanceiro
      }
    };
  }
};
