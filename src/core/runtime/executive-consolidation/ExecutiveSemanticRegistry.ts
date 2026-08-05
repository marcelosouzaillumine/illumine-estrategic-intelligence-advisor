export type ClassificationSeverity = 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'ROBUST';

export interface QuantitativeThreshold {
  min: number;
  max: number; // exclusivo
  label: string;
  severity: ClassificationSeverity;
}

export const BPLiquidityThresholds: QuantitativeThreshold[] = [
  { min: -Infinity, max: 0.8, label: 'Liquidez Crítica', severity: 'CRITICAL' },
  { min: 0.8, max: 1.0, label: 'Liquidez em Risco', severity: 'WARNING' },
  { min: 1.0, max: 1.5, label: 'Liquidez Adequada', severity: 'HEALTHY' },
  { min: 1.5, max: 2.5, label: 'Liquidez Confortável', severity: 'ROBUST' },
  { min: 2.5, max: Infinity, label: 'Liquidez Excedente', severity: 'ROBUST' }
];

export const BPAutonomyThresholds: QuantitativeThreshold[] = [
  { min: -Infinity, max: 0.15, label: 'Dependência Crítica', severity: 'CRITICAL' },
  { min: 0.15, max: 0.30, label: 'Alavancagem Elevada', severity: 'WARNING' },
  { min: 0.30, max: 0.50, label: 'Estrutura Equilibrada', severity: 'HEALTHY' },
  { min: 0.50, max: 0.70, label: 'Autonomia Sólida', severity: 'ROBUST' },
  { min: 0.70, max: Infinity, label: 'Estrutura Muito Sólida', severity: 'ROBUST' }
];

export const BPWorkingCapitalThresholds: QuantitativeThreshold[] = [
  { min: -Infinity, max: -0.1, label: 'Asfixia de Giro', severity: 'CRITICAL' },
  { min: -0.1, max: 0, label: 'Giro Pressionado', severity: 'WARNING' },
  { min: 0, max: 0.2, label: 'Giro Adequado', severity: 'HEALTHY' },
  { min: 0.2, max: Infinity, label: 'Giro Folgado', severity: 'ROBUST' }
];

export interface BPRecommendationFragment {
  dimension: 'Protection' | 'Liquidity' | 'CapitalStructure' | 'WorkingCapital' | 'AssetQuality' | 'CapitalEfficiency';
  trigger: (liquidity: number, autonomy: number, workingCapital: number) => boolean;
  executiveQuestion: string;
  rationaleSnippet: string;
  causalityMetric: 'Liquidez' | 'Autonomia' | 'Capital de Giro';
}

