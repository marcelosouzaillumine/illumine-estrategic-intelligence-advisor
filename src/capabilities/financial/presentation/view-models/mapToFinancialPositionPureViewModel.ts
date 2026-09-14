import { PatrimonialIndicator } from '../../../../capabilities/runtime/governance/bp/BalanceSheetFinancialMetricsEngine';
import { FinancialPositionPureViewModel, FinancialIndicator } from '../../../../core/experience/contracts/FinancialPositionPureViewModel';
import { BalanceSheetExecutiveViewModel } from '../../../../types/executive/BalanceSheetExecutiveViewModel';

// `FinancialOverviewRoot`, `FinancialDiagnosisRoot`, `FinancialSignalsRoot`,
// `HistoricalEvolutionRoot`, `ExecutiveQuestionsRoot` and `TechnicalEvidenceRoot`
// (rendered by ExecutiveProductRenderer via FinancialPositionProduct's layers)
// are the only thing BalanceSheetPage actually renders when data is present —
// the BalanceSheet*Section components imported alongside them are unused.
// Those roots expect FinancialPositionPureViewModel, which used to come from
// the now-deleted FinancialPositionPureViewModelBuilder. This maps the same
// real indicators BalanceSheetFinancialMetricsEngine already computes (no
// recomputation, no fabricated numbers) into that shape.

const FAMILY_TO_DIAGNOSIS_BUCKET: Record<string, keyof FinancialPositionPureViewModel['diagnosis']> = {
  'Liquidez': 'liquidity',
  'Capital de Giro': 'workingCapital',
  'Estrutura de Capital': 'solvencyAndCapitalStructure',
  'Imobilização': 'assetQuality'
};

function mapSeverityToSignalSeverity(severity: string): 'informational' | 'attention' | 'critical' {
  if (['CRITICAL', 'TREASURY_STRESS'].includes(severity)) return 'critical';
  if (['ATTENTION', 'SHORT_TERM_PRESSURE', 'CAPITAL_IDLE_WARNING'].includes(severity)) return 'attention';
  return 'informational';
}

function mapSeverityToMateriality(severity: string): 'low' | 'moderate' | 'high' | 'critical' {
  if (['CRITICAL', 'TREASURY_STRESS'].includes(severity)) return 'critical';
  if (['ATTENTION', 'SHORT_TERM_PRESSURE'].includes(severity)) return 'high';
  if (['CAPITAL_IDLE_WARNING'].includes(severity)) return 'moderate';
  return 'low';
}

function mapFamilyToCategory(family: string): 'liquidity' | 'capital_structure' | 'working_capital' | 'solvency' | 'asset_quality' | 'debt_structure' | 'financial_stress' {
  if (family === 'Liquidez') return 'liquidity';
  if (family === 'Estrutura de Capital') return 'capital_structure';
  if (family === 'Capital de Giro') return 'working_capital';
  if (family === 'Imobilização') return 'asset_quality';
  if (family === 'Rentabilidade Patrimonial') return 'solvency';
  return 'financial_stress';
}

const FORMULA_MAP: Record<string, string> = {
  'Liquidez Corrente': 'AC / PC',
  'Liquidez Seca': '(AC − Estoques) / PC',
  'Liquidez Imediata': 'Caixa / PC',
  'Liquidez Geral': '(AC + RLP) / (PC + PNC)',
  'Capital de Giro Líquido': 'AC − PC',
  'Necessidade de Capital de Giro': '(Clientes + Estoques) − Obrig. Operacionais',
  'Saldo de Tesouraria': 'CGL − NCG',
  'Endividamento Geral': 'Passivo Total / Ativo Total',
  'Dependência de Capital de Terceiros': 'Passivo Total / PL',
  'Debt-to-Equity': 'Passivo Total / PL',
  'Financial Debt-to-Equity': 'Passivos Financeiros / PL',
  'Autonomia Financeira': 'PL / Ativo Total',
  'Composição do Endividamento': 'PC / Passivo Total',
  'Imobilização do Patrimônio Líquido': 'Ativo Permanente / PL',
  'Imobilização dos Recursos Não Correntes': 'Ativo Permanente / (PL + PNC)',
  'Dívida Líquida (Net Debt)': 'Passivos Financeiros − Caixa',
  'ROA — Retorno sobre Ativos': 'Lucro Líquido / Ativo Total',
  'ROE — Retorno sobre PL': 'Lucro Líquido / PL',
};

