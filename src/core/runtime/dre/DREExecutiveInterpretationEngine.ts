import { EconomicValueInput, EconomicValueNarrativeEngine } from './EconomicValueNarrativeEngine';
import { RecoverabilityInput, RecoverabilityAssessmentEngine } from './RecoverabilityAssessmentEngine';

export interface ExecutiveInterpretationInput {
  economicValueInput: EconomicValueInput;
  recoverabilityInput: RecoverabilityInput;
  recGrowth: number | null;
}

export interface ExecutiveInterpretationOutput {
  economicDiagnosis: string;
  primaryConstraint: string;
  recoverabilityAssessment: string;
  strategicPriority: string;
  boardOutlook: string;
}

export class DREExecutiveInterpretationEngine {
  public static evaluate(input: ExecutiveInterpretationInput): ExecutiveInterpretationOutput {
    const economicValue = EconomicValueNarrativeEngine.evaluate(input.economicValueInput);
    const recoverability = RecoverabilityAssessmentEngine.evaluate(input.recoverabilityInput);

    // 1. Economic Diagnosis
    let economicDiagnosis = economicValue.justificativa;

    // 2. Primary Constraint
    let primaryConstraint: string = economicValue.fonteProblema;
    if (primaryConstraint === 'Nenhum') primaryConstraint = 'Ausência de Restrições Estruturais';
    if (primaryConstraint === 'Escala') primaryConstraint = 'Escala Comercial';
    if (primaryConstraint === 'Margem') primaryConstraint = 'Margem de Contribuição / Precificação';
    if (primaryConstraint === 'Estrutura') primaryConstraint = 'Estrutura Operacional / Custo Fixo';

    // 3. Recoverability
    let recoverabilityAssessment = recoverability.classificacao;

    // 4. Strategic Priority
    let strategicPriority = '';
    if (economicValue.fonteProblema === 'Escala') {
      strategicPriority = 'Aumentar receita antes de expandir estrutura.';
    } else if (economicValue.fonteProblema === 'Margem') {
      strategicPriority = 'Revisar precificação e custos diretos para recuperar margem estrutural.';
    } else if (economicValue.fonteProblema === 'Estrutura') {
      strategicPriority = 'Otimizar ou redimensionar despesas operacionais fixas e administrativas.';
    } else {
      strategicPriority = 'Acelerar crescimento e ganho de market-share com preservação de margem.';
    }

    // 5. Board Outlook
    let boardOutlook = '';
    if (economicValue.geraValor === 'Sim') {
      boardOutlook = 'A empresa está preparada para captar valor ou acelerar crescimento sem risco estrutural iminente.';
    } else if (economicValue.geraValor === 'Parcialmente') {
      boardOutlook = 'O modelo de negócio se prova viável, mas o resultado final depende de reperfilamento financeiro ou alavancagem operacional adicional.';
    } else {
      boardOutlook = 'Sem crescimento de receita ou reestruturação de custos, a organização continuará consumindo capital para financiar a operação.';
    }

    return {
      economicDiagnosis,
      primaryConstraint,
      recoverabilityAssessment,
      strategicPriority,
      boardOutlook
    };
  }
}