export const BPDimensionalCausalFragments: BPRecommendationFragment[] = [
  {
    dimension: 'Protection',
    causalityMetric: 'Liquidez',
    trigger: (liq) => liq < 0.8,
    executiveQuestion: 'Quais medidas de contingência devem ser acionadas para preservar caixa e alongar o perfil da dívida?',
    rationaleSnippet: 'a estrutura patrimonial é incapaz de absorver choques de curto prazo'
  },
  {
    dimension: 'Protection',
    causalityMetric: 'Autonomia',
    trigger: (liq, aut) => liq >= 1.5 && aut >= 0.50,
    executiveQuestion: 'A governança atual garante a eficiência na alocação deste caixa protegido?',
    rationaleSnippet: 'a estrutura patrimonial sustenta a operação com ampla segurança'
  },
  {
    dimension: 'Protection',
    causalityMetric: 'Liquidez',
    trigger: () => true, // Fallback
    executiveQuestion: 'A política atual é suficiente para conservar reservas adequadas às obrigações futuras?',
    rationaleSnippet: 'o nível de proteção sustenta a operação padrão'
  },

  {
    dimension: 'Liquidity',
    causalityMetric: 'Liquidez',
    trigger: (liq) => liq < 0.8,
    executiveQuestion: 'Quais saídas não essenciais podem ser suspensas e quais prazos podem ser renegociados?',
    rationaleSnippet: 'a liquidez imediata encontra-se em nível crítico de asfixia'
  },
  {
    dimension: 'Liquidity',
    causalityMetric: 'Liquidez',
    trigger: (liq) => liq >= 2.5,
    executiveQuestion: 'A liquidez excedente deve ser direcionada para reinvestimento, abatimento de dívida ou distribuição?',
    rationaleSnippet: 'as disponibilidades superam largamente a necessidade operacional'
  },
  {
    dimension: 'Liquidity',
    causalityMetric: 'Liquidez',
    trigger: () => true, // Fallback
    executiveQuestion: 'A disciplina de fluxo de caixa está alinhada ao nível de liquidez atual?',
    rationaleSnippet: 'a liquidez permite o adimplemento regular das obrigações'
  },

  {
    dimension: 'CapitalStructure',
    causalityMetric: 'Autonomia',
    trigger: (_liq, aut) => aut < 0.15,
    executiveQuestion: 'É o momento estratégico para injeção de capital próprio ou estruturação de dívida alongada?',
    rationaleSnippet: 'a dependência de terceiros pressiona a viabilidade estrutural'
  },
  {
    dimension: 'CapitalStructure',
    causalityMetric: 'Autonomia',
    trigger: (_liq, aut) => aut >= 0.70,
    executiveQuestion: 'Existem oportunidades para otimizar a estrutura de capital ou a política de dividendos?',
    rationaleSnippet: 'a elevada autonomia confere independência frente a credores'
  },
  {
    dimension: 'CapitalStructure',
    causalityMetric: 'Autonomia',
    trigger: () => true, // Fallback
    executiveQuestion: 'Quais melhorias incrementais podem ser buscadas no custo da dívida atual?',
    rationaleSnippet: 'o mix de dívida e capital próprio mostra-se adequado'
  },

  {
    dimension: 'WorkingCapital',
    causalityMetric: 'Capital de Giro',
    trigger: (_liq, _aut, wc) => wc < -0.1,
    executiveQuestion: 'Como normalizar o capital de giro priorizando o ciclo de recebimentos?',
    rationaleSnippet: 'a insuficiência de capital de giro asfixia o ciclo financeiro'
  },
  {
    dimension: 'WorkingCapital',
    causalityMetric: 'Capital de Giro',
    trigger: (_liq, _aut, wc) => wc >= 0.2,
    executiveQuestion: 'A política superavitária de capital de giro maximiza a eficiência da operação?',
    rationaleSnippet: 'a forte folga financeira sustenta a necessidade operacional sem fricção'
  },
  {
    dimension: 'WorkingCapital',
    causalityMetric: 'Capital de Giro',
    trigger: () => true, // Fallback
    executiveQuestion: 'O gerenciamento do ciclo de conversão de caixa está rigoroso o suficiente?',
    rationaleSnippet: 'o capital de giro atende adequadamente a dinâmica operacional'
  },

  {
    dimension: 'AssetQuality',
    causalityMetric: 'Autonomia',
    trigger: (_liq, aut) => aut < 0.30,
    executiveQuestion: 'É possível acelerar a conversão de ativos de baixa liquidez em caixa?',
    rationaleSnippet: 'a imobilização em cenário de baixa autonomia limita a flexibilidade'
  },
  {
    dimension: 'AssetQuality',
    causalityMetric: 'Liquidez',
    trigger: () => true, // Fallback
    executiveQuestion: 'A composição do ativo garante eficiência de conversão e renovação adequada?',
    rationaleSnippet: 'a composição do ativo demonstra equilíbrio na alocação de recursos'
  },

  {
    dimension: 'CapitalEfficiency',
    causalityMetric: 'Liquidez',
    trigger: (liq) => liq < 0.8,
    executiveQuestion: 'O foco exclusivo em liquidez e sobrevivência já foi plenamente absorvido pela operação?',
    rationaleSnippet: 'a eficiência cede espaço à prioridade absoluta de geração de caixa imediato'
  },
  {
    dimension: 'CapitalEfficiency',
    causalityMetric: 'Liquidez',
    trigger: (liq) => liq >= 2.5,
    executiveQuestion: 'O retorno marginal justifica manter esta liquidez ou exige nova política de alocação de excedentes?',
    rationaleSnippet: 'a liquidez ociosa excessiva tende a penalizar a rentabilidade geral'
  },
  {
    dimension: 'CapitalEfficiency',
    causalityMetric: 'Autonomia',
    trigger: () => true, // Fallback
    executiveQuestion: 'Quais alavancas incrementais de retorno sobre capital empregado podem ser ativadas?',
    rationaleSnippet: 'o capital alocado opera dentro da normalidade para a estrutura atual'
  }
];

