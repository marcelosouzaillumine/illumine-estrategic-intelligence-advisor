import { IntelligenceSignal } from '../../contracts/IntelligenceSignal';
import { ExecutiveQuestion } from '../../contracts/ExecutiveQuestion';
import { ExecutivePositionSummary } from '../../contracts/ExecutivePositionSummary';

export class ExecutivePositionSummaryEngine {
  static synthesize(
    signals: IntelligenceSignal[],
    questions: ExecutiveQuestion[],
    healthStatus: string
  ): ExecutivePositionSummary {
    
    let classification = 'Vulnerabilidade moderada';
    let narrative = 'A estrutura apresenta gargalos que requerem acompanhamento analítico.';
    
    if (signals.length === 0) {
      classification = 'Posição analisada';
      narrative = 'Não existem alertas materiais isolados além do diagnóstico estrutural.';
    } else {
      const hasCriticalSignals = signals.some(s => s.severity === 'critical');
      const hasAttentionSignals = signals.some(s => s.severity === 'attention');

      if (hasCriticalSignals) {
        classification = 'Vulnerabilidade crítica identificada';
        narrative = 'As métricas indicam exposição estrutural refletida na deterioração simultânea de múltiplos indicadores centrais.';
      } else if (hasAttentionSignals) {
        classification = 'Atenção estrutural requerida';
        narrative = 'As métricas apontam concentração de recursos e pressão localizada em áreas específicas de análise.';
      } else {
        classification = 'Posição Estável';
        narrative = 'As evidências sugerem uma alocação equilibrada, sem focos evidentes de deterioração de curto prazo.';
      }
    }

    const strengths = [];
    const attentionPoints = [];

    signals.forEach(sig => {
      if (sig.severity === 'critical' || sig.severity === 'attention') {
        attentionPoints.push({
          title: sig.observation.text,
          explanation: sig.interpretation.text,
          relatedSignalId: sig.id
        });
      } else {
        strengths.push({
          title: sig.observation.text,
          explanation: sig.interpretation.text,
          relatedSignalId: sig.id
        });
      }
    });

    // Central Question (Primary Executive Insight) - Gate 20
    let centralQuestion = {
      question: 'Sem tópicos materiais identificados para a estrutura atual.',
      origin: 'Consolidação Executiva'
    };

    if (questions.length > 0) {
      // Find the question linked to the most critical signal
      const criticalSignal = signals.find(s => s.severity === 'critical') || signals.find(s => s.severity === 'attention');
      let targetQuestion = questions[0];

      if (criticalSignal && criticalSignal.metric) {
        const matchingQuestion = questions.find(q => q.originSignalId === criticalSignal.id);
        if (matchingQuestion) {
            targetQuestion = matchingQuestion;
        }
      }

      centralQuestion = {
        question: targetQuestion.question,
        origin: targetQuestion.id
      };
    } else if (signals.length > 0) {
        centralQuestion = {
            question: 'As evidências identificadas indicam necessidade de acompanhamento sem configuração imediata de risco sistêmico.',
            origin: 'Consolidação Executiva'
        };
    }

    return {
      status: {
        classification,
        narrative
      },
      strengths,
      attentionPoints,
      centralQuestion
    };
  }
}
