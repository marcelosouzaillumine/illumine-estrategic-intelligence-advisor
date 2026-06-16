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

  public static buildPrioridadeEstrategica(context: ExecutiveNarrativeContext): string {
    if (context.institutionalState === 'NEUTRAL') {
      return 'Estabelecer rastreabilidade de dados financeiros.';
    }

    if (context.institutionalState === 'CRITICAL') {
      return `${context.dominantDriver.strategicPriority.critical}, contenção de expansão, preservação de caixa e normalização dos indicadores vitais.`;
    }

    if (context.institutionalState === 'WARNING') {
      return `${context.dominantDriver.strategicPriority.warning}, preservação de margem de segurança e disciplina na alocação de recursos.`;
    }

    // HEALTHY
    return `${context.dominantDriver.strategicPriority.healthy}.`;
  }

  public static buildOutlook(context: ExecutiveNarrativeContext): string {
    if (context.institutionalState === 'NEUTRAL') {
      return 'Cenário indeterminado até a normalização do fluxo de informações.';
    }

    // Zero Semantic Contradiction: CRITICAL and WARNING must override any stage optimism
    if (context.institutionalState === 'CRITICAL') {
      return 'O cenário exige foco total em estabilização, sobrevivência, preservação de caixa, continuidade operacional e normalização dos indicadores vitais.';
    }

    if (context.institutionalState === 'WARNING') {
      return 'O cenário exige prudência, eficiência operacional, monitoramento contínuo e recomposição de margens de segurança.';
    }

    if (context.module === 'BP') {
      const stage = context.strategicStage;
      if (stage === 'recovery') return 'A prioridade permanece na estabilização financeira e recomposição gradual da capacidade operacional.';
      if (stage === 'stabilization') return 'O fortalecimento recente cria condições para consolidar ganhos e reduzir vulnerabilidades remanescentes.';
      if (stage === 'expansion') return 'O desafio passa a ser sustentar o crescimento preservando disciplina de capital, liquidez e eficiência operacional.';
      if (stage === 'optimization') return 'O foco estratégico migra para ganhos de produtividade e melhor utilização dos recursos disponíveis.';
      if (stage === 'capital_allocation') return 'A elevada capacidade financeira exige a formalização de uma política de excedentes, equilibrando reinvestimento produtivo, reserva de segurança e eficiência do capital.';
    }

    // HEALTHY fallback
    return 'O fortalecimento patrimonial recente cria uma sólida fundação para a execução contínua do plano de negócios.';
  }

  public static buildPriorityRecommendation(context: ExecutiveNarrativeContext): string {
    if (context.institutionalState === 'NEUTRAL') {
      return 'Levantar as demonstrações financeiras primárias para iniciar a avaliação fiduciária.';
    }
    
    const state = context.institutionalState.toLowerCase() as 'critical' | 'warning' | 'healthy';
    return context.dominantDriver.priorityRecommendation[state];
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