export class ExecutiveSemanticRegistry {
  public static getThreshold(value: number, thresholds: QuantitativeThreshold[]): QuantitativeThreshold {
    for (const t of thresholds) {
      if (value >= t.min && value < t.max) {
        return t;
      }
    }
    return thresholds[0];
  }

  private static blockTerms(text: string, blockedTerms: string[], replacement: string = 'capacidade preservada'): string {
    let sanitized = text;
    for (const term of blockedTerms) {
      const regex = new RegExp(term, 'gi');
      if (regex.test(sanitized)) {
        sanitized = sanitized.replace(regex, replacement);
      }
    }
    return sanitized;
  }

  public static enforceSemanticMatrix(text: string, scenario: string, testMode: boolean = false): { text: string, violations: string[] } {
    if (!text) return { text, violations: [] };
    let sanitized = text;
    const violations: string[] = [];

    const checkAndBlock = (terms: string[], replacement: string) => {
      for (const term of terms) {
        const regex = new RegExp(term, 'gi');
        if (regex.test(sanitized)) {
          violations.push(term);
          sanitized = sanitized.replace(regex, replacement);
        }
      }
    };

    if (scenario === 'CRITICAL_LIQUIDITY_STRESS') {
      checkAndBlock([
        'expansão', 'otimização', 'excedente', 'dividendos', 'recompra', 
        'eficiência de capital', 'capital ocioso', 'excesso de liquidez', 
        'crescimento acelerado', 'posição confortável', 'ampla liquidez', 
        'elevada autonomia', 'estrutura blindada', 'excesso', 'distribuição'
      ], 'proteção fiduciária e continuidade');
    }

    if (scenario === 'RECOVERY_OR_RECOMPOSITION') {
      checkAndBlock([
        'operação madura', 'expansão agressiva', 'capital excedente', 
        'dividendos extraordinários', 'otimização patrimonial plena',
        'maturidade plena', 'capital ocioso'
      ], 'recomposição patrimonial');
    }

    if (scenario === 'EXPANSION_WITH_DISCIPLINE') {
      checkAndBlock([
        'excesso estrutural de liquidez', 'capital improdutivo', 'capital parado', 
        'distribuição extraordinária', 'dividendos como prioridade', 'recompra', 
        'ociosidade patrimonial', 'excesso', 'excedente', 'ocioso', 'ociosa', 
        'dividendos extraordinários', 'otimização de capital excedente', 'dividendos'
      ], 'liquidez estratégica alocada');
    }

    if (scenario === 'EXCESS_LIQUIDITY_OPTIMIZATION') {
      checkAndBlock([
        'crise', 'sobrevivência', 'estresse de caixa', 'asfixia', 'continuidade ameaçada',
        'urgência', 'emergência', 'risco imediato', 'pressão operacional', 'crítico', 'insustentável'
      ], 'monitoramento contínuo');
    }

    return { text: sanitized, violations };
  }

  public static sanitizeNarrative(text: string, scenario: string): string {
    return this.enforceSemanticMatrix(text, scenario).text;
  }