const CLASSIFICATION_PT: Record<string, string> = {
  'HEALTHY': 'Saudável',
  'CRITICAL': 'Crítico',
  'ATTENTION': 'Atenção',
  'TREASURY_STRESS': 'Estresse de Tesouraria',
  'SHORT_TERM_PRESSURE': 'Pressão de Curto Prazo',
  'CAPITAL_IDLE_WARNING': 'Capital Ocioso',
  'NEUTRAL': 'Neutro',
  'POSITIVE_TREASURY': 'Posição Credora',
  'MONITORING': 'Monitoramento',
  'INSUFFICIENT_DATA': 'Dados Insuficientes',
};

const SEVERITY_BADGE: Record<string, string> = {
  'CRITICAL': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  'TREASURY_STRESS': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  'SHORT_TERM_PRESSURE': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  'ATTENTION': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  'CAPITAL_IDLE_WARNING': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  'MONITORING': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  'NEUTRAL': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
  'HEALTHY': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  'POSITIVE_TREASURY': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
};

function fmtIndicatorValue(value: number, format: string): string {
  if (format === 'currency') return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  if (format === 'percentage') return `${(value * 100).toFixed(1)}%`;
  if (format === 'multiplier') return `${value.toFixed(2)}×`;
  return value.toFixed(2);
}

function buildFamilies(indicators: PatrimonialIndicator[]): Array<{ familyName: string; indicators: any[] }> {
  const byFamily = new Map<string, PatrimonialIndicator[]>();
  for (const ind of indicators) {
    if (!byFamily.has(ind.family)) byFamily.set(ind.family, []);
    byFamily.get(ind.family)!.push(ind);
  }
  return Array.from(byFamily.entries()).map(([familyName, inds]) => ({
    familyName,
    indicators: inds.map(i => ({
      label: i.metricName,
      formula: FORMULA_MAP[i.metricName] || '—',
      value: typeof i.value === 'number' ? i.value : null,
      formattedValue: typeof i.value === 'number'
        ? fmtIndicatorValue(i.value, i.format)
        : (i.value === 'INSUFFICIENT_DATA' ? 'Não aplicável' : String(i.value)),
      classificationLabel: CLASSIFICATION_PT[i.classification] || i.classification,
      badgeClass: SEVERITY_BADGE[i.severity] || SEVERITY_BADGE[i.classification] || 'bg-gray-100 text-gray-700 border-gray-200',
      severity: i.severity,
      purpose: i.rationale,
      limitations: '',
      referenceRange: '',
      methodologicalNotes: ''
    }))
  }));
}

const fmtCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function buildOverviewEvidence(usable: PatrimonialIndicator[], concerning: PatrimonialIndicator[], healthy: PatrimonialIndicator[]): string {
  const total = usable.length;
  const criticalCount = concerning.filter(i => ['CRITICAL', 'TREASURY_STRESS', 'SHORT_TERM_PRESSURE'].includes(i.severity)).length;

  let verdict = criticalCount > 0
    ? `${criticalCount} indicador${criticalCount > 1 ? 'es' : ''} em zona crítica de ${total} avaliados`
    : concerning.length > 0
      ? `${healthy.length} de ${total} indicadores saudáveis — ${concerning.length} em atenção`
      : `${healthy.length} de ${total} indicadores em zona saudável`;

  const highlights: string[] = [];

  const lc = usable.find(i => i.metricName === 'Liquidez Corrente');
  if (lc && typeof lc.value === 'number') {
    if (lc.value > 3) highlights.push(`liquidez corrente excepcional (${lc.value.toFixed(1)}×)`);
    else if (lc.value < 1) highlights.push(`liquidez corrente abaixo do mínimo (${lc.value.toFixed(2)}×)`);
  }

  const af = usable.find(i => i.metricName === 'Autonomia Financeira');
  if (af && typeof af.value === 'number') {
    if (af.value > 0.7) highlights.push(`autonomia financeira de ${(af.value * 100).toFixed(0)}%`);
    else if (af.value < 0.3) highlights.push(`dependência crítica de capital externo (autonomia ${(af.value * 100).toFixed(0)}%)`);
  }

  const nd = usable.find(i => i.metricName === 'Dívida Líquida (Net Debt)');
  if (nd && typeof nd.value === 'number') {
    if (nd.value < 0) highlights.push(`posição credora líquida (${fmtCurrency.format(Math.abs(nd.value))})`);
    else if (nd.value > 0) highlights.push(`dívida financeira líquida de ${fmtCurrency.format(nd.value)}`);
  }

  const st = usable.find(i => i.metricName === 'Saldo de Tesouraria');
  if (st && typeof st.value === 'number' && st.value < 0) {
    highlights.push('tesouraria negativa — operação consome recursos de curto prazo');
  }

  let text = verdict;
  if (highlights.length > 0) text += `. Destaques: ${highlights.join(', ')}.`;

  const attentionFlags = concerning.filter(i => !['ROA — Retorno sobre Ativos', 'ROE — Retorno sobre PL'].includes(i.metricName));
  if (attentionFlags.length > 0) text += ` Atenção: ${attentionFlags.map(i => i.metricName).join(', ')}.`;

  return text;
}

function buildFinancialMeaning(usable: PatrimonialIndicator[], concerning: PatrimonialIndicator[], overallHealth: string): string {
  if (usable.length === 0) return 'Dados insuficientes para diagnóstico patrimonial.';

  const af = usable.find(i => i.metricName === 'Autonomia Financeira');
  const nd = usable.find(i => i.metricName === 'Dívida Líquida (Net Debt)');
  const cgl = usable.find(i => i.metricName === 'Capital de Giro Líquido');

  if (overallHealth === 'HEALTHY' && concerning.length === 0) {
    if (af && typeof af.value === 'number' && af.value > 0.7 && nd && typeof nd.value === 'number' && nd.value < 0) {
      return 'Estrutura conservadora e autossuficiente: sem dívida financeira líquida e base de capital próprio dominante. O risco de solvência é mínimo. O desafio estratégico é alocar o excesso de liquidez em crescimento produtivo sem elevar a exposição a riscos desnecessários.';
    }
    return 'Todos os indicadores patrimoniais dentro de faixas saudáveis. A organização tem capacidade de honrar compromissos e financiar crescimento com capital próprio no horizonte atual.';
  }

  if (overallHealth === 'CRITICAL') {
    const criticals = concerning.filter(i => ['CRITICAL', 'TREASURY_STRESS', 'SHORT_TERM_PRESSURE'].includes(i.severity));
    return `Situação patrimonial crítica: ${criticals.map(i => i.metricName).join(', ')}. Intervenção imediata necessária para garantir continuidade operacional.`;
  }

  const cglWarning = cgl && typeof cgl.value === 'number' && cgl.value < 0 ? ' O capital de giro líquido negativo indica que passivos de curto prazo financiam ativos de longa maturação.' : '';
  return `Posição patrimonial com pontos de atenção em ${concerning.map(i => i.metricName).join(', ')}.${cglWarning} Monitoramento contínuo é indicado.`;
}

