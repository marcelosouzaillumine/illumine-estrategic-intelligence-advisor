export const ExecutiveBusinessTerminologyRegistry: Record<string, string> = {
  'Equity Quality Index (EQI)': 'Qualidade do Patrimônio Líquido',
  'Equity Quality Index': 'Qualidade do Patrimônio Líquido',
  'Loss Absorption Capacity': 'Reserva Patrimonial para Choques',
  'Capital Erosion Velocity (CEV)': 'Velocidade de Erosão Patrimonial',
  'Capital Erosion Velocity': 'Velocidade de Erosão Patrimonial',
  'CEV': 'Velocidade de Erosão Patrimonial',
  'Debt-to-Equity': 'Relação Dívida / Patrimônio Líquido',
  'Financial Debt-to-Equity': 'Dívida Financeira / Patrimônio Líquido',
  'Asset Concentration Risk': 'Risco de Concentração de Ativos',
  'Survival Index': 'Índice de Sobrevivência Patrimonial',
  'Equity Buffer': 'Margem de Segurança Patrimonial',
  'Funding Capacity Ratio': 'Índice de Capacidade de Financiamento',
  'Debt Capacity Score': 'Índice de Capacidade de Endividamento',
  'Working Capital': 'Capital de Giro Líquido',
  'Current Ratio': 'Liquidez Corrente',
  'Quick Ratio': 'Liquidez Seca',
  'Cash Ratio': 'Liquidez Imediata',
  'HEALTHY': 'Saudável',
  'NEUTRAL': 'Neutro',
  'CAPITAL_IDLE_WARNING': 'Atenção a Capital Ocioso',
  'POSITIVE_TREASURY': 'Tesouraria Positiva',
  'N/A': 'Informação indisponível',
  'NaN': 'Informação indisponível',
  'INSUFFICIENT_DATA': 'Informação indisponível',
  'null': 'Informação indisponível',
  'undefined': 'Informação indisponível'
};

export class ExecutiveBusinessTerminologyTranslator {
  static translate(technicalName: string | null | undefined): string {
    if (!technicalName || typeof technicalName !== 'string') return 'Informação indisponível';
    const cleanName = technicalName.trim();
    if (['N/A', 'NaN', 'null', 'undefined', ''].includes(cleanName)) return 'Informação indisponível';
    return ExecutiveBusinessTerminologyRegistry[cleanName] || cleanName;
  }
}

export const ExecutiveBusinessTerminologyRegistryInstance = ExecutiveBusinessTerminologyTranslator;
