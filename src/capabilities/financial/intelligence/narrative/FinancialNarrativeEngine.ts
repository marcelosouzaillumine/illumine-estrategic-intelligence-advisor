import { IntelligenceInterpretation } from '../../contracts/IntelligenceSignal';

export interface FinancialInsightContext {
    metric: string;
    value: string;
    historicalAverage?: string;
    threshold?: string;
    category: string;
}

export class FinancialNarrativeEngine {
    static generateInterpretation(context: FinancialInsightContext): IntelligenceInterpretation {
        // Fact: The observable metric and value.
        // Interpretation: The structural or financial meaning of that fact.
        // Causality/Epistemic Limit: Acknowledge that the root cause cannot be inferred from the balance sheet alone.

        const fact = `O indicador ${context.metric} registrou o valor de ${context.value}.`;
        
        let interpretationStr = "A estrutura apresenta comportamento contábil que requer análise complementar.";
        if (context.category === 'liquidity' || context.category === 'LIQUIDITY') {
             interpretationStr = "Esta proporção sugere uma dinâmica específica na relação entre ativos conversíveis e obrigações.";
        }
        else if (context.category === 'capital_structure' || context.category === 'STRUCTURE') {
             interpretationStr = "A composição do capital e as reservas indicam uma conformação patrimonial específica frente aos compromissos assumidos.";
        }
        else if (context.category === 'working_capital' || context.category === 'WORKING_CAPITAL') {
             interpretationStr = "O ciclo de recursos circulantes evidencia o modelo de financiamento das atividades de curto prazo.";
        }

        const epistemicLimit = "O Balanço Patrimonial por si só não comprova a causa operacional primária (ineficiência ou estratégia). Análise causal cruzada com DRE é necessária para conclusões definitivas.";

        return { text: `${fact} ${interpretationStr} ${epistemicLimit}` };
    }
}