function buildStructuralTables(comparativeRows: any[]): { isEmpty: boolean; sections: any[] } {
  const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  const toSection = (titleLabel: string, tone: 'assets' | 'liabilities' | 'equity', filter: (r: any) => boolean) => {
    const rows = comparativeRows
      .filter(filter)
      .map(r => ({
        label: r.name || r.conta || r.category || '',
        valueFormatted: fmt.format(r.val || 0),
        verticalAnalysis: typeof r.av === 'number' && isFinite(r.av) ? r.av : null,
        horizontalAnalysis: typeof r.ah === 'number' && isFinite(r.ah) ? r.ah : null,
        level: r.level || 1
      }));
    return { titleLabel, tone, rows };
  };

  const typeOf = (r: any) => (r.tipo || r.type || r.entryType || '').toLowerCase();

  const sections = [
    toSection('Ativo', 'assets', r => typeOf(r).includes('ativo')),
    toSection('Passivo', 'liabilities', r => typeOf(r).includes('passivo') && !typeOf(r).includes('patrimônio') && !typeOf(r).includes('pl')),
    toSection('Patrimônio Líquido', 'equity', r => typeOf(r).includes('patrimônio') || typeOf(r).includes('pl'))
  ].filter(s => s.rows.length > 0);

  return { isEmpty: sections.length === 0, sections };
}

function isConcerning(severity: string): boolean {
  return ['CRITICAL', 'ATTENTION', 'TREASURY_STRESS', 'SHORT_TERM_PRESSURE'].includes(severity);
}

function toFinancialIndicator(ind: PatrimonialIndicator): FinancialIndicator {
  return {
    code: ind.metricName,
    name: ind.metricName,
    value: ind.value,
    classification: ind.classification,
    observation: ind.rationale,
    evidence: JSON.stringify(ind.evidence ?? {}),
    financialMeaning: ind.rationale,
    formattedValue: typeof ind.value === 'number'
      ? fmtIndicatorValue(ind.value, ind.format)
      : (ind.value === 'INSUFFICIENT_DATA' ? '—' : String(ind.value)),
    availability: ind.value === 'INSUFFICIENT_DATA' ? 'INSUFFICIENT_DATA' : 'AVAILABLE'
  };
}

function buildHistoricalEvolution(historicalSeries: any[] | undefined) {
  const available = !!historicalSeries && historicalSeries.length > 1;

  if (!available) {
    return {
      available: false,
      periodCoverage: { firstYear: 0, lastYear: 0 },
      trajectory: { confidence: 'low' as const, classification: 'stable' as const, explanation: 'Série histórica insuficiente para análise de trajetória.' },
      movements: [],
      executiveContext: { implication: 'Dados históricos insuficientes para análise de evolução patrimonial.' },
      chartData: []
    };
  }

  const years: number[] = historicalSeries.map((s: any) => s.year ?? s.period ?? 0).filter(Boolean).sort();
  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  const first = historicalSeries.find((s: any) => (s.year ?? s.period) === firstYear);
  const last = historicalSeries.find((s: any) => (s.year ?? s.period) === lastYear);

  const ativoFirst: number = first?.bp?.ativoTotal ?? 0;
  const ativoLast: number = last?.bp?.ativoTotal ?? 0;
  const plFirst: number = first?.bp?.patrimonioLiquido ?? 0;
  const plLast: number = last?.bp?.patrimonioLiquido ?? 0;

  const ativoChange = ativoFirst !== 0 ? (ativoLast - ativoFirst) / Math.abs(ativoFirst) : 0;
  const plChange = plFirst !== 0 ? (plLast - plFirst) / Math.abs(plFirst) : 0;

  let classification: 'strengthening' | 'stable' | 'deteriorating';
  let explanation: string;

  if (ativoChange > 0.05 && plChange > 0.0) {
    classification = 'strengthening';
    explanation = `Ativo total cresceu ${(ativoChange * 100).toFixed(1)}% e PL cresceu ${(plChange * 100).toFixed(1)}% entre ${firstYear} e ${lastYear}, indicando expansão com geração de valor patrimonial.`;
  } else if (plChange < -0.1 || (ativoChange < -0.05)) {
    classification = 'deteriorating';
    explanation = `Houve retração patrimonial no período — ativo ${ativoChange >= 0 ? `+${(ativoChange * 100).toFixed(1)}` : (ativoChange * 100).toFixed(1)}%, PL ${plChange >= 0 ? `+${(plChange * 100).toFixed(1)}` : (plChange * 100).toFixed(1)}% entre ${firstYear} e ${lastYear}.`;
  } else {
    classification = 'stable';
    explanation = `Estrutura patrimonial mantida com variação contida entre ${firstYear} e ${lastYear} — ativo ${ativoChange >= 0 ? `+${(ativoChange * 100).toFixed(1)}` : (ativoChange * 100).toFixed(1)}%.`;
  }

  const confidence: 'low' | 'medium' | 'high' = years.length >= 4 ? 'high' : years.length >= 2 ? 'medium' : 'low';

  const chartData = historicalSeries.map((s: any) => ({
    year: s.year ?? s.period,
    ativo: s.bp?.ativoTotal ?? 0,
    passivo: s.bp?.passivoTotal ?? 0,
    pl: s.bp?.patrimonioLiquido ?? 0,
  })).sort((a: any, b: any) => a.year - b.year);

  const movements = [];
  if (ativoFirst !== 0 && ativoLast !== 0) {
    movements.push({
      metric: 'Ativo Total',
      period: `${firstYear} → ${lastYear}`,
      variation: { percentage: parseFloat((ativoChange * 100).toFixed(1)) },
      interpretation: ativoChange > 0 ? 'Crescimento da base de ativos.' : 'Contração da base de ativos.'
    });
  }
  if (plFirst !== 0 && plLast !== 0) {
    movements.push({
      metric: 'Patrimônio Líquido',
      period: `${firstYear} → ${lastYear}`,
      variation: { percentage: parseFloat((plChange * 100).toFixed(1)) },
      interpretation: plChange > 0 ? 'Acumulação de valor patrimonial.' : 'Erosão do patrimônio líquido.'
    });
  }

  return {
    available: true,
    periodCoverage: { firstYear, lastYear },
    trajectory: { confidence, classification, explanation },
    movements,
    executiveContext: { implication: `Série histórica de ${years.length} período(s) disponível. Análise baseada em dados reais de ${firstYear} a ${lastYear}.` },
    chartData
  };
}

