const getActiveLanguage = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem('illumine-language') || 'pt-BR';
  }
  return 'pt-BR';
};

const getTranslation = (key: string, lang: string) => {
  const map: Record<string, Record<string, string>> = {
    'faturamento_bruto': { 'pt-BR': 'Faturamento Bruto', 'en-US': 'Gross Revenue', 'es-ES': 'Facturación Bruta' },
    'receita_liquida': { 'pt-BR': 'Receita Líquida', 'en-US': 'Net Revenue', 'es-ES': 'Ingresos Netos' },
    'deducoes': { 'pt-BR': 'Deduções e Impostos', 'en-US': 'Deductions & Taxes', 'es-ES': 'Deducciones e Impuestos' },
    'custos_variaveis': { 'pt-BR': 'Custos Variáveis / CMV', 'en-US': 'Variable Costs / COGS', 'es-ES': 'Costos Variables / CMV' },
    'margem_contribuicao': { 'pt-BR': 'Margem de Contribuição', 'en-US': 'Margem de Contribuição', 'es-ES': 'Margen de Contribución' },
    'despesas_pessoal': { 'pt-BR': 'Despesas com Pessoal', 'en-US': 'Personnel Expenses', 'es-ES': 'Gastos de Personal' },
    'despesas_operacionais': { 'pt-BR': 'Despesas Operacionais (G&A)', 'en-US': 'Operating Expenses (G&A)', 'es-ES': 'Gastos Operativos (G&A)' },
    'marketing_vendas': { 'pt-BR': 'Marketing e Vendas', 'en-US': 'Marketing & Sales', 'es-ES': 'Marketing y Ventas' },
    'ebitda': { 'pt-BR': 'EBITDA', 'en-US': 'EBITDA', 'es-ES': 'EBITDA' },
    'depreciacao': { 'pt-BR': 'Depreciação e Amortização', 'en-US': 'Depreciation & Amortization', 'es-ES': 'Depreciación y Amortización' },
    'resultado_financeiro': { 'pt-BR': 'Resultado Financeiro', 'en-US': 'Financial Result', 'es-ES': 'Resultado Financiero' },
    'impostos_lucro': { 'pt-BR': 'IRPJ / CSLL', 'en-US': 'Income Tax / Social Contribution', 'es-ES': 'Impuesto a las Ganancias' },
    'lucro_liquido': { 'pt-BR': 'Lucro Líquido', 'en-US': 'Net Profit', 'es-ES': 'Utilidad Neta' },
    'ativo_circulante': { 'pt-BR': 'Ativo Circulante', 'en-US': 'Current Assets', 'es-ES': 'Activo Circulante' },
    'passivo_circulante': { 'pt-BR': 'Passivo Circulante', 'en-US': 'Current Liabilities', 'es-ES': 'Pasivo Circulante' },
    'estoque': { 'pt-BR': 'Estoque', 'en-US': 'Inventory', 'es-ES': 'Inventario' },
    'contas_receber': { 'pt-BR': 'Contas a Receber', 'en-US': 'Accounts Receivable', 'es-ES': 'Cuentas por Cobrar' },
    'contas_pagar': { 'pt-BR': 'Contas a Pagar', 'en-US': 'Accounts Payable', 'es-ES': 'Cuentas por Pagar' },
    'disponibilidades': { 'pt-BR': 'Caixa e Equivalentes', 'en-US': 'Cash & Equivalents', 'es-ES': 'Caja y Equivalentes' },
    'patrimonio_liquido': { 'pt-BR': 'Patrimônio Líquido', 'en-US': 'Net Equity', 'es-ES': 'Patrimonio Neto' },
    'roic': { 'pt-BR': 'ROIC (Retorno s/ Cap. Investido)', 'en-US': 'ROIC (Return on Invested Capital)', 'es-ES': 'ROIC (Retorno sobre Cap. Invertido)' },
    'wacc': { 'pt-BR': 'WACC (Custo de Capital)', 'en-US': 'WACC (Cost of Capital)', 'es-ES': 'WACC (Costo de Capital)' },
    'dscr': { 'pt-BR': 'DSCR (Cobertura de Dívida)', 'en-US': 'DSCR (Debt Service Coverage Ratio)', 'es-ES': 'DSCR (Cobertura de Servicio de Deuda)' },
    'vwc_days': { 'pt-BR': 'Ciclo Financeiro (Dias)', 'en-US': 'Financial Cycle (Days)', 'es-ES': 'Ciclo Financiero (Días)' },
    'cac_ltv': { 'pt-BR': 'LTV / CAC', 'en-US': 'LTV / CAC', 'es-ES': 'LTV / CAC' },
    'burn_rate': { 'pt-BR': 'Cash Burn Rate', 'en-US': 'Cash Burn Rate', 'es-ES': 'Tasa de Consumo de Caja' },
  };
  return map[key]?.[lang] || map[key]?.['pt-BR'] || key;
};

