import { ExecutiveDriverDefinition } from './ExecutiveDriverCatalog';
import { StrategicSeverityLevel } from './StrategicOpinionConsistencyEngine';
import { StrategicStage } from './StrategicDiagnosisStageResolver';

export interface ExecutiveNarrativeContext {
  dominantDriver: ExecutiveDriverDefinition;
  secondaryDriver?: ExecutiveDriverDefinition;
  mitigatingDriver?: ExecutiveDriverDefinition;
  severity: StrategicSeverityLevel;
  module: string;
  institutionalState: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'NEUTRAL';
  strategicStage: StrategicStage;
  optimizationOpportunity?: string;
}

export class ExecutiveNarrativeBuilder {
  public static buildSituacaoAtual(context: ExecutiveNarrativeContext): string {
    const moduleName = this.getModuleSubject(context.module);
    
    if (context.institutionalState === 'NEUTRAL') {
      return `${moduleName} não apresenta dados suficientes para uma avaliação fiduciária conclusiva neste exercício.`;
    }

    if (context.institutionalState === 'CRITICAL') {
      const dominantText = context.dominantDriver.narratives.critical;
      let text = `${moduleName} encontra-se sob stress severo, com ${dominantText}, exigindo ações imediatas de proteção de capital.`;
      
      if (context.mitigatingDriver) {
        const mitigatingSubjectRaw = context.mitigatingDriver.shortLabel.toLowerCase();
        let mitigatingSubject = `a ${mitigatingSubjectRaw}`;
        if (mitigatingSubjectRaw.includes('estrutura')) {
          mitigatingSubject = 'a estrutura patrimonial';
        } else if (mitigatingSubjectRaw.includes('caixa') || mitigatingSubjectRaw.includes('tesouraria')) {
          mitigatingSubject = 'o caixa';
        }

        let prudentialText = 'alguma margem de absorção';
        if (mitigatingSubjectRaw.includes('estrutura')) {
          prudentialText = 'uma base de capital ainda existente';
        }

        const dominantName = context.dominantDriver.shortLabel.toLowerCase();

        text = `${moduleName} encontra-se sob stress severo, com ${dominantText}. Embora ${mitigatingSubject} ainda ofereça ${prudentialText}, esse fator não é suficiente para compensar a fragilidade dominante de ${dominantName}, exigindo ações imediatas de proteção de capital, preservação de caixa e continuidade operacional.`;
      }
      return text;
    }

    if (context.institutionalState === 'WARNING') {
      const dominantText = context.dominantDriver.narratives.warning;
      return `${moduleName} permanece funcional, porém exige monitoramento ativo em razão de ${dominantText}.`;
    }

    // HEALTHY state logic with stage differentiation (BP specific initially)
    const dominantText = context.dominantDriver.narratives.healthy;
    
    if (context.module === 'BP') {
      if (context.strategicStage === 'capital_allocation') {
        return `A companhia encerra o período com posição patrimonial robusta, ampla liquidez, baixa dependência de terceiros e elevada autonomia financeira. O desafio estratégico deixa de ser solvência e passa a ser a alocação eficiente do capital excedente.`;
      }
      if (context.strategicStage === 'expansion') {
        return `A estrutura patrimonial demonstra expansão consistente, com liquidez robusta, baixa alavancagem e autonomia financeira elevada. O principal desafio passa a ser preservar disciplina de capital durante o crescimento.`;
      }
      if (context.strategicStage === 'optimization' || context.strategicStage === 'stabilization') {
        return `A companhia apresenta forte recomposição patrimonial, com liquidez elevada e estrutura de capital preservada. Apesar da posição confortável de caixa, a qualidade do capital ainda recomenda prudência na retenção de resultados e na consolidação da base patrimonial.`;
      }
    }
    
    // Fallback healthy para outros módulos ou estágios não cobertos acima
    if (context.secondaryDriver) {
      return `${moduleName} apresenta fundamentos resilientes, destacando-se por ${dominantText} e ${context.secondaryDriver.narratives.healthy}.`;
    }
    return `${moduleName} apresenta fundamentos resilientes, destacando-se por ${dominantText}.`;
  }

  public static buildSignificadoFinanceiro(context: ExecutiveNarrativeContext): string {
    if (context.institutionalState === 'NEUTRAL') {
      return 'Limitação estrutural para rastreabilidade de dados financeiros.';
    }

    if (context.institutionalState === 'CRITICAL') {
      return `${context.dominantDriver.narratives.critical}. O momento reflete a importância da preservação de caixa e normalização dos indicadores vitais.`;
    }

    if (context.institutionalState === 'WARNING') {
      return `${context.dominantDriver.narratives.warning}. O contexto aponta para a relevância de preservar margens de segurança e manter disciplina na alocação de recursos.`;
    }

    // HEALTHY
    return `${context.dominantDriver.narratives.healthy}.`;
  }

  public static buildOutlook(context: ExecutiveNarrativeContext): string {
    if (context.institutionalState === 'NEUTRAL') {
      return 'contexto indeterminado até a normalização do fluxo de informações.';
    }

    // Zero Semantic Contradiction: CRITICAL and WARNING must override any stage optimism
    if (context.institutionalState === 'CRITICAL') {
      return 'O contexto sublinha condições de stress, onde a estabilização, preservação de caixa e normalização dos indicadores vitais assumem protagonismo natural.';
    }

    if (context.institutionalState === 'WARNING') {
      return 'O contexto reflete fatores de risco, onde a prudência operacional e a recomposição de margens de segurança tornam-se vetores explicativos dominantes.';
    }

    if (context.module === 'BP') {
      const stage = context.strategicStage;
      if (stage === 'recovery') return 'O panorama atual reforça a centralidade da estabilização financeira e recomposição gradual da capacidade operacional.';
      if (stage === 'stabilization') return 'O fortalecimento recente sustenta uma base favorável à redução de vulnerabilidades remanescentes.';
      if (stage === 'expansion') return 'A trajetória observada evidencia que a sustentação do crescimento demanda contínua disciplina de capital e liquidez.';
      if (stage === 'optimization') return 'A dinâmica vigente revela uma propensão natural a ganhos de produtividade e melhor utilização dos recursos.';
      if (stage === 'capital_allocation') return 'A robustez sistêmica eleva a relevância técnica de mecanismos para equilibrar reinvestimento produtivo, reserva de segurança e eficiência do capital.';
    }

    // HEALTHY fallback
    return 'O fortalecimento patrimonial recente forma uma base sólida de sustentação para a continuidade da operação.';
  }

  public static buildInstitutionalObservation(context: ExecutiveNarrativeContext): string {
    if (context.institutionalState === 'NEUTRAL') {
      return 'Ausência de demonstrações financeiras primárias limitando a avaliação contextual.';
    }
    
    const state = context.institutionalState.toLowerCase() as 'critical' | 'warning' | 'healthy';
    return context.dominantDriver.narratives[state];
  }

  private static getModuleSubject(module: string): string {
    switch (module) {
      case 'BP': return 'A estrutura patrimonial';
      case 'DRE': return 'O desempenho econômico';
      case 'DFC': return 'O fluxo operacional';
      case 'DLPA': return 'A distribuição de valor';
      default: return 'A operação';
    }
  }
}
