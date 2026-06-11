import { EconomicValueInput, EconomicValueNarrativeEngine } from './EconomicValueNarrativeEngine';
import { RecoverabilityInput, RecoverabilityAssessmentEngine } from './RecoverabilityAssessmentEngine';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';
import { ExecutiveAnalysisContext } from '../executive-consolidation/StrategicOpinionConsistencyEngine';

export interface ExecutiveInterpretationInput {
  economicValueInput: EconomicValueInput;
  recoverabilityInput: RecoverabilityInput;
  recGrowth: number | null;
  context?: ExecutiveAnalysisContext;
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
    let rawPrimaryConstraint: string = economicValue.fonteProblema;
    if (rawPrimaryConstraint === 'Nenhum') rawPrimaryConstraint = 'Ausência de Restrições Estruturais';
    if (rawPrimaryConstraint === 'Escala') rawPrimaryConstraint = 'Escala Comercial';
    if (rawPrimaryConstraint === 'Margem') rawPrimaryConstraint = 'Margem de Contribuição / Precificação';
    if (rawPrimaryConstraint === 'Estrutura') rawPrimaryConstraint = 'Estrutura Operacional / Custo Fixo';

    let primaryConstraint = rawPrimaryConstraint;
    if (input.context) {
      const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(input.context, rawPrimaryConstraint);
      primaryConstraint = motive.label;
    }

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
