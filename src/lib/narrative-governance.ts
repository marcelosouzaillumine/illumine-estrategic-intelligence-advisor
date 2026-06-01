export const SEMANTIC_REWRITE_RULES = [
  {
    triggers: [/financeiramente inviável/i],
    rebuild: "O modelo de negócio atual permanece operacionalmente funcional, porém com restrições estruturais relevantes que exigem maior disciplina financeira e fortalecimento da liquidez operacional."
  },
  {
    triggers: [/asfixiamento da liquidez/i],
    rebuild: "A pressão relevante sobre a liquidez operacional poderá comprometer o fluxo de pagamentos no ciclo subsequente."
  },
  {
    triggers: [/demissões estruturais/i, /rolagem forçada/i],
    rebuild: "Poderá pressionar a linha d'água da tesouraria, exigindo revisão da estrutura de custos e necessidade de renegociação de prazos."
  },
  {
    triggers: [/aportes maciços/i, /drena o caixa ao acelerar/i],
    rebuild: "O crescimento sustentável dependerá de reforço de capital ou reorganização do ciclo financeiro para evitar pressão no caixa operacional."
  },
  {
    triggers: [/Expansão sem Sustentação/i, /Queima de Equity/i],
    rebuild: "Expansão Condicionada à Eficiência do Capital de Giro."
  },
  {
    triggers: [/Risco de diluição/i, /aporte de capital primário/i],
    rebuild: "Necessidade potencial de reforço de capital em cenários de expansão acelerada."
  },
  {
    triggers: [/destrói valor e acelera o risco de ruptura/i, /turnaround patrimonial imediato/i],
    rebuild: "A estrutura atual apresenta ineficiências na criação de valor econômico e pressiona o passivo de curto prazo, demandando adequações estratégicas focadas em desalavancagem e eficiência de caixa."
  },
  {
    triggers: [/Ruptura Estrutural Sistêmica/i, /passivo a descoberto/i, /destruição de caixa operacional/i],
    rebuild: "A arquitetura de capital e o modelo operacional encontram-se sob pressão relevante, com o balanço sendo pressionado pela erosão de margem na operação. A restrição de caixa impõe um ambiente de vulnerabilidade imediata. Recomenda-se acompanhamento disciplinado e intervenção estratégica da governança, com foco em reperfilamento tático e preservação da liquidez."
  },
  {
    triggers: [/Deterioração Acelerada/i, /queima simultânea de patrimônio e caixa/i, /insolvência iminente/i],
    rebuild: "Corrosão Operacional Relevante. A contração simultânea de patrimônio e caixa demanda acompanhamento executivo e possível injeção estratégica de capital para sustentar as operações e preservar a liquidez."
  },
  {
    triggers: [/Incapacidade latente de honrar compromissos/i, /ruptura sistêmica/i],
    rebuild: "Fragilidade na capacidade de cobertura de curto prazo requer monitoramento prudencial para evitar pressões adicionais no capital de giro."
  },
  {
    triggers: [/Passivo a descoberto/i, /risco extremo de litígio/i],
    rebuild: "A estrutura de passivo a descoberto reflete corrosão patrimonial passada, exigindo recuperação progressiva das margens para restabelecer a folga institucional de valor."
  },
  {
    triggers: [/Frágil\.\s*Sensível\.\s*Vulnerabilidade relevante/i],
    rebuild: "Modelo operacional sensível a oscilações de demanda e deterioração do ciclo financeiro."
  },
  {
    triggers: [/Insolvência técnica e falência de creditos/i],
    rebuild: "Deterioração do capital próprio e pressão sobre operações de mútuo, demandando revisão estrutural dos modelos de alocação de caixa."
  },
  {
    triggers: [/pressão crítica no Giro/i, /Atenção \(Giro Pressionado\)/i],
    rebuild: "Pressão no Ciclo Financeiro (Sensibilidade no Ciclo de Fornecedores)."
  },
  {
    triggers: [/asfixiar a tesouraria/i],
    rebuild: "Risco Primário: Choques na demanda podem pressionar significativamente a tesouraria, pois o caixa está imobilizado e a liquidez imediata é restrita."
  },
  {
    triggers: [/Concentração severa de passivos/i, /pressão de rolagem/i],
    rebuild: "Concentração relevante de passivos no curto prazo, gerando maior dependência da gestão eficiente dos vencimentos."
  },
  {
    triggers: [/Frágil\.\s*Alta vulnerabilidade a choques/i, /Alta vulnerabilidade a choques/i],
    rebuild: "Sensível. Vulnerabilidade relevante a choques de mercado ou inadimplência."
  },
  {
    triggers: [/Disfunção estrutural detectada/i],
    rebuild: "Restrição estrutural relevante detectada."
  },
  {
    triggers: [/Erosão Silenciosa \(Destruição\)/i, /Erosão Silenciosa/i],
    rebuild: "Erosão de Eficiência Econômica."
  },
  {
    triggers: [/Fator de Destruição Econômica/i, /Fator de Destruição/i],
    rebuild: "Fator de Perda de Eficiência Econômica."
  },
  {
    triggers: [/romperá/i],
    rebuild: "A atual configuração poderá pressionar as margens de segurança, exigindo monitoramento."
  },
  {
    triggers: [/destruição econômica/i, /destruição/i],
    rebuild: "A trajetória aponta para perda de eficiência econômica, demandando correções táticas."
  },
  {
    triggers: [/linha d'água próxima do limite operacional/i, /linha d'água próxima/i],
    rebuild: "tesouraria operando com margem reduzida de flexibilidade."
  },
  {
    triggers: [/colapso/i, /falência/i, /insolvência/i, /asfixiamento/i],
    rebuild: "O cenário apresenta estresse estrutural e fragilidade sistêmica de solvência, requerendo intervenção executiva."
  }
];