  public static enforceViewModelSemanticMatrix(viewModel: any, scenario: string, testMode: boolean = false): any {
    if (!viewModel) return viewModel;
    const vm = JSON.parse(JSON.stringify(viewModel)); // Deep clone
    const violationsMap: Record<string, string[]> = {};

    const traverseAndSanitize = (obj: any, path: string) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof val === 'string') {
          const result = this.enforceSemanticMatrix(val, scenario, testMode);
          if (result.violations.length > 0) {
            violationsMap[currentPath] = result.violations;
          }
          obj[key] = result.text;
        } else if (typeof val === 'object') {
          traverseAndSanitize(val, currentPath);
        }
      }
    };

    traverseAndSanitize(vm, '');
    
    if (testMode && Object.keys(violationsMap).length > 0) {
      console.warn(`[SemanticRegistry] Violations found for scenario ${scenario}:`, violationsMap);
      (vm as any)._semanticViolations = violationsMap;
    }

    return vm;
  }

  public static resolveSemanticSovereignty(metricName: string, sovereignStatus: string): string | null {
    if (sovereignStatus === 'Liquidez Excedente') {
      if (metricName === 'Liquidez Corrente') return 'Valor estrutural indicando capacidade operacional substancial de liquidação no ciclo corrente.';
      if (metricName === 'Liquidez Imediata') return 'Caixa imediato elevado frente ao passivo circulante de curtíssimo prazo.';
      if (metricName === 'Liquidez Seca') return 'Forte cobertura de passivos de curto prazo desconsiderando estoques de menor liquidez.';
      if (metricName === 'Liquidez Geral') return 'Capacidade global robusta para honrar obrigações presentes e futuras.';
    }

    if (sovereignStatus === 'Liquidez Estratégica para Sustentação do Crescimento') {
      if (metricName === 'Liquidez Corrente') return 'Liquidez elevada atuando como reserva tática para sustentar o ciclo de expansão operacional.';
      if (metricName === 'Liquidez Imediata') return 'Caixa alocado estrategicamente para absorver aumentos bruscos de passivo circulante.';
      if (metricName === 'Liquidez Seca') return 'Forte capacidade de cobertura sem dependência de estoques, vital durante picos de crescimento.';
      if (metricName === 'Liquidez Geral') return 'Fôlego financeiro amplo preservado para garantir a expansão sem riscos ao longo prazo.';
    }

    if (sovereignStatus === 'Estrutura de Capital Fragilizada' || sovereignStatus === 'Alavancagem Crítica') {
      if (metricName === 'Relação Dívida / Patrimônio Líquido' || metricName === 'Dívida Financeira sobre Patrimônio Líquido') return 'Nível crítico de dependência de credores, com forte impacto no fluxo de caixa.';
      if (metricName === 'Endividamento Geral' || metricName === 'Debt-to-Assets') return 'Ativos majoritariamente financiados por capital oneroso, indicando asfixia estrutural.';
      if (metricName === 'Autonomia Financeira') return 'Asfixia institucional com vulnerabilidade elevada a choques de mercado devido à falta de capital próprio.';
      if (metricName === 'Composição do Endividamento') return 'Elevada concentração de vencimentos no curto prazo, ampliando o risco de liquidez.';
    }

    return null;
  }

  public static getObservation(metricName: string, sovereignStatus: string | null): string {
    const resolved = this.resolveSemanticSovereignty(metricName, sovereignStatus || '');
    if (resolved) return resolved;

    if (sovereignStatus === 'Estrutura Patrimonial Muito Sólida' || sovereignStatus === 'Proteção Patrimonial Robusta') {
      if (metricName === 'Relação Dívida / Patrimônio Líquido' || metricName === 'Dívida Financeira sobre Patrimônio Líquido' || metricName === 'Debt-to-Equity' || metricName === 'Financial Debt-to-Equity') return 'Alavancagem substancialmente reduzida conferindo altíssima segurança institucional.';
      if (metricName === 'Autonomia Financeira') return 'Estrutura financiada massivamente por capital próprio, isolando a operação de pressões de credores.';
      if (metricName === 'Endividamento Geral') return 'Baixa participação absoluta de capital de terceiros no financiamento do ativo.';
    }

    if (sovereignStatus === 'Baixo impacto devido à reduzida alavancagem') {
      return 'Embora concentrada no curto prazo, a dívida é pouco material frente ao ativo e amplamente coberta pela liquidez.';
    }

    if (sovereignStatus === 'Não aplicável ao cenário atual') {
      return 'Sem evidência quantitativa primária disponível para emitir julgamento técnico.';
    }

    const defaults: Record<string, string> = {
      'Liquidez Corrente': 'Mede a capacidade estática da companhia de honrar obrigações dentro do ciclo operacional.',
      'Liquidez Imediata': 'Avalia o fôlego de caixa mais estrito contra obrigações exigíveis no curto prazo.',
      'Liquidez Seca': 'Avalia a capacidade de cobertura de passivos de curto prazo sem depender da venda de estoques.',
      'Liquidez Geral': 'Indica a capacidade global de pagamento no curto e no longo prazo.',
      'Liquidez Real': 'Avalia a liquidez operacional imediata desconsiderando ativos de baixa convertibilidade.',
      'Autonomia Financeira': 'Proporção de capital próprio em relação aos ativos da empresa, indicando independência financeira.',
      'Composição do Endividamento': 'Proporção de obrigações vincendas no curto prazo em relação ao endividamento total.',
      'Capital de Giro Líquido': 'Volume absoluto de recursos aplicados no ativo circulante financiados por passivos de longo prazo ou capital próprio.',
      'Necessidade de Capital de Giro': 'Volume de recursos exigidos pelas operações diárias não cobertos pelos fornecedores operacionais.',
      'Saldo de Tesouraria': 'Margem de caixa livre remanescente após o financiamento da necessidade de capital de giro.',
      'Endividamento Geral': 'Grau de comprometimento dos ativos totais da companhia por capital de terceiros.',
      'Relação Dívida / Patrimônio Líquido': 'Relação direta entre capital de terceiros e capital próprio empregado na estrutura.',
      'Dívida Financeira sobre Patrimônio Líquido': 'Grau de dependência de passivos onerosos em relação ao capital aportado ou retido pelos acionistas.',
      'Qualidade do Patrimônio Líquido': 'Qualifica a composição do PL, medindo o peso de lucros retidos vs capital social nominal.',
      'Imobilização do Patrimônio Líquido': 'Mede a parcela do capital próprio que encontra-se comprometida em ativos permanentes.',
      'Risco de Concentração de Ativos': 'Avalia o aprisionamento de capital em rubricas de baixa liquidez ou flexibilidade.'
    };

    return defaults[metricName] || `Métrica técnica contábil referente ao componente de ${metricName || 'balanço'}.`;
  }

  public static getFormula(metricName: string): string {
    const formulas: Record<string, string> = {
      'Liquidez Corrente': '(Ativo Circulante / Passivo Circulante)',
      'Liquidez Imediata': '(Disponibilidades / Passivo Circulante)',
      'Liquidez Seca': '((Ativo Circulante - Estoques) / Passivo Circulante)',
      'Liquidez Geral': '((Ativo Circulante + RLP) / (Passivo Circulante + PNC))',
      'Liquidez Real': '((Ativo Circulante - Estoques - Despesas Antecipadas) / Passivo Circulante)',
      'Autonomia Financeira': '(Patrimônio Líquido / Ativo Total)',
      'Composição do Endividamento': '(Passivo Circulante / Passivo Total)',
      'Capital de Giro Líquido': '(Ativo Circulante - Passivo Circulante)',
      'Necessidade de Capital de Giro': '(Ativo Circulante Operacional - Passivo Circulante Operacional)',
      'Saldo de Tesouraria': '(Capital de Giro Líquido - Necessidade de Capital de Giro)',
      'Endividamento Geral': '(Passivo Total / Ativo Total)',
      'Relação Dívida / Patrimônio Líquido': '(Passivo Total / Patrimônio Líquido)',
      'Dívida Financeira sobre Patrimônio Líquido': '(Dívida Financeira / Patrimônio Líquido)',
      'Qualidade do Patrimônio Líquido': '(Lucros Acumulados / Patrimônio Líquido)',
      'Imobilização do Patrimônio Líquido': '(Ativo Não Circulante / Patrimônio Líquido)',
      'Risco de Concentração de Ativos': '(Ativo Principal / Ativo Total)'
    };
    return formulas[metricName] || '-';
  }
}
