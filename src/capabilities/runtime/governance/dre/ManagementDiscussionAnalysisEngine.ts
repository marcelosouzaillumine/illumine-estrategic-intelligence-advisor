import { InstitutionalLineageTracer, FiduciarySource } from '../../lineage/InstitutionalLineageTracer';
import { ExecutiveNarrativeSanitizer } from '../../institutional-causality/ExecutiveNarrativeSanitizer';

export interface MDABlock {
  title: string;
  content: string;
}

export interface MDAReport {
  blocks: MDABlock[];
}

export class ManagementDiscussionAnalysisEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    receitaLiquida: number,
    lucroLiquido: number,
    ebitda: number,
    pontoEquilibrio: number,
    despesasOperacionais: number,
    receitaGrowth: number,
    ebitdaGrowth: number,
    actionMatrix: string[],
    lineageSources: FiduciarySource[]
  ): MDAReport {
    const blocks: MDABlock[] = [];

    // 1. Desempenho do Exercício
    let desempenho = `A empresa atingiu uma Receita Líquida de R$ ${receitaLiquida.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}, gerando um EBITDA de R$ ${ebitda.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} e resultado líquido de R$ ${lucroLiquido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}.`;
    if (receitaGrowth !== 0) {
      desempenho += ` A receita apresentou variação de ${receitaGrowth > 0 ? '+' : ''}${receitaGrowth.toFixed(1)}% contra o ciclo anterior, e a evolução de EBITDA foi de ${ebitdaGrowth > 0 ? '+' : ''}${ebitdaGrowth.toFixed(1)}%.`;
    }
    blocks.push({
      title: '1. Desempenho do Exercício',
      content: ExecutiveNarrativeSanitizer.sanitize(InstitutionalLineageTracer.traceAssertion(desempenho, lineageSources).text)
    });

    // 2. Principais Vetores de Resultado
    let vetores = '';
    if (ebitda < 0) {
      if (receitaLiquida < pontoEquilibrio) vetores = 'O déficit foi predominantemente impulsionado pela incapacidade comercial de alcançar o Break-Even point, limitando a diluição dos custos fixos.';
      else vetores = 'O déficit foi primariamente gerado pela compressão da margem bruta primária combinada com excesso estrutural de despesas administrativas.';
    } else {
      if (receitaLiquida >= pontoEquilibrio && despesasOperacionais < lucroLiquido) vetores = 'A expansão da base de receita acima do Ponto de Equilíbrio, aliada a uma estrutura de despesas operacionais controlada, alavancou positivamente a última linha do balanço.';
      else vetores = 'A margem bruta primária atuou como principal força motriz do resultado positivo, compensando as despesas correntes do exercício.';
    }
    blocks.push({
      title: '2. Principais Vetores de Resultado',
      content: ExecutiveNarrativeSanitizer.sanitize(InstitutionalLineageTracer.traceAssertion(vetores, lineageSources).text)
    });

    // 3. Riscos Observados
    let riscos = [];
    if (receitaLiquida < pontoEquilibrio) riscos.push('- Comercial: Escala de vendas abaixo do limiar de sobrevivência (Break-Even).');
    if (ebitda < 0) riscos.push('- Operacional: Geração de caixa livre orgânico subótimo, pressionando reservas estruturais.');
    if (despesasOperacionais > receitaLiquida * 0.4) riscos.push('- Financeiro: Sobrecarga severa de despesas administrativas na estrutura operacional.');
    if (riscos.length === 0) riscos.push('- Operacional: Dependência da manutenção do atual ritmo de absorção comercial.');
    blocks.push({
      title: '3. Riscos Observados',
      content: ExecutiveNarrativeSanitizer.sanitize(InstitutionalLineageTracer.traceAssertion(riscos.join('\n'), lineageSources).text)
    });

    // 4. Oportunidades Detectadas
    let oportunidades = [];
    if (receitaLiquida > 0 && receitaLiquida < pontoEquilibrio) oportunidades.push('- Ganho marginal de receita refletirá diretamente na rentabilidade líquida via diluição fixa.');
    else if (ebitda > 0) oportunidades.push('- Alavancagem do excesso de geração operacional para acelerar expansão de Market Share.');
    else oportunidades.push('- Racionalização do OPEX pode reconduzir a empresa à estabilidade de forma rápida.');
    blocks.push({
      title: '4. Oportunidades Detectadas',
      content: ExecutiveNarrativeSanitizer.sanitize(InstitutionalLineageTracer.traceAssertion(oportunidades.join('\n'), lineageSources).text)
    });

    // 5. Prioridades para o Próximo Ciclo
    const prios = actionMatrix.slice(0, 5).map(a => `- ${a}`).join('\n') || '- Estruturação base de planejamento comercial e orçamentário.';
    blocks.push({
      title: '5. Prioridades para o Próximo Ciclo',
      content: prios // Already sanitized and lineage traced generally from the advisory matrix, but keeping it clean here
    });

    // 6. Executive Outlook
    let outlook = '';
    if (ebitda < 0 && receitaLiquida < pontoEquilibrio) {
      outlook = 'Mantidas as condições atuais, a estrutura operacional permanecerá subabsorvida e continuará pressionando o saldo de liquidez, resultando em deterioração econômica contínua.';
    } else if (ebitda < 0) {
      outlook = 'Mantidas as condições atuais, o consumo de caixa operacional continuará forçando a dependência de capital de terceiros ou diluição societária estrutural.';
    } else if (ebitda > 0 && lucroLiquido < 0) {
      outlook = 'Mantidas as condições atuais, a rentabilidade da operação principal continuará sendo consumida pelas obrigações extrínsecas (encargos e tributos).';
    } else {
      outlook = 'Mantidas as condições atuais, a organização seguirá em rota de acumulação patrimonial e robustez orgânica favorável.';
    }
    blocks.push({
      title: '6. Executive Outlook',
      content: ExecutiveNarrativeSanitizer.sanitize(InstitutionalLineageTracer.traceAssertion(outlook, lineageSources).text)
    });

    return { blocks };
  }
}