const EVIDENCE_KEY_PT: Record<string, string | null> = {
  LucroLiquido: 'Lucro Líquido',
  AtivoTotal: 'Ativo Total',
  PL: 'Patrimônio Líquido',
  AC: 'Ativo Circulante',
  PC: 'Passivo Circulante',
  PassivoTotal: 'Passivo Total',
  Caixa: 'Caixa',
  Estoques: 'Estoques',
  Clientes: 'Clientes',
  RLP: 'Realizável a Longo Prazo',
  PNC: 'Passivo Não Circulante',
  Liquidez: null,
  hasLongTermData: null,
  Endividamento: null,
};

const CURRENCY_EVIDENCE_KEYS = new Set(['LucroLiquido', 'AtivoTotal', 'PL', 'AC', 'PC', 'PassivoTotal', 'Caixa', 'Estoques', 'Clientes', 'RLP', 'PNC']);

const fmt2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function buildEvidenceText(ind: PatrimonialIndicator): string {
  if (!ind.evidence) return ind.metricName;
  const parts = Object.entries(ind.evidence)
    .filter(([k]) => EVIDENCE_KEY_PT[k] !== null)
    .map(([k, v]) => {
      const label = EVIDENCE_KEY_PT[k] || k;
      if (typeof v === 'number') {
        return `${label}: ${CURRENCY_EVIDENCE_KEYS.has(k) ? fmt2.format(v) : (v * 1).toFixed(2)}`;
      }
      return null;
    })
    .filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : ind.metricName;
}

