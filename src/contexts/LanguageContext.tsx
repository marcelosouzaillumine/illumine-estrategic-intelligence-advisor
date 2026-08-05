import React, { createContext, useContext, useState } from 'react';
import { dictionaries, Locale } from '../i18n';
import { resolveInstitutionalLabel, humanizeInstitutionalKey } from '../core/runtime/i18n/InstitutionalLabelResolver';
import { useLocale } from '../core/internationalization/providers/LocaleProvider';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string, options?: string | Record<string, any>) => string;
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

export const useLanguage = () => {
  if ((globalThis as any).__mockUseLanguage) {
    return (globalThis as any).__mockUseLanguage();
  }
  return useContext(LanguageContext);
};

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
    'conta': 'tables.column.account',
    'conta contabil': 'tables.column.account_billing',
    'valor': 'common.value',
    'valor (r$)': 'tables.column.value_brl',
    'saldo': 'common.balance',
    'saldo (r$)': 'tables.column.balance_brl',
    'av (%)': 'tables.column.vertical_analysis',
    'ah (%)': 'tables.column.horizontal_analysis',
    'ah (1 ano)': 'tables.column.horizontal_analysis_1y',
    'ah (2 anos)': 'tables.column.horizontal_analysis_2y',
    'ah (3 anos)': 'tables.column.horizontal_analysis_3y',
    'detalhamento da dre': 'tables.dre_details',
    'analise horizontal e vertical': 'tables.horizontal_vertical_analysis',
    'detalhamento estrutural': 'tables.structural_details',

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
    'economic normalization center': 'navigation.page.economic_normalization_center',
    'centro de normalizacao economica': 'navigation.page.economic_normalization_center',
    'financial lineage center': 'navigation.page.financial_lineage_center',
    'linhagem fiduciaria (flif)': 'navigation.page.financial_lineage_center',
    'linhagem fiduciaria': 'navigation.page.financial_lineage_center',
    'linaje fiduciario': 'navigation.page.financial_lineage_center',
    'credit committee simulator': 'navigation.page.credit_committee_center',
    'simulador de comite de credito': 'navigation.page.credit_committee_center',
    'institutional memory center': 'navigation.page.institutional_memory_center',
    'centro de memoria institucional': 'navigation.page.institutional_memory_center',
    'risk exposure center': 'navigation.page.risk_exposure_center',
    'decision lifecycle center': 'navigation.page.decision_lifecycle_center',
    'sovereign decision center': 'navigation.page.sovereign_decision_center',
    'centro de decisao soberana': 'navigation.page.sovereign_decision_center',
    'executive execution center': 'navigation.page.executive_execution_center',
    'centro de execucao executiva': 'navigation.page.executive_execution_center',
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

