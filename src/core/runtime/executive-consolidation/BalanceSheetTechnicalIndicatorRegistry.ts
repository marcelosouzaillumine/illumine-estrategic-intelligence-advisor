import { ExecutiveBusinessTerminologyTranslator } from './ExecutiveBusinessTerminologyRegistry';

export interface TechnicalIndicatorMetadata {
  technicalName: string;
  executiveName: string;
  formula: string;
  purpose: string;
  limitations: string;
  referenceRange: string;
  methodologicalNotes: string;
}

export const BalanceSheetTechnicalIndicatorRegistry: Record<string, TechnicalIndicatorMetadata> = {
  // --- Preservação Patrimonial ---
  'Margem de Segurança Patrimonial': {
    technicalName: 'Margem de Segurança Patrimonial',
    executiveName: 'Margem de Segurança Patrimonial',
    formula: 'Capital Circulante Próprio / Ativo Circulante',
    purpose: 'Medir a proporção do ativo de curto prazo financiado por recursos próprios de longo prazo.',
    limitations: 'Não considera a qualidade ou liquidez real dos ativos circulantes.',
    referenceRange: '> 0 (Positiva)',
    methodologicalNotes: 'Depende diretamente da classificação contábil correta de curto e longo prazo.'
  },
  'Reserva Patrimonial para Choques': {
    technicalName: 'Capacidade de Absorção de Perdas',
    executiveName: 'Reserva Patrimonial para Choques',
    formula: 'Patrimônio Líquido / (Ativo Total - Caixa e Equivalentes)',
    purpose: 'Quantificar a margem do PL para absorver choques operacionais ou desvalorização de ativos não monetários.',
    limitations: 'Não capta a liquidez da reserva, apenas sua suficiência contábil.',
    referenceRange: '> 0.2',
    methodologicalNotes: 'Inspirado em métricas de Basiléia para instituições financeiras, adaptado para economia real.'
  },
  'Qualidade do Patrimônio Líquido': {
    technicalName: 'Índice de Qualidade do Patrimônio Líquido',
    executiveName: 'Qualidade do Patrimônio Líquido',
    formula: '(Patrimônio Líquido - Intangíveis) / Patrimônio Líquido',
    purpose: 'Excluir o ágio e outros ativos não palpáveis para encontrar a base tangível de proteção aos credores.',
    limitations: 'Penaliza severamente empresas de tecnologia e franquias estruturadas via M&A.',
    referenceRange: '> 0.7',
    methodologicalNotes: 'Também conhecido como Tangible Net Worth Ratio.'
  },
  'Índice de Sobrevivência Patrimonial': {
    technicalName: 'Índice de Sobrevivência Patrimonial',
    executiveName: 'Índice de Sobrevivência Patrimonial',
    formula: '(Caixa + Equivalentes + Investimentos CP) / Queima Operacional Mensal',
    purpose: 'Projetar quantos meses a empresa pode operar sem gerar receita ou captar recursos (Runway).',
    limitations: 'Estático, assume linearidade nas despesas futuras.',
    referenceRange: '> 6 meses',
    methodologicalNotes: 'Uso restrito a análises de stress de curtíssimo prazo.'
  },
  'Velocidade de Erosão Patrimonial': {
    technicalName: 'Velocidade de Erosão Patrimonial',
    executiveName: 'Velocidade de Erosão Patrimonial',
    formula: 'Déficit Operacional Recorrente / Patrimônio Líquido',
    purpose: 'Medir o ritmo de destruição de capital em cenários de turnaround.',
    limitations: 'Altamente volátil entre os trimestres.',
    referenceRange: '< 0',
    methodologicalNotes: 'Indicador preditivo de falência estrutural.'
  },

  // --- Liquidez ---
  'Liquidez Corrente': {
    technicalName: 'Liquidez Corrente',
    executiveName: 'Liquidez Corrente',
    formula: 'Ativo Circulante / Passivo Circulante',
    purpose: 'Medir a capacidade folgada de honrar compromissos de curto prazo.',
    limitations: 'Inclui estoques, que podem ter baixa liquidez imediata.',
    referenceRange: '> 1.2',
    methodologicalNotes: 'Valores muito altos indicam capital ocioso.'
  },
  'Liquidez Seca': {
    technicalName: 'Liquidez Seca',
    executiveName: 'Liquidez Seca',
    formula: '(Ativo Circulante - Estoques) / Passivo Circulante',
    purpose: 'Avaliar a liquidez sem depender da venda do inventário.',
    limitations: 'Pode penalizar varejistas com alto giro de estoque saudável.',
    referenceRange: '> 1.0',
    methodologicalNotes: 'Mais rigoroso que a Liquidez Corrente.'
  },
  'Liquidez Imediata': {
    technicalName: 'Liquidez Imediata',
    executiveName: 'Liquidez Imediata',
    formula: 'Disponibilidades / Passivo Circulante',
    purpose: 'Mensurar a capacidade de cobrir as dívidas de curto prazo apenas com o caixa livre.',
    limitations: 'Valores altos sacrificam a rentabilidade.',
    referenceRange: '> 0.2',
    methodologicalNotes: 'Indicador de estresse máximo.'
  },
  'Saldo de Tesouraria': {
    technicalName: 'Saldo de Tesouraria',
    executiveName: 'Saldo de Tesouraria',
    formula: 'Disponibilidades + Aplicações Financeiras',
    purpose: 'Exibir a posição absoluta de liquidez imediata.',
    limitations: 'Apenas uma fotografia estática do balanço.',
    referenceRange: 'Positivo e compatível com a operação',
    methodologicalNotes: 'Não inclui recebíveis.'
  },

  // --- Estrutura Patrimonial ---
  'Endividamento Geral': {
    technicalName: 'Endividamento Geral',
    executiveName: 'Endividamento Geral',
    formula: 'Passivo Exigível Total / Ativo Total',
    purpose: 'Avaliar o nível de comprometimento dos ativos com terceiros.',
    limitations: 'Não distingue dívida onerosa (bancos) de dívida operacional (fornecedores).',
    referenceRange: '< 60%',
    methodologicalNotes: 'A proporção ideal varia drasticamente por setor.'
  },
  'Relação Dívida / Patrimônio Líquido': {
    technicalName: 'Relação Dívida / Patrimônio Líquido',
    executiveName: 'Relação Dívida / Patrimônio Líquido',
    formula: 'Passivo Exigível Total / Patrimônio Líquido',
    purpose: 'Indica a alavancagem total e a dependência de recursos de terceiros.',
    limitations: 'Não distingue entre dívida financeira e dívida operacional.',
    referenceRange: '< 2.0',
    methodologicalNotes: 'Considera-se o passivo circulante e não circulante total.'
  },
  'Relação Dívida Financeira / Patrimônio Líquido': {
    technicalName: 'Relação Dívida Financeira / Patrimônio Líquido',
    executiveName: 'Relação Dívida Financeira / Patrimônio Líquido',
    formula: 'Dívida Financeira (Curto + Longo) / Patrimônio Líquido',
    purpose: 'Medir a alavancagem bancária/financeira sobre o capital próprio.',
    limitations: 'Pode não capturar dívidas ocultas ou passivos contingentes.',
    referenceRange: '< 1.0',
    methodologicalNotes: 'Foco exclusivo em capital oneroso.'
  },
  'Dependência de Capital de Terceiros': {
    technicalName: 'Dependência de Capital de Terceiros',
    executiveName: 'Dependência de Capital de Terceiros',
    formula: 'Equivalente ao Endividamento Geral',
    purpose: 'Avaliar a vulnerabilidade externa da companhia.',
    limitations: 'Desconsidera o custo da dívida.',
    referenceRange: '< 60%',
    methodologicalNotes: 'Termo frequentemente usado em laudos periciais.'
  },
  'Autonomia Financeira': {
    technicalName: 'Autonomia Financeira',
    executiveName: 'Autonomia Financeira',
    formula: 'Patrimônio Líquido / Passivo Exigível Total',
    purpose: 'Medir o grau de independência financeira em relação a terceiros.',
    limitations: 'Empresas muito autônomas podem estar perdendo oportunidade de alavancagem fiscal e retorno sobre patrimônio.',
    referenceRange: '> 0.5',
    methodologicalNotes: 'É o inverso da Relação Dívida / Patrimônio Líquido.'
  },
  'Capacidade de Financiamento': {
    technicalName: 'Capacidade de Financiamento',
    executiveName: 'Capacidade de Financiamento',
    formula: '(Caixa + Margem de Endividamento) / NCG Incremental',
    purpose: 'Medir a capacidade de financiar a expansão do capital de giro.',
    limitations: 'Dinâmico, dependente de premissas de NCG.',
    referenceRange: '> 2.0',
    methodologicalNotes: 'Avalia o fôlego de curto/médio prazo.'
  },

  // --- Capital de Giro ---
  'Capital de Giro Líquido': {
    technicalName: 'Capital de Giro Líquido',
    executiveName: 'Capital de Giro Líquido',
    formula: 'Ativo Circulante - Passivo Circulante',
    purpose: 'Representar a folga financeira de curto prazo em termos absolutos.',
    limitations: 'Não informa se o giro está bem gerido, apenas se há excedente ou déficit estrutural.',
    referenceRange: '> 0 (Positivo)',
    methodologicalNotes: 'Pode ser mascarado por estoques obsoletos.'
  },
  'Necessidade de Capital de Giro': {
    technicalName: 'Necessidade de Capital de Giro',
    executiveName: 'Necessidade de Capital de Giro',
    formula: 'Ativo Circulante Operacional - Passivo Circulante Operacional',
    purpose: 'Mostrar os recursos amarrados na operação cotidiana.',
    limitations: 'Requer uma forte reclassificação gerencial entre financeiro e operacional.',
    referenceRange: 'Variável (preferencialmente negativo ou de baixo impacto)',
    methodologicalNotes: 'Diferencia a operação da tesouraria.'
  },
  'Ciclo Financeiro': {
    technicalName: 'Ciclo Financeiro',
    executiveName: 'Ciclo Financeiro',
    formula: 'Prazo Médio de Estoque + Prazo Médio de Recebimento - Prazo Médio de Pagamento',
    purpose: 'Medir os dias de "vazio de caixa" que precisam ser financiados.',
    limitations: 'Usa saldos finais de balanço, que podem ter sazonalidades extremas.',
    referenceRange: 'Quanto menor, melhor. (Até negativo)',
    methodologicalNotes: 'Essencial cruzar com as vendas e custos da DRE.'
  },

  // --- Eficiência de Alocação de Capital ---
  'Caixa Excedente Estimado': {
    technicalName: 'Caixa Excedente Estimado',
    executiveName: 'Caixa Excedente Estimado',
    formula: 'Caixa Total - Caixa Mínimo Operacional (Ex: 2% da Receita)',
    purpose: 'Identificar capital não produtivo estacionado no ativo circulante.',
    limitations: 'A definição de "Mínimo Operacional" é empírica e altamente variável.',
    referenceRange: 'R$ 0 ou minimizado',
    methodologicalNotes: 'Modelo de referência para distribuição de dividendos e M&A.'
  },
  'Capital Ocioso': {
    technicalName: 'Capital Ocioso',
    executiveName: 'Capital Ocioso',
    formula: 'Ativos Imobilizados Não Operacionais + Caixa Excedente',
    purpose: 'Mensurar os ativos que não contribuem para o retorno operacional.',
    limitations: 'Dificuldade contábil em segregar imobilizado operacional de não operacional no balanço publicado.',
    referenceRange: 'R$ 0',
    methodologicalNotes: 'Demanda informações extracontábeis para alta precisão.'
  },
  'Índice de Produtividade': {
    technicalName: 'Índice de Produtividade',
    executiveName: 'Índice de Produtividade',
    formula: 'EBITDA / Patrimônio Líquido',
    purpose: 'Verificar se a base patrimonial está gerando caixa compatível com seu tamanho.',
    limitations: 'Patrimônios artificialmente baixos por prejuízos distorcem a métrica.',
    referenceRange: '> 1.0 (ou aderente ao setor)',
    methodologicalNotes: 'Um proxy executivo para a eficiência de gestão de capital.'
  },
  'Eficiência Patrimonial': {
    technicalName: 'Eficiência Patrimonial',
    executiveName: 'Eficiência Patrimonial',
    formula: 'Vendas / Ativo Total',
    purpose: 'Giro do ativo, ou quantos reais de venda cada real investido produz.',
    limitations: 'Empresas asset-light (tecnologia, serviços) terão métricas gigantescas contra a indústria.',
    referenceRange: '> 1.0',
    methodologicalNotes: 'Também conhecido como Giro do Ativo (Asset Turnover).'
  },
  
  // --- Qualidade / Outros ---
  'Risco de Concentração de Ativos': {
    technicalName: 'Risco de Concentração de Ativos',
    executiveName: 'Risco de Concentração de Ativos',
    formula: 'Maior Classe de Ativo / Ativo Total',
    purpose: 'Identificar se o balanço é demasiadamente dependente de um único ativo.',
    limitations: 'Superficial sem abrir os sub-detalhes (ex: clientes específicos).',
    referenceRange: '< 40%',
    methodologicalNotes: 'Exige desagregação gerencial do ativo circulante/imobilizado.'
  }
};