const getCategoryTranslation = (cat: string, lang: string) => {
  const map: Record<string, Record<string, string>> = {
    'Performance': { 'pt-BR': 'Performance', 'en-US': 'Performance', 'es-ES': 'Rendimiento' },
    'Lucratividade': { 'pt-BR': 'Lucratividade', 'en-US': 'Profitability', 'es-ES': 'Rentabilidad' },
    'Operacional': { 'pt-BR': 'Operacional', 'en-US': 'Operational', 'es-ES': 'Operativo' },
    'Financeiro': { 'pt-BR': 'Financeiro', 'en-US': 'Financial', 'es-ES': 'Financiero' },
    'Liquidez': { 'pt-BR': 'Liquidez', 'en-US': 'Liquidity', 'es-ES': 'Liquidez' },
    'Atividade': { 'pt-BR': 'Atividade', 'en-US': 'Activity', 'es-ES': 'Actividad' },
    'Caixa': { 'pt-BR': 'Caixa', 'en-US': 'Cash', 'es-ES': 'Caja' },
    'Patrimonial': { 'pt-BR': 'Patrimonial', 'en-US': 'Equity', 'es-ES': 'Patrimonial' },
    'Estratégico': { 'pt-BR': 'Estratégico', 'en-US': 'Strategic', 'es-ES': 'Estratégico' },
    'Risco': { 'pt-BR': 'Risco', 'en-US': 'Risk', 'es-ES': 'Riesgo' },
    'Eficiência': { 'pt-BR': 'Eficiência', 'en-US': 'Efficiency', 'es-ES': 'Eficiencia' },
    'Crescimento': { 'pt-BR': 'Crescimento', 'en-US': 'Growth', 'es-ES': 'Crecimiento' },
    'Venture': { 'pt-BR': 'Venture', 'en-US': 'Venture', 'es-ES': 'Venture' },
  };
  return map[cat]?.[lang] || map[cat]?.['pt-BR'] || cat;
};

const RAW_SYSTEM_KPI_CATEGORIES = [
  { id: 'faturamento_bruto', label: 'Faturamento Bruto', cat: 'Performance' },
  { id: 'receita_liquida', label: 'Receita Líquida', cat: 'Performance' },
  { id: 'deducoes', label: 'Deduções e Impostos', cat: 'Performance' },
  { id: 'custos_variaveis', label: 'Custos Variáveis / CMV', cat: 'Performance' },
  { id: 'margem_contribuicao', label: 'Margem de Contribuição', cat: 'Lucratividade' },
  { id: 'despesas_pessoal', label: 'Despesas com Pessoal', cat: 'Operacional' },
  { id: 'despesas_operacionais', label: 'Despesas Operacionais (G&A)', cat: 'Operacional' },
  { id: 'marketing_vendas', label: 'Marketing e Vendas', cat: 'Operacional' },
  { id: 'ebitda', label: 'EBITDA', cat: 'Performance' },
  { id: 'depreciacao', label: 'Depreciação e Amortização', cat: 'Operacional' },
  { id: 'resultado_financeiro', label: 'Resultado Financeiro', cat: 'Financeiro' },
  { id: 'impostos_lucro', label: 'IRPJ / CSLL', cat: 'Performance' },
  { id: 'lucro_liquido', label: 'Lucro Líquido', cat: 'Performance' },
  { id: 'ativo_circulante', label: 'Ativo Circulante', cat: 'Liquidez' },
  { id: 'passivo_circulante', label: 'Passivo Circulante', cat: 'Liquidez' },
  { id: 'estoque', label: 'Estoque', cat: 'Atividade' },
  { id: 'contas_receber', label: 'Contas a Receber', cat: 'Atividade' },
  { id: 'contas_pagar', label: 'Contas a Pagar', cat: 'Atividade' },
  { id: 'disponibilidades', label: 'Caixa e Equivalentes', cat: 'Caixa' },
  { id: 'patrimonio_liquido', label: 'Patrimônio Líquido', cat: 'Patrimonial' },
  { id: 'roic', label: 'ROIC (Retorno s/ Cap. Investido)', cat: 'Estratégico' },
  { id: 'wacc', label: 'WACC (Custo de Capital)', cat: 'Estratégico' },
  { id: 'dscr', label: 'DSCR (Cobertura de Dívida)', cat: 'Risco' },
  { id: 'vwc_days', label: 'Ciclo Financeiro (Dias)', cat: 'Eficiência' },
  { id: 'cac_ltv', label: 'LTV / CAC', cat: 'Crescimento' },
  { id: 'burn_rate', label: 'Cash Burn Rate', cat: 'Venture' },
];