import { useTranslation } from 'react-i18next';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t: i18nT, i18n } = useTranslation(['common', 'dashboard', 'executive']);
  const { setPreference } = useLocale();

  const [language, setLanguageState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      // 1. URL priority (e.g., ?lang=en-US)
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'en-US' || urlLang === 'es-ES' || urlLang === 'pt-BR') {
        return urlLang as Locale;
      }

      // 1.5 URL path priority (e.g., /en/login)
      const path = window.location.pathname;
      if (path.startsWith('/en/') || path === '/en') return 'en-US';
      if (path.startsWith('/es/') || path === '/es') return 'es-ES';
      if (path.startsWith('/pt/') || path === '/pt') return 'pt-BR';
      
      // 2. localStorage priority
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('illumine-language');
        if (saved === 'en-US' || saved === 'es-ES' || saved === 'pt-BR') {
          return saved as Locale;
        }
      }

      // 3. navigator.language priority
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language;
        if (browserLang.startsWith('en')) return 'en-US';
        if (browserLang.startsWith('es')) return 'es-ES';
        if (browserLang.startsWith('pt')) return 'pt-BR';
      }
    }
    
    // 4. Fallback
    return 'pt-BR';
  });

  // Keep i18n in sync with state on first load since state could come from auto-detect
  React.useEffect(() => {
    if (i18n && i18n.language !== language && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(language);
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('illumine-language', lang);
    }
    // Sync with the new engine
    if (i18n && i18n.language !== lang && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lang);
    }
    // Sync with LocaleProvider to prevent it from reverting i18n.language
    setPreference({ language: lang });
    window.dispatchEvent(new Event('storage'));
  };

  const t = (key: string, options?: string | Record<string, any>): string => {
    // 1. Try the new i18next engine first
    if (i18n && typeof i18n.exists === 'function' && i18n.exists(key)) {
      return i18nT(key, typeof options === 'object' ? options : undefined) as string;
    }

    // 2. Legacy fallback
    let result: string | undefined = undefined;

    // Try active dictionary
    const activeDict = dictionaries[language];
    if (activeDict && (activeDict as any)[key] !== undefined) {
      result = (activeDict as any)[key];
    }
    
    // Try fallback dict if provided
    if (result === undefined && options) {
      if (typeof options === 'string') {
        result = options;
      } else if (options[language] !== undefined) {
        result = options[language];
      }
    }

    // Try default dictionary (pt-BR)
    if (result === undefined) {
      const defaultDict = dictionaries['pt-BR'];
      if (language !== 'pt-BR' && defaultDict && (defaultDict as any)[key] !== undefined) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[i18n] Fallback to default pt-BR for key: "${key}" (requested locale "${language}").`);
        }
        result = (defaultDict as any)[key];
      }
    }

    if (result !== undefined) {
      if (options && typeof options === 'object') {
        let interpolated = result;
        for (const [k, v] of Object.entries(options)) {
          if (k !== 'pt-BR' && k !== 'en-US' && k !== 'es-ES') {
            interpolated = interpolated.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
          }
        }
        return interpolated;
      }
      return result;
    }

    if (process.env.NODE_ENV === 'development') {
      return `[[${key}]]`;
    }

    const humanized = humanizeInstitutionalKey(key);
    return humanized || key.replace(/^.*\./, "").replace(/_/g, " ");
  };

  const translateLabel = (label: string): string => {
    const key = mapLabelToKey(label);
    if (key) {
      const prefixMatch = label.match(/^[\s(\-+)=/]+/);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      return `${prefix}${safeT(key)}`;
    }

    const cleanLabel = label.replace(/^[\s(\-+)=/]+/g, '').trim();
    if (cleanLabel) {
      if (i18n && typeof i18n.exists === 'function' && i18n.exists(`common:${cleanLabel}`)) {
         const prefixMatch = label.match(/^[\s(\-+)=/]+/);
         const prefix = prefixMatch ? prefixMatch[0] : '';
         return `${prefix}${i18nT(`common:${cleanLabel}`)}`;
      }

      const activeDict = dictionaries[language];
      if (activeDict && (activeDict as any)[cleanLabel] !== undefined) {
        const prefixMatch = label.match(/^[\s(\-+)=/]+/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        return `${prefix}${(activeDict as any)[cleanLabel]}`;
      }

      const defaultDict = dictionaries['pt-BR'];
      if (defaultDict && (defaultDict as any)[cleanLabel] !== undefined) {
        const prefixMatch = label.match(/^[\s(\-+)=/]+/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        return `${prefix}${(defaultDict as any)[cleanLabel]}`;
      }
    }

    return label;
  };

  const safeT = (key: string, fallback = 'Informação estrutural indisponível'): string => {
    const resolved = resolveInstitutionalLabel(key, t);
    
    if (!resolved) return '';

    if (resolved.startsWith('[[') && resolved.endsWith(']]')) {
      if (process.env.NODE_ENV === 'development') {
        return resolved;
      }
      const innerKey = resolved.slice(2, -2);
      return humanizeInstitutionalKey(innerKey) || innerKey.replace(/^.*\./, "").replace(/_/g, " ");
    }

    return resolved;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, safeT, translateLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}
