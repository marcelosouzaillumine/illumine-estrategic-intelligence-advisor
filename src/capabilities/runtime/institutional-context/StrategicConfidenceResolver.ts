import { IResolverContext, StrategicConfidence } from './types';

export class StrategicConfidenceResolver {
  static resolve(ctx: IResolverContext): StrategicConfidence {
    const bp = ctx.bpSummary || {};
    const reasons: string[] = [];
    
    // 1. Data Confidence (Integridade e Completude Técnica)
    let dataConfidence: 'HIGH' | 'MODERATE' | 'LOW' = 'HIGH';
    
    if (ctx.rawData?.isMockData) {
      dataConfidence = 'LOW';
      reasons.push('Demonstrações financeiras fictícias / mocks de simulação.');
    } else {
      if (bp.isBalanced === false) {
        dataConfidence = 'LOW';
        reasons.push(`Balanço Patrimonial desbalanceado com divergência de R$ ${Math.abs(bp.divergence || 0).toLocaleString('pt-BR')}.`);
      } else if (bp.divergence && Math.abs(bp.divergence) > 100) {
        dataConfidence = 'MODERATE';
        reasons.push(`Pequena divergência de conciliação contábil detectada (R$ ${Math.abs(bp.divergence).toLocaleString('pt-BR')}).`);
      }
      
      if (bp.hasOrphans) {
        dataConfidence = 'MODERATE';
        reasons.push('Presença de contas órfãs sem nós pais no Balanço.');
      }
      
      if (bp.hasDuplicates) {
        dataConfidence = 'MODERATE';
        reasons.push('Presença de contas duplicadas mapeadas no Balanço.');
      }
    }

    // Se temos apenas um dos demonstrativos (ex: só BP ou só DRE)
    const hasDRE = !!ctx.dreCascade && ctx.dreCascade.length > 0;
    const hasBP = Object.keys(bp).length > 0;
    if (!hasDRE || !hasBP) {
      dataConfidence = 'LOW';
      reasons.push('Visão financeira incompleta (ausência de DRE integrada ou Balanço Patrimonial).');
    }

    // 2. Strategic Confidence (Suficiência Contextual e Profundidade Histórica)
    let strategicConfidence: 'HIGH' | 'MODERATE' | 'LIMITED_CONTEXT' | 'UNVERIFIABLE' = 'HIGH';
    
    if (ctx.historicalCyclesCount <= 1) {
      strategicConfidence = 'LIMITED_CONTEXT';
      reasons.push('Suficiência contextual limitada: Ausência de série histórica para validação YoY e tendências.');
    } else if (ctx.historicalCyclesCount === 2) {
      strategicConfidence = 'LIMITED_CONTEXT';
      reasons.push('Suficiência contextual limitada: Histórico de apenas 2 ciclos longitudinais.');
    } else if (ctx.historicalCyclesCount === 3) {
      strategicConfidence = 'MODERATE';
      reasons.push('Suficiência contextual moderada: Histórico contábil com 3 ciclos.');
    } else {
      reasons.push(`Série temporal longitudinal robusta (${ctx.historicalCyclesCount} anos de histórico contábil).`);
    }

    // Se data confidence for baixa, prejudica a confiança estratégica
    if (dataConfidence === 'LOW') {
      strategicConfidence = 'UNVERIFIABLE';
      reasons.push('A integridade técnica frágil dos dados impede conclusões estratégicas seguras.');
    } else if (dataConfidence === 'MODERATE' && strategicConfidence === 'HIGH') {
      strategicConfidence = 'MODERATE';
    }

    return {
      dataConfidence,
      strategicConfidence,
      reasons
    };
  }
}