export function applyNarrativeGovernanceToText(text: string, resilienciaGlobal: number): string {
  if (typeof text !== 'string') return text;
  
  // Applica a governança de "Pressão Estrutural" (score >= 41)
  if (resilienciaGlobal >= 41) {
    // Quebra o texto em sentenças (ou trata como frase única se não houver pontuação)
    const sentenceRegex = /([^.!?]+[.!?]*)/g;
    const sentences = text.match(sentenceRegex);
    
    if (!sentences) {
      // Fallback para strings muito curtas ou sem pontuação
      let matchedRule = SEMANTIC_REWRITE_RULES.find(rule => 
        rule.triggers.some(trigger => trigger.test(text))
      );
      return matchedRule ? matchedRule.rebuild : text;
    }

    const rewrittenSentences = sentences.map(sentence => {
      let matchedRule = SEMANTIC_REWRITE_RULES.find(rule => 
        rule.triggers.some(trigger => trigger.test(sentence))
      );
      
      if (matchedRule) {
        // Preserva os espaços ao redor se houver (para não colar sentenças)
        const prefix = sentence.match(/^\s*/)?.[0] || '';
        const suffix = sentence.match(/\s*$/)?.[0] || '';
        return prefix + matchedRule.rebuild + suffix;
      }
      return sentence;
    });

    return rewrittenSentences.join('');
  }
  
  return text;
}

export function validateNarrativeOutput<T>(output: T, resilienciaGlobal: number): T {
  if (output === null || output === undefined) return output;

  if (typeof output === 'string') {
    return applyNarrativeGovernanceToText(output, resilienciaGlobal) as any as T;
  }

  if (Array.isArray(output)) {
    return output.map(item => validateNarrativeOutput(item, resilienciaGlobal)) as any as T;
  }

  if (typeof output === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(output)) {
      result[key] = validateNarrativeOutput(value, resilienciaGlobal);
    }
    return result as T;
  }

  return output;
}
