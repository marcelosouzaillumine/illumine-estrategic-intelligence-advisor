import React, { createContext, useContext, useState } from 'react';
import { dictionaries, Locale } from '../i18n';
import { resolveInstitutionalLabel } from '../core/runtime/i18n/InstitutionalLabelResolver';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string, fallbacks?: string | Record<string, string>) => string;
  safeT: (key: string, fallback?: string) => string;
  translateLabel: (label: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt-BR',
  setLanguage: () => {},
  t: (key) => key,
  safeT: (key, fallback) => fallback || 'Informação estrutural indisponível',
  translateLabel: (label) => label,
});

export const useLanguage = () => useContext(LanguageContext);

const mapLabelToKey = (label: string): string => {
  const cleanLabel = label
    .replace(/^[\s(\-+)=/]*\s*/, '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "");

  const map: Record<string, string> = {
    // Common Labels
    'mensal': 'common.monthly',
    'anual': 'common.annual',
    'consolidado': 'common.consolidated',
    'conforme': 'common.compliant',
    'monitoramento ativo': 'common.monitoring_active',
    'saudavel': 'common.healthy',
    'atencao': 'common.attention',
    'critico': 'common.critical',
    'em alta': 'common.on_rise',
    'em queda': 'common.on_fall',
    'estavel': 'common.stable',
    'pendente': 'common.pending',
    'n/a': 'common.na',
    'ativo': 'financial.assets',
    'passivo': 'financial.liabilities',
    'patrimonio': 'financial.netEquity',
    'patrimonio liquido': 'financial.netEquity',
    'conta': 'common.account',
    'conta contabil': 'common.account_billing',
    'valor': 'common.value',
    'valor (r$)': 'common.value_brl',
    'saldo': 'common.balance',
    'saldo (r$)': 'common.balance_brl',
    'av (%)': 'common.av',
    'ah (%)': 'common.ah',
    'ah (1 ano)': 'common.ah_1y',
    'ah (2 anos)': 'common.ah_2y',
    'ah (3 anos)': 'common.ah_3y',
    'detalhamento da dre': 'common.dre_details',
    'analise horizontal e vertical': 'common.horizontal_vertical_analysis',
    'detalhamento estrutural': 'common.structural_details',

    // Pages
    'inteligencia consolidada': 'navigation.page.consolidated_executive',
    'portfolio': 'navigation.page.portfolio',
    'inteligencia sistemica': 'navigation.page.systemic_intelligence',
    'efos': 'navigation.page.efos',
    'executive scenario lab': 'navigation.page.lab',
    'analise de kpis': 'navigation.page.indicadores',
    'aprovacoes de documentos': 'navigation.page.aprovacoes',
    'roadmap de execucao': 'navigation.page.plano_acao',
    'empresas': 'navigation.page.clientes',
    'parceiros estrategicos': 'navigation.page.parceiros',
    'premissas do sistema': 'navigation.page.premissas_economicas',
    'usuarios': 'navigation.page.gestao_usuarios',
    'central de coleta de dados': 'navigation.page.dados_historicos',
    'executive monitoring center': 'navigation.page.executive_monitoring_center',
    'governance maturity center': 'navigation.page.governance_maturity_center',
    'leadership dna center': 'navigation.page.leadership_dna_center',
    'institutional structure center': 'navigation.page.institutional_structure_center',
    'board deck center': 'navigation.page.board_deck_center',
    'fiduciary validation center': 'navigation.page.fiduciary_validation_center',
    'risk exposure center': 'navigation.page.risk_exposure_center',
    'decision lifecycle center': 'navigation.page.decision_lifecycle_center',
    'integridade & compliance': 'navigation.page.compliance_integrity_center',
    'crisis response center': 'navigation.page.crisis_response_center',
    'runtime observability center': 'navigation.page.runtime_observability_center',
    'product governance center': 'navigation.page.product_governance_center',
    'multi-tenant governance center': 'navigation.page.multi_tenant_governance_center',
    'dashboard de cultura': 'navigation.page.dashboard_cultura',
    'desenvolvimento humano': 'navigation.page.desenvolvimento_humano',
    'perfil de lideranca': 'navigation.page.perfil_lideranca',
    'gestao de pessoas': 'navigation.page.quadro_pessoal',
    'avaliacao de organograma': 'navigation.page.avaliacao_organograma',
    'cultura de feedback': 'navigation.page.cultura_feedback',
    'dashboard adm fin': 'navigation.page.dashboard_gestao',
    'administracao': 'navigation.page.adm_root',
    'indicadores administrativos': 'navigation.page.administrativa_indicadores',
    'contabilidade': 'navigation.page.contabil_root',
    'balanco patrimonial': 'navigation.page.bp',
    'dfc contabil': 'navigation.page.dfc',
    'dlpa contabil': 'navigation.page.dlpa',
    'dre contabil': 'navigation.page.dre',
    'plano contas contabilidade': 'navigation.page.plano_contas',
    'financas': 'navigation.page.financeira_root',
    'analise de custos de pessoal': 'navigation.page.custos_pessoal',
    'dre gerencial estrategica': 'navigation.page.dre_gerencial',
    'engenharia financeira': 'navigation.page.modelagem',
    'fluxo de caixa consolidado': 'navigation.page.caixa',
    'fluxo de contas a pagar': 'navigation.page.contas_pagar',
    'simulador de impacto tributario': 'navigation.page.tax_reform_impact',
    'gestao de ativos financeiros': 'navigation.page.ativos_financeiros',
    'gestao de contas a receber': 'navigation.page.contas_receber',
    'gestao de passivos': 'navigation.page.emprestimos',
    'inteligencia de capital': 'navigation.page.analise_financeira',
    'plano de contas gerencial': 'navigation.page.plano_contas_gerencial',
    'posicao financeira': 'navigation.page.posicao_financeira',
    'simulador de captacao': 'navigation.page.simulador_capital',
    'orcamento & budget': 'navigation.page.orcamento',
    'dashboard de inovacao': 'navigation.page.dashboard_inovacao',
    'projetos de inovacao': 'navigation.page.viabilidade',
    'dashboard de marketing': 'navigation.page.dashboard_marketing',
    'inteligencia competitiva': 'navigation.page.analise_mercado',
    'marketing de posicionamento': 'navigation.page.marketing_estrategico',
    'dashboard comercial': 'navigation.page.dashboard_comercial',
    'precificacao & margem': 'navigation.page.precificacao',
    'vendas & mercado': 'navigation.page.comercial_estrategico',
    'dashboard operacional': 'navigation.page.dashboard_operacional',
    'gestao de compras': 'navigation.page.compras',
    'eficiencia em logistica': 'navigation.page.logistica',
    'producao & processos': 'navigation.page.producao',
    'trilha do conhecimento': 'navigation.page.academy_home',
    'gestao da academia': 'navigation.page.academy_admin',
    'suporte': 'navigation.page.suporte',
    'mensagens e comunicados': 'navigation.page.mensagens',
    'gestao de perfil': 'navigation.page.perfil_usuario',
    'manutencao de dados': 'navigation.page.maintenance',
    'preferencias do sistema': 'navigation.page.configuracoes_sistema',

    // Financial lines
    'receita operacional bruta': 'financial.grossRevenue',
    'receita bruta': 'financial.grossRevenue',
    'impostos s/ faturamento': 'financial.taxBilling',
    'deducoes da receita bruta': 'financial.taxBilling',
    'receita operacional liquida': 'financial.netRevenue',
    'receita liquida': 'financial.netRevenue',
    'custos mercadorias/produtos/servicos': 'financial.cogs',
    'cpv (custos)': 'financial.cogs',
    'custos de venda': 'financial.cogs',
    'lucro bruto': 'financial.grossProfit',
    'despesas operacionais': 'financial.adminExpenses',
    'despesas administrativas': 'financial.adminExpenses',
    'ebitda': 'financial.ebitda',
    'depreciacao e amortizacao': 'financial.depreciation',
    'resultado operacional liquido (ebit)': 'financial.operatingProfit',
    'resultado financeiro': 'financial.financialResult',
    'outras receitas / despesas operacionais': 'financial.financialResult',
    'resultado antes de ir e csll': 'financial.lair',
    'lair': 'financial.lair',
    'provisoes (irpj/csll)': 'financial.incomeTax',
    'imposto de renda / csll': 'financial.incomeTax',
    'lucro liquido do exercicio': 'financial.netProfit',
    'lucro liquido': 'financial.netProfit',
    'caixa': 'financial.cash',
    'ativos permanentes': 'financial.permanentAssets',
    'total de ativos': 'financial.totalAssets',
    'ativo total': 'financial.totalAssets',
    'ativos': 'financial.totalAssets',
    'emprestimos bancarios': 'financial.bankLoans',

    // KPIs
    'faturamento bruto': 'kpi.faturamento_bruto',
    'deducoes e impostos': 'kpi.deducoes',
    'custos variaveis / cmv': 'kpi.custos_variaveis',
    'margem de contribuicao': 'kpi.margem_contribuicao',
    'despesas com pessoal': 'kpi.despesas_pessoal',
    'despesas operacionais (g&a)': 'kpi.despesas_operacionais',
    'marketing e vendas': 'kpi.marketing_vendas',
    'irpj / csll': 'kpi.impostos_lucro',
    'ativo circulante': 'kpi.ativo_circulante',
    'passivo circulante': 'kpi.passivo_circulante',
    'estoque': 'kpi.estoque',
    'contas a receber': 'kpi.contas_receber',
    'contas a pagar': 'kpi.contas_pagar',
    'caixa e equivalentes': 'kpi.disponibilidades',
    'roic (retorno s/ cap. investido)': 'kpi.roic',
    'wacc (custo de capital)': 'kpi.wacc',
    'dscr (cobertura de divida)': 'kpi.dscr',
    'ciclo financeiro (dias)': 'kpi.vwc_days',
    'ltv / cac': 'kpi.cac_ltv',
    'cash burn rate': 'kpi.burn_rate',
  };

  return map[cleanLabel] || '';
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('illumine-language');
      if (saved === 'en-US' || saved === 'es-ES' || saved === 'pt-BR') {
        return saved;
      }
    }
    return 'pt-BR';
  });

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('illumine-language', lang);
    }
    window.dispatchEvent(new Event('storage'));
  };

  const t = (key: string, fallbacks?: string | Record<string, string>): string => {
    const activeDict = dictionaries[language];
    if (activeDict && (activeDict as any)[key] !== undefined) {
      return (activeDict as any)[key];
    }
    
    // Try fallback dict if provided
    if (fallbacks) {
      if (typeof fallbacks === 'string') {
        return fallbacks;
      }
      if (fallbacks[language] !== undefined) {
        return fallbacks[language];
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing translation key: "${key}" for locale "${language}". No silent fallback permitted.`);
    }

    // Controlled fallback marker instead of silently mixing languages
    return `[[${key}]]`;
  };

  const translateLabel = (label: string): string => {
    const key = mapLabelToKey(label);
    if (key) {
      const prefixMatch = label.match(/^[\s(\-+)=/]+/);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      return `${prefix}${safeT(key)}`;
    }
    return label;
  };

  const safeT = (key: string, fallback = 'Informação estrutural indisponível'): string => {
    // 1. Tentar resolver o label com humanização e fallback silencioso (null)
    const resolved = resolveInstitutionalLabel(key, t);
    
    // 2. Se retornou null (humanização falhou, ou não havia nada),
    // retornamos uma string vazia (silencioso) para que o componente não renderize o item.
    // Se quiser o fallback antigo, usaríamos o argumento fallback, mas o prompt exigiu
    // fallback silencioso (retornar string vazia/null que oculte).
    // O UI já lida com vazio. Para garantir o contrato de `string`:
    if (!resolved) return '';

    return resolved;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, safeT, translateLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}
