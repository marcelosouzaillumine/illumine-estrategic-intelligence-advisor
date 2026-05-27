export interface ExecutiveActionItem {
  title: string;
  category: string;
  priority: string;
  timeline: string;
  expectedImpact: string;
  executionRisk: string;
  monitoringKPI: string;
  fiduciaryEvidence: string;
  severity: string;
}

export class ExecutiveActionMatrixEngine {
  public static buildMatrix(
    actions: string[],
    metrics: any,
    bpSummary: any,
    causality: any,
    severityLevel: string
  ): ExecutiveActionItem[] {
    if (!actions || actions.length === 0) {
      return [];
    }

    const bp = bpSummary || {};
    const items: ExecutiveActionItem[] = [];

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const item = this.mapAction(action, i, metrics, bp, causality, severityLevel);
      
      // Mandatory Adjustment 3: Omit action if it has no valid fiduciaryEvidence
      if (item && item.fiduciaryEvidence && item.fiduciaryEvidence.trim().length > 0) {
        items.push(item);
      }
    }

    return items;
  }

  private static mapAction(
    action: string,
    index: number,
    metrics: any,
    bp: any,
    causality: any,
    severityLevel: string
  ): ExecutiveActionItem | null {
    const lower = action.toLowerCase();
    
    // Default metadata inference (matching ExecutivePerspectiveSection logic)
    let category = 'Governança Corporativa';
    let priority = 'Normal';
    let timeline = 'Longo Prazo';
    let expectedImpact = 'Ajuste de estrutura operacional';
    let executionRisk = 'Instabilidade tática';
    let monitoringKPI = 'EBITDA / ROL';
    let fiduciaryEvidence = '';

    // Category
    if (lower.includes('receita') || lower.includes('comercial') || lower.includes('venda') || lower.includes('market') || lower.includes('faturamento') || lower.includes('cliente')) {
      category = 'Gestão Comercial';
    } else if (lower.includes('pessoa') || lower.includes('equipe') || lower.includes('liderança') || lower.includes('talent') || lower.includes('rh') || lower.includes('humano')) {
      category = 'Gestão de Pessoas';
    } else if (lower.includes('caixa') || lower.includes('liquid') || lower.includes('financ') || lower.includes('dívida') || lower.includes('cr') || lower.includes('capital') || lower.includes('investimento') || lower.includes('fornecedores') || lower.includes('sócios') || lower.includes('tesouraria')) {
      category = 'Gestão Financeira';
    } else if (lower.includes('operac') || lower.includes('processo') || lower.includes('eficiên') || lower.includes('produt') || lower.includes('estrutura') || lower.includes('escala') || lower.includes('estoque') || lower.includes('ciclo')) {
      category = 'Gestão Operacional';
    } else if (lower.includes('estratég') || lower.includes('posicion') || lower.includes('mercado') || lower.includes('competi') || lower.includes('inovaç')) {
      category = 'Gestão Estratégica';
    }

    // Priority
    if (lower.includes('imediato') || lower.includes('urgente') || lower.includes('crítico') || lower.includes('risco') || index === 0) {
      priority = 'Alta';
    } else if (index === 1) {
      priority = 'Média';
    }

    // Timeline
    if (lower.includes('imediato') || lower.includes('curto') || lower.includes('30 dias') || lower.includes('60 dias')) {
      timeline = 'Curto Prazo';
    } else if (lower.includes('médio') || lower.includes('90 dias') || lower.includes('180 dias')) {
      timeline = 'Médio Prazo';
    }

    // Fiduciary Evidence Mapping based on real metrics and account values
    if (lower.includes('despesas administrativas') || lower.includes('admin')) {
      const idxAdmin = metrics?.indiceDespesasAdministrativas;
      if (idxAdmin !== undefined && idxAdmin !== null && idxAdmin > 0) {
        fiduciaryEvidence = `Despesa administrativa representa ${idxAdmin.toFixed(2)}% da receita líquida`;
        expectedImpact = 'Melhoria da absorção operacional and elevação do EBITDA';
        executionRisk = 'Persistência de EBITDA negativo e desajuste no SG&A';
        monitoringKPI = 'Despesas Administrativas / Receita Líquida';
      }
    } else if (lower.includes('transações com partes relacionadas') || lower.includes('sócios')) {
      const pl = bp.patrimonioLiquido || 0;
      // We check if we have shareholder current accounts in the bpSummary
      const transacoes = bp.outrasContasCirculante || bp.contasSocios || 0;
      if (transacoes > 0) {
        fiduciaryEvidence = `Transações com sócios/partes relacionadas no montante de R$ ${transacoes.toLocaleString('pt-BR')}`;
      } else if (pl !== 0) {
        fiduciaryEvidence = `Estrutura de capital com patrimônio líquido de R$ ${pl.toLocaleString('pt-BR')} exige governança com partes relacionadas`;
      }
      expectedImpact = 'Redução de passivos flutuantes e blindagem fiduciária';
      executionRisk = 'Questionamentos de compliance e drenagem de caixa operacional';
      monitoringKPI = 'Partes Relacionadas / Ativo Total';
    } else if (lower.includes('tesouraria') || lower.includes('liquidez') || lower.includes('caixa')) {
      const cx = bp.caixaEquivalentes || 0;
      const pc = bp.passivoCirculante || 0;
      if (cx > 0 && pc > 0) {
        fiduciaryEvidence = `Saldo de tesouraria de R$ ${cx.toLocaleString('pt-BR')} contra passivo circulante exigível de R$ ${pc.toLocaleString('pt-BR')}`;
        expectedImpact = 'Melhoria na solvência imediata e redução do risco de default';
        executionRisk = 'Pressão contínua sobre a folha e ruptura de tesouraria';
        monitoringKPI = 'Caixa Equivalentes / Passivo Circulante';
      } else if (metrics?.saldoTesouraria !== undefined && metrics?.saldoTesouraria !== null) {
        fiduciaryEvidence = `Saldo de tesouraria líquido de R$ ${metrics.saldoTesouraria.toLocaleString('pt-BR')}`;
        expectedImpact = 'Regularização do caixa tático';
        executionRisk = 'Ruptura de tesouraria e inadimplência de curto prazo';
        monitoringKPI = 'Saldo de Tesouraria';
      }
    } else if (lower.includes('estoque') || lower.includes('conversão')) {
      const est = bp.estoques || 0;
      const ac = bp.ativoCirculante || 0;
      if (est > 0 && ac > 0) {
        fiduciaryEvidence = `Estoques imobilizados representam R$ ${est.toLocaleString('pt-BR')} (${((est / ac) * 100).toFixed(1)}% do ativo circulante)`;
        expectedImpact = 'Monetização de estoques parados e liberação de capital de giro';
        executionRisk = 'Morosidade na venda e perdas por obsolescência';
        monitoringKPI = 'Giro de Estoques (Dias)';
      }
    } else if (lower.includes('fornecedores') || lower.includes('financiamento operacional')) {
      const forn = bp.fornecedores || 0;
      if (forn > 0) {
        fiduciaryEvidence = `Obrigações com fornecedores totalizam R$ ${forn.toLocaleString('pt-BR')}`;
        expectedImpact = 'Alongamento de prazos médios de pagamento';
        executionRisk = 'Perda de crédito comercial ou interrupção de suprimentos';
        monitoringKPI = 'Prazo Médio de Fornecedores (PMF)';
      }
    } else if (lower.includes('capex') || lower.includes('investimento')) {
      const liqCorr = metrics?.liqCorrente;
      if (liqCorr !== undefined && liqCorr !== null) {
        fiduciaryEvidence = `Índice de liquidez corrente em ${liqCorr.toFixed(2)}x demana cautela na alocação de Capex`;
        expectedImpact = 'Preservação de caixa livre imediato';
        executionRisk = 'Sucateamento de ativos produtivos ou atraso tecnológico';
        monitoringKPI = 'Capex / Receita Líquida';
      } else {
        const pl = bp.patrimonioLiquido || 0;
        if (pl > 0) {
          fiduciaryEvidence = `Estrutura de capital com patrimônio líquido de R$ ${pl.toLocaleString('pt-BR')} exige cautela em Capex`;
          expectedImpact = 'Preservação de liquidez estrutural';
          executionRisk = 'Atraso na expansão programada';
          monitoringKPI = 'Capex / Ativo Total';
        }
      }
    } else if (lower.includes('margem') || lower.includes('ebitda') || lower.includes('rentabilidade')) {
      const ebitMargin = metrics?.ebitdaVal;
      if (ebitMargin !== undefined && ebitMargin !== null) {
        fiduciaryEvidence = `Margem EBITDA atual em ${ebitMargin.toFixed(1)}% exige plano de rentabilização`;
        expectedImpact = 'Otimização de custos diretos e indiretos';
        executionRisk = 'Redução de qualidade do produto ou atrito com clientes';
        monitoringKPI = 'Margem EBITDA (%)';
      }
    } else if (lower.includes('receita') || lower.includes('expansão comercial')) {
      const rec = metrics?.recLiquida;
      if (rec !== undefined && rec !== null && rec > 0) {
        fiduciaryEvidence = `Receita líquida atual de R$ ${rec.toLocaleString('pt-BR')} limita capacidade de reinvestimento comercial`;
        expectedImpact = 'Aumento de ticket médio e otimização do CAC';
        executionRisk = 'Perda de market share frente a competidores agressivos';
        monitoringKPI = 'Crescimento de Receita Líquida (%)';
      }
    } else if (lower.includes('capital de giro') || lower.includes('ciclo operacional')) {
      const ncg = metrics?.ncg;
      if (ncg !== undefined && ncg !== null) {
        fiduciaryEvidence = `Necessidade de Capital de Giro (NCG) calculada em R$ ${ncg.toLocaleString('pt-BR')}`;
        expectedImpact = 'Sincronização dos prazos médios operacionais';
        executionRisk = 'Aumento das captações financeiras de curto prazo';
        monitoringKPI = 'Ciclo Financeiro (Dias)';
      }
    } else if (lower.includes('solvência') || lower.includes('endividamento') || lower.includes('partes relacionadas')) {
      const pl = bp.patrimonioLiquido || 0;
      if (pl > 0) {
        fiduciaryEvidence = `Patrimônio líquido de R$ ${pl.toLocaleString('pt-BR')} suporta estrutura de capital atual`;
        expectedImpact = 'Melhoria do endividamento sobre recursos próprios';
        executionRisk = 'Degradação da solvência corporativa e aumento do custo de dívida';
        monitoringKPI = 'PL / Passivo Total';
      }
    }

    // Default general evidence if nothing specific matched but data exists
    if (!fiduciaryEvidence && bp.ativoTotal > 0) {
      const pl = bp.patrimonioLiquido || 0;
      fiduciaryEvidence = `Balanço estruturado com Patrimônio Líquido de R$ ${pl.toLocaleString('pt-BR')}`;
      expectedImpact = 'Preservação da autonomia financeira e governança do Board';
      executionRisk = 'Deterioração das garantias estruturais de capital';
      monitoringKPI = 'Autonomia Financeira (PL / Ativo)';
    }

    return {
      title: action,
      category,
      priority,
      timeline,
      expectedImpact,
      executionRisk,
      monitoringKPI,
      fiduciaryEvidence,
      severity: severityLevel
    };
  }
}