function buildInterpretationText(ind: PatrimonialIndicator): string {
  const val = typeof ind.value === 'number' ? ind.value : null;
  const fmt = val !== null ? fmtIndicatorValue(val, ind.format) : '—';

  if (ind.metricName === 'ROA — Retorno sobre Ativos' && val !== null) {
    if (val < -0.5) return `ROA de ${fmt}: para cada R$ 1,00 de ativo, a empresa consome R$ ${Math.abs(val).toFixed(2)} em prejuízo — destruição severa de valor operacional. Investigar estrutura de custos e adequação da base de receitas.`;
    if (val < 0) return `ROA negativo (${fmt}): os ativos não estão gerando retorno suficiente. Revisar eficiência operacional e estrutura de custos.`;
    if (val > 0.15) return `ROA de ${fmt}: retorno sobre ativos acima da média — eficiência operacional elevada.`;
  }
  if (ind.metricName === 'ROE — Retorno sobre PL' && val !== null) {
    if (val < -0.5) return `ROE de ${fmt}: o patrimônio dos sócios está sendo corroído a ritmo acelerado. Para cada R$ 1,00 de capital próprio, R$ ${Math.abs(val).toFixed(2)} são destruídos no período — risco de insolvência patrimonial.`;
    if (val < 0) return `ROE negativo (${fmt}): capital próprio não está gerando retorno. Requer análise de alavancagem operacional e estrutura de receitas.`;
  }
  if (ind.metricName === 'Saldo de Tesouraria' && val !== null && val < 0) {
    return `Saldo de Tesouraria negativo (${fmt}): a necessidade de capital de giro supera a folga financeira disponível — a operação está dependendo de fontes de curto prazo para financiar o ciclo operacional. Risco de liquidez imediata.`;
  }
  if (ind.metricName === 'Capital de Giro Líquido' && val !== null && val < 0) {
    return `CGL negativo (${fmt}): passivos de curto prazo superam ativos circulantes — a empresa financia ativos de longo prazo com dívidas de curto prazo. Risco de refinanciamento e descontinuidade operacional.`;
  }
  if (ind.severity === 'CRITICAL' || ind.severity === 'TREASURY_STRESS') {
    return `${ind.metricName} em nível crítico (${fmt}): ${ind.rationale} Requer análise e intervenção imediata.`;
  }
  if (ind.severity === 'ATTENTION' || ind.severity === 'SHORT_TERM_PRESSURE') {
    return `${ind.metricName} em nível de atenção (${fmt}): ${ind.rationale} Monitoramento contínuo é necessário.`;
  }
  return ind.rationale;
}

