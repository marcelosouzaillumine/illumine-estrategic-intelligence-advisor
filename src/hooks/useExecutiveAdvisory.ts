import { useState, useEffect, useMemo } from 'react';
import { useFinancialData } from './useFinancialData';
import { generateExecutiveAdvisory, ExecutiveAdvisoryReport, AdvisoryInput } from '../lib/executive-advisory-engine';
import { evaluateMasterCausality } from '../lib/master-causal-engine';
import { analyzeOperationalIntelligence, OperationalInput } from '../lib/operational-intelligence-engine';
import { analyzeCashFlowIntelligence, CashFlowInput } from '../lib/cash-flow-intelligence-engine';
import { BusinessIdentity, inferBusinessIdentity } from '../lib/business-identity-engine';
import { calculateFinancialMetrics } from '../lib/financial-engine';

export function useExecutiveAdvisory(clientId: string, year: number, month: number, rawClientData?: any) {
  const { dbData: dreData, loading: dreLoading } = useFinancialData(clientId, year, month, 'DRE');
  const { dbData: bpData, loading: bpLoading } = useFinancialData(clientId, year, month, 'BP');
  const { dbData: caixaData, loading: caixaLoading } = useFinancialData(clientId, year, month, 'CAIXA');

  const loading = dreLoading || bpLoading || caixaLoading;

  const advisoryReport = useMemo<ExecutiveAdvisoryReport | null>(() => {
    if (loading || (dreData.length === 0 && bpData.length === 0)) return null;

    // Helper to extract values
    const getVal = (data: any[], name: string) => data.find(d => d.category === name || d.conta === name)?.value || data.find(d => d.category === name || d.conta === name)?.val || 0;

    // 1. Prepare BP Summary
    const bpSummary = {
      ativoTotal: getVal(bpData, 'Ativo Total'),
      ativoCirculante: getVal(bpData, 'Ativo Circulante'),
      passivoCirculante: getVal(bpData, 'Passivo Circulante'),
      passivoNaoCirculante: getVal(bpData, 'Passivo Não Circulante'),
      patrimonioLiquido: getVal(bpData, 'Patrimônio Líquido'),
      estoques: getVal(bpData, 'Estoques'),
      disponibilidades: getVal(bpData, 'Disponibilidades') || getVal(bpData, 'Caixa e Equivalentes'),
      fornecedores: getVal(bpData, 'Fornecedores')
    };

    // 2. Prepare Metrics
    // @ts-ignore
    const metrics = calculateFinancialMetrics(bpData, dreData);

    // 3. Prepare Identity
    const clientName = rawClientData?.razaoSocial || rawClientData?.name || 'Empresa';
    const clientSector = rawClientData?.setor || 'Serviços';
    // @ts-ignore
    const identity: BusinessIdentity = inferBusinessIdentity(clientName, clientSector, bpSummary, metrics);

    // 4. Generate Master Causal Output
    // @ts-ignore
    const causal = evaluateMasterCausality(bpSummary, metrics, identity, 12); // Assuming 12 months data length for maturity context

    // 5. Prepare Operational Input
    const receitaLiquida = getVal(dreData, 'Receita Líquida') || getVal(dreData, 'Receita Operacional Bruta') || 0;
    const custosVariaveis = getVal(dreData, 'Custo dos Produtos/Serviços Vendidos') || 0;
    const despesasOperacionais = getVal(dreData, 'Despesas Operacionais') || 0;
    const custosFixos = getVal(dreData, 'Custos Fixos') || (despesasOperacionais * 0.6); // proxy
    let ebitda = getVal(dreData, 'EBITDA');
    if (!ebitda) {
      const ebit = getVal(dreData, 'Lucro Operacional (EBIT)');
      const da = Math.abs(getVal(dreData, 'Depreciação e Amortização'));
      ebitda = ebit + da;
    }
    const lucroLiquido = getVal(dreData, 'Lucro Líquido') || getVal(dreData, 'Lucro Líquido do Exercício');
    
    const operationalInput: OperationalInput = {
      receitaLiquida,
      custosVariaveis,
      custosFixos,
      despesasOperacionais,
      ebitda,
      lucroLiquido,
      saldoTesouraria: bpSummary.disponibilidades - bpSummary.passivoCirculante, // proxy simples
      necessidadeCapitalGiro: metrics.ncg,
      crescimentoReceita: 0, // Necessitaria de DREs anteriores, usando 0 padrão p/ simplificação
      crescimentoDespesas: 0,
      segmentoEmpresarial: clientSector.toLowerCase(),
      historicoSazonal: false,
      diasRecebimento: 30
    };

    const operational = analyzeOperationalIntelligence(operationalInput);

    // 6. Prepare Cash Flow Input
    const currentCashBalance = bpSummary.disponibilidades;
    const operatingCashFlow = getVal(dreData, 'Fluxo de Caixa Operacional') || ebitda; // proxy if not available in CAIXA
    const monthlyCashBurnRate = getVal(caixaData, 'Queima Mensal') || (despesasOperacionais / 12); // proxy
    
    const cashFlowInput: CashFlowInput = {
      currentCashBalance,
      monthlyCashBurnRate: monthlyCashBurnRate > 0 ? monthlyCashBurnRate : 1, // avoid division by 0
      operatingCashFlow,
      debtAmortization: getVal(caixaData, 'Amortização de Dívidas') || getVal(bpData, 'Empréstimos e Financiamentos CP') / 12,
      fundingInflows: getVal(caixaData, 'Aportes') || 0,
      partnerCapitalInjections: getVal(caixaData, 'Aportes de Sócios') || 0,
      receivablesAging: getVal(bpData, 'Contas a Receber') || 0,
      overdueReceivables: getVal(caixaData, 'Inadimplência') || 0,
      shortTermObligations: bpSummary.passivoCirculante,
      recurringFixedCashOutflows: custosFixos + despesasOperacionais,
      // @ts-ignore
      seasonalityContext: 'neutro',
      businessModelContext: clientSector.toLowerCase()
    };

    const cashFlow = analyzeCashFlowIntelligence(cashFlowInput);

    // 7. Consolidate via generateExecutiveAdvisory
    const input: AdvisoryInput = {
      causal,
      operational,
      cashFlow
    };

    return generateExecutiveAdvisory(input);
  }, [dreData, bpData, caixaData, loading, rawClientData]);

  return { advisoryReport, loading };
}