export class BalanceSheetTechnicalIndicatorEngine {
  static getMetadata(indicatorName: string): TechnicalIndicatorMetadata {
    // Try exact match
    if (BalanceSheetTechnicalIndicatorRegistry[indicatorName]) {
      return BalanceSheetTechnicalIndicatorRegistry[indicatorName];
    }
    
    // Attempt fallback lookup matching technical or executive name
    const match = Object.values(BalanceSheetTechnicalIndicatorRegistry).find(
      meta => meta.technicalName === indicatorName || meta.executiveName === indicatorName
    );

    if (match) return match;

    let fallbackRange = 'Avaliação contextual';
    const lowerName = indicatorName.toLowerCase();
    
    if (lowerName.includes('capital de giro') || lowerName.includes('saldo') || lowerName.includes('necessidade') || lowerName.includes('excedente') || lowerName.includes('ocioso') || lowerName.includes('tesouraria') || lowerName.includes('imobilizado')) {
      fallbackRange = 'Depende do setor e do modelo operacional';
    } else if (lowerName.includes('índice') || lowerName.includes('taxa') || lowerName.includes('margem') || lowerName.includes('rácio') || lowerName.includes('ratio')) {
      fallbackRange = 'Sem referencial universal aplicável';
    }

    // Return an anonymous skeleton if completely unknown to the registry
    return {
      technicalName: indicatorName,
      executiveName: ExecutiveBusinessTerminologyTranslator.translate(indicatorName),
      formula: 'Fórmula dinâmica calculada pelo motor analítico institucional.',
      purpose: 'Fins de análise contábil estrutural.',
      limitations: 'Sem limitações conhecidas no escopo atual.',
      referenceRange: fallbackRange,
      methodologicalNotes: 'Métrica extraída diretamente das séries temporais ou agregados dinâmicos.'
    };
  }
}