export function mapToFinancialPositionPureViewModel(
  indicators: PatrimonialIndicator[],
  historicalSeries: any[] | undefined,
  canonicalViewModel?: BalanceSheetExecutiveViewModel | null,
  comparativeRows?: any[]
): FinancialPositionPureViewModel {
  const usable = indicators.filter(i => i.value !== 'INSUFFICIENT_DATA');
  const concerning = usable.filter(i => isConcerning(i.severity));
  const healthy = usable.filter(i => !isConcerning(i.severity));

  const overallHealth = canonicalViewModel?.strategicSeverity || (
    concerning.some(i => i.severity === 'CRITICAL' || i.severity === 'TREASURY_STRESS')
      ? 'CRITICAL'
      : concerning.length > 0
        ? 'ATTENTION'
        : usable.length > 0
          ? 'HEALTHY'
          : 'INSUFFICIENT_DATA'
  );
  const narrativeReason = canonicalViewModel?.strategicSeverityReason;
  const executiveOpinion = canonicalViewModel?.executiveOpinion;
  const criticalFactor = canonicalViewModel?.criticalFactor;

  const avgConfidence = usable.length > 0
    ? usable.reduce((s, i) => s + (i.confidence || 0), 0) / usable.length
    : 0;
  const confidenceLabel = avgConfidence >= 85 ? 'HIGH' : avgConfidence >= 60 ? 'MEDIUM' : 'LOW';

  const diagnosis: FinancialPositionPureViewModel['diagnosis'] = {
    liquidity: [],
    solvencyAndCapitalStructure: [],
    workingCapital: [],
    assetQuality: []
  };
  for (const ind of indicators) {
    const bucket = FAMILY_TO_DIAGNOSIS_BUCKET[ind.family];
    if (bucket) diagnosis[bucket].push(toFinancialIndicator(ind));
  }

  const signalItems = concerning.map(ind => ({
    id: ind.lineageHash,
    category: mapFamilyToCategory(ind.family),
    severity: mapSeverityToSignalSeverity(ind.severity),
    materiality: mapSeverityToMateriality(ind.severity),
    persistence: 'unknown' as const,
    horizon: 'unknown' as const,
    confidence: 'high' as const,
    observation: { text: ind.rationale },
    evidence: { text: buildEvidenceText(ind) },
    interpretation: { text: buildInterpretationText(ind) },
    sourceMetric: { name: ind.metricName, value: typeof ind.value === 'number' ? fmtIndicatorValue(ind.value, ind.format) : String(ind.value) }
  }));

  const signals = {
    state: signalItems.length > 0 ? 'AVAILABLE' : 'AVAILABLE_EMPTY',
    items: signalItems
  };

  const evidenceRows = indicators.filter(i => typeof i.value === 'number');
  const technicalEvidence = {
    available: evidenceRows.length > 0,
    items: evidenceRows.map(i => ({ item: i.metricName, value: i.value as number, type: i.format })),
    families: buildFamilies(indicators),
    rows: evidenceRows.map(i => ({ name: i.metricName, value: i.value as number })),
    structuralTables: comparativeRows && comparativeRows.length > 0
      ? buildStructuralTables(comparativeRows)
      : { isEmpty: true, sections: [] }
  };

  const historicalAvailable = !!historicalSeries && historicalSeries.length > 0;

  return {
    executiveSummary: {
      available: usable.length > 0,
      status: {
        classification: overallHealth,
        narrative: executiveOpinion || (usable.length > 0
          ? `${healthy.length} de ${usable.length} indicadores patrimoniais dentro da faixa saudável.`
          : 'Dados patrimoniais insuficientes para diagnóstico.')
      },
      strengths: healthy.map(i => i.metricName),
      attentionPoints: concerning.map(i => i.metricName),
      centralQuestion: {
        question: criticalFactor || (concerning.length > 0
          ? `O que está pressionando ${concerning[0].metricName.toLowerCase()}?`
          : 'A estrutura patrimonial atual sustenta o próximo ciclo de crescimento?')
      }
    },
    score: {
      available: usable.length > 0,
      overall: {
        value: Math.round(avgConfidence),
        classification: overallHealth,
        finalStatus: overallHealth,
        confidence: confidenceLabel,
        explanation: `Composto pela confiança média (${avgConfidence.toFixed(0)}%) dos ${usable.length} indicadores calculados.`,
        structuralEvents: []
      },
      dimensions: {
        liquidity: diagnosis.liquidity,
        solvencyAndCapitalStructure: diagnosis.solvencyAndCapitalStructure,
        workingCapital: diagnosis.workingCapital,
        assetQuality: diagnosis.assetQuality,
        evolution: historicalAvailable ? historicalSeries : []
      },
      methodology: 'BalanceSheetFinancialMetricsEngine (governance/bp) — thresholds fixos por família de indicador.'
    },
    overview: {
      healthStatus: overallHealth,
      confidence: confidenceLabel,
      drivers: concerning.map(i => i.metricName),
      observation: usable.length > 0
        ? `Diagnóstico baseado em ${usable.length} indicadores calculados sobre dados reais — liquidez, estrutura de capital, capital de giro e imobilização.`
        : 'Sem dados patrimoniais suficientes para diagnóstico.',
      evidence: usable.length > 0
        ? buildOverviewEvidence(usable, concerning, healthy)
        : 'Sem indicadores patrimoniais calculados.',
      financialMeaning: narrativeReason || buildFinancialMeaning(usable, concerning, overallHealth)
    },
    diagnosis,
    signals,
    historicalEvolution: buildHistoricalEvolution(historicalSeries),
    executiveQuestions: {
      available: concerning.length > 0,
      items: concerning.map(i => ({
        id: i.lineageHash,
        question: `O que está pressionando ${i.metricName.toLowerCase()}?`,
        context: `Indicador ${i.metricName} classificado como ${i.classification}.`,
        originSignalId: i.lineageHash,
        intent: (i.severity === 'CRITICAL' || i.severity === 'TREASURY_STRESS' ? 'investigate' : 'evaluate') as 'understand' | 'evaluate' | 'investigate'
      }))
    },
    technicalEvidence
  };
}
