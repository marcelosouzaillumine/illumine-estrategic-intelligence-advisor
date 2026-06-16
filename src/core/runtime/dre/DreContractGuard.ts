import { DreExecutiveViewModel } from './DreExecutiveViewModelBuilder';
import { DreEconomicScenario } from './DreScenarioClassifier';
import { DRE_SEMANTIC_BLACKLIST } from './DreSemanticRegistry';

export class DreContractGuard {
  private static readonly FORBIDDEN_TERMS = [
    ...DRE_SEMANTIC_BLACKLIST,
    'n/a',
    'n.a',
    'não aplicável',
    '[[',
    ']]'
  ];

  public static audit(viewModel: DreExecutiveViewModel): void {
    if (!viewModel.isValid) {
      return; 
    }

    const { policy, scenario, facts } = viewModel;

    // 1. Validar completude de P1 a P7 e Diagnóstico
    this.assertNotEmpty(policy.executiveDiagnosis.currentSituation, 'executiveDiagnosis.currentSituation');
    this.assertNotEmpty(policy.executiveDiagnosis.strategicPriority, 'executiveDiagnosis.strategicPriority');
    this.assertNotEmpty(policy.executiveDiagnosis.operationalOutlook, 'executiveDiagnosis.operationalOutlook');
    this.assertNotEmpty(policy.executiveDiagnosis.primaryRecommendation, 'executiveDiagnosis.primaryRecommendation');
    this.assertNotEmpty(policy.executiveDiagnosis.primaryEconomicDriver, 'executiveDiagnosis.primaryEconomicDriver');

    this.assertBoardQuestion(policy.boardQuestions.p1ValueCreation, 'boardQuestions.p1ValueCreation');
    this.assertBoardQuestion(policy.boardQuestions.p2StructureSupport, 'boardQuestions.p2StructureSupport');
    this.assertBoardQuestion(policy.boardQuestions.p3EconomicEquilibrium, 'boardQuestions.p3EconomicEquilibrium');
    this.assertBoardQuestion(policy.boardQuestions.p4PrimaryConstraint, 'boardQuestions.p4PrimaryConstraint');
    this.assertBoardQuestion(policy.boardQuestions.p5EconomicOpportunity, 'boardQuestions.p5EconomicOpportunity');
    this.assertBoardQuestion(policy.boardQuestions.p6InactionRisk, 'boardQuestions.p6InactionRisk');
    this.assertBoardQuestion(policy.boardQuestions.p7BoardPriority, 'boardQuestions.p7BoardPriority');

    // 2. Validar ausência de termos patrimoniais (Vazamento Semântico)
    const allText = JSON.stringify(policy).toLowerCase();
    for (const term of this.FORBIDDEN_TERMS) {
      if (allText.includes(term.toLowerCase())) {
        throw new Error(`[DRE Contract Guard] Vazamento semântico detectado. O termo proibido "${term}" foi encontrado na DRE.`);
      }
    }

    // 3. Validações de coerência lógica (Cenário vs Health Index vs Texto)
    if (scenario === DreEconomicScenario.ECONOMIC_STRESS || scenario === DreEconomicScenario.STRUCTURE_ABSORPTION_RISK) {
      if (policy.executiveDiagnosis.primaryRecommendation.toLowerCase().includes('acelerar crescimento')) {
        throw new Error(`[DRE Contract Guard] Coerência Falhou: Cenário de risco/prejuízo recomendando "acelerar crescimento".`);
      }
      if (policy.healthIndex >= 70) {
        throw new Error(`[DRE Contract Guard] Coerência Falhou: Cenário de risco com Health Index de ${policy.healthIndex} (incompatível).`);
      }
    }

    if (scenario === DreEconomicScenario.ACCELERATED_VALUE_CREATION && policy.healthIndex < 85) {
       throw new Error(`[DRE Contract Guard] Coerência Falhou: Cenário de Aceleração de Valor com Health Index < 85.`);
    }

    if (scenario === DreEconomicScenario.MARGIN_COMPRESSION && policy.healthIndex > 75) {
       throw new Error(`[DRE Contract Guard] Coerência Falhou: Crescimento Destrutivo com Health Index de ${policy.healthIndex} (jamais pode ser saudável/100).`);
    }

    if (facts.ebitdaMargin > 0.20 && scenario === DreEconomicScenario.STRUCTURE_ABSORPTION_RISK) {
        throw new Error(`[DRE Contract Guard] Coerência Falhou: Alta margem EBITDA classificada como Risco de Absorção.`);
    }
  }

  private static assertNotEmpty(value: string | undefined | null, fieldName: string): void {
    if (!value || value.trim().length === 0 || value.trim().toLowerCase() === 'n/a') {
      throw new Error(`[DRE Contract Guard] Violação de Contrato Executivo: O campo ${fieldName} não pode estar vazio ou ser nulo.`);
    }
  }

  private static assertBoardQuestion(question: any, fieldName: string): void {
    if (!question) {
        throw new Error(`[DRE Contract Guard] Violação de Contrato Executivo: O objeto ${fieldName} não existe.`);
    }
    this.assertNotEmpty(question.title, `${fieldName}.title`);
    this.assertNotEmpty(question.response, `${fieldName}.response`);
    this.assertNotEmpty(question.rationale, `${fieldName}.rationale`);
    this.assertNotEmpty(question.recommendation, `${fieldName}.recommendation`);
  }
}
