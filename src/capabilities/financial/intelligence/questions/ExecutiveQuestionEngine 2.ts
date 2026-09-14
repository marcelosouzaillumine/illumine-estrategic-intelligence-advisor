import { IntelligenceSignal } from '../../contracts/IntelligenceSignal';
import { ExecutiveQuestion } from '../../contracts/ExecutiveQuestion';

export class ExecutiveQuestionEngine {
    static generateQuestionsForSignals(signals: IntelligenceSignal[]): ExecutiveQuestion[] {
        return signals.map((s, index) => {
            let intent: "understand" | "evaluate" | "investigate" = "understand";
            let question = `Como a variação estrutural apontada em ${s.observation.text} se manifestou durante o período?`;
            
            if (s.severity === 'critical') {
                intent = "investigate";
                question = `Quais movimentações estruturais refletem o quadro de alerta sinalizado pela evidência: ${s.evidence.text}?`;
            } else if (s.severity === 'attention') {
                intent = "evaluate";
                question = `Como a métrica em atenção (${s.evidence.text}) se comportou em relação às demais contas do Balanço?`;
            }

            return {
                id: `q_${s.id}`,
                question,
                context: "Avaliação baseada em evidências contábeis consolidadas.",
                originSignalId: s.id,
                intent
            };
        });
    }
}