export const SYSTEM_KPI_CATEGORIES = new Proxy(RAW_SYSTEM_KPI_CATEGORIES, {
  get(target, prop) {
    if (prop === 'map' || prop === 'filter' || prop === 'find') {
      const lang = getActiveLanguage();
      const mapped = target.map(item => ({
        ...item,
        get label() { return getTranslation(item.id, lang); },
        get cat() { return getCategoryTranslation(item.cat, lang); }
      }));
      return (mapped as any)[prop].bind(mapped);
    }
    const idx = Number(prop);
    if (!isNaN(idx) && idx >= 0 && idx < target.length) {
      const item = target[idx];
      const lang = getActiveLanguage();
      return {
        ...item,
        get label() { return getTranslation(item.id, lang); },
        get cat() { return getCategoryTranslation(item.cat, lang); }
      };
    }
    return (target as any)[prop];
  }
}) as any;

const MONTH_NAMES_PT: Record<number, string> = {
  1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
};
const MONTH_NAMES_EN: Record<number, string> = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
};
const MONTH_NAMES_ES: Record<number, string> = {
  1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
};

export const MONTH_LABELS = new Proxy({}, {
  get(_, prop) {
    const monthNum = Number(prop);
    const lang = getActiveLanguage();
    if (lang === 'en-US') return MONTH_NAMES_EN[monthNum] || '';
    if (lang === 'es-ES') return MONTH_NAMES_ES[monthNum] || '';
    return MONTH_NAMES_PT[monthNum] || '';
  },
  ownKeys() {
    return Array.from({ length: 12 }, (_, i) => String(i + 1));
  },
  getOwnPropertyDescriptor(_, prop) {
    return {
      enumerable: true,
      configurable: true,
      value: this.get!(_, prop, null as any)
    };
  }
}) as Record<number, string>;

const FULL_MONTH_NAMES_PT: Record<number, string> = {
  1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho',
  7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
};
const FULL_MONTH_NAMES_EN: Record<number, string> = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
  7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
};
const FULL_MONTH_NAMES_ES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
  7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

export const FULL_MONTH_LABELS = new Proxy({}, {
  get(_, prop) {
    const monthNum = Number(prop);
    const lang = getActiveLanguage();
    if (lang === 'en-US') return FULL_MONTH_NAMES_EN[monthNum] || '';
    if (lang === 'es-ES') return FULL_MONTH_NAMES_ES[monthNum] || '';
    return FULL_MONTH_NAMES_PT[monthNum] || '';
  },
  ownKeys() {
    return Array.from({ length: 12 }, (_, i) => String(i + 1));
  },
  getOwnPropertyDescriptor(_, prop) {
    return {
      enumerable: true,
      configurable: true,
      value: this.get!(_, prop, null as any)
    };
  }
}) as Record<number, string>;

const AXES_PT = [
  'Governança Corporativa',
  'Cultura Organizacional',
  'Administração e Finanças',
  'Gestão de Inovação',
  'Gestão de Marketing',
  'Gestão Comercial',
  'Gestão Operacional'
];

const AXES_EN = [
  'Corporate Governance',
  'Organizational Culture',
  'Administration and Finance',
  'Innovation Management',
  'Marketing Management',
  'Sales Management',
  'Operational Management'
];

const AXES_ES = [
  'Gobernanza Corporativa',
  'Cultura Organizacional',
  'Administración y Finanzas',
  'Gestión de Innovación',
  'Gestión de Marketing',
  'Gestión Comercial',
  'Gestión Operacional'
];

export const EIXOS_ORDEM = new Proxy(AXES_PT, {
  get(target, prop) {
    const lang = getActiveLanguage();
    const activeList = lang === 'en-US' ? AXES_EN : lang === 'es-ES' ? AXES_ES : AXES_PT;
    if (typeof (activeList as any)[prop] === 'function') {
      return (activeList as any)[prop].bind(activeList);
    }
    return (activeList as any)[prop];
  }
}) as any;

