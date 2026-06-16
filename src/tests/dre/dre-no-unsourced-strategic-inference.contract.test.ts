import test from 'node:test';
import assert from 'node:assert';
import { DreSemanticValidator, DRE_SEMANTIC_BLACKLIST } from '../../core/runtime/dre/DreSemanticRegistry';
import { DreExecutiveViewModelBuilder } from '../../core/runtime/dre/DreExecutiveViewModelBuilder';

test('DRE No Unsourced Strategic Inference: Must not contain extrapolated strategic words', async (t) => {
  const extrapolatedWords = [
    'm&a', 'fusão', 'aquisição', 'equity', 'valuation', 'tese de equity',
    'capex agressivo', 'cisne negro', 'cisnes negros', 'market share', 'market-share',
    'liderança setorial', 'dominação de mercado', 'excelência patrimonial',
    'marketing agressivo', 'marketing arrojado', 'expansão arrojada'
  ];

  // Verify that the semantic blacklist contains these terms
  for (const word of extrapolatedWords) {
    assert.ok(
      DRE_SEMANTIC_BLACKLIST.includes(word),
      `DRE_SEMANTIC_BLACKLIST must contain the extrapolated word: "${word}"`
    );
  }

  const payload2024 = {
    dreData: [
      { id: 'ROB', value: 1000000 },
      { id: 'DED', value: -100000 },
      { id: 'ROL', value: 900000 },
      { id: 'CUSTOS', value: -350000 },
      { id: 'LUCRO_BRUTO', value: 550000 },
      { id: 'DESP_OPER', value: -200000 },
      { id: 'EBITDA', value: 350000 },
      { id: 'EBIT', value: 330000 },
      { id: 'LUCRO_LIQ', value: 250000 }
    ],
    pontoEquilibrio: 327000
  };

  const viewModel = DreExecutiveViewModelBuilder.build(payload2024);

  // Validate the main executive text properties
  const textsToValidate = [
    viewModel.policy.executiveDiagnosis.currentSituation,
    viewModel.policy.executiveDiagnosis.primaryRecommendation,
    viewModel.policy.executiveDiagnosis.strategicPriority,
    viewModel.policy.executivePlan.shortTerm,
    viewModel.policy.executivePlan.mediumTerm,
    viewModel.policy.executivePlan.longTerm,
    viewModel.policy.historicalIntelligence.message
  ];

  for (const questionKey of Object.keys(viewModel.policy.boardQuestions)) {
    const q = viewModel.policy.boardQuestions[questionKey as keyof typeof viewModel.policy.boardQuestions];
    textsToValidate.push(q.response);
    textsToValidate.push(q.rationale);
    textsToValidate.push(q.recommendation);
  }

  for (const text of textsToValidate) {
    if (text) {
      const isIsolated = DreSemanticValidator.assertDomainIsolation(text);
      if (!isIsolated) {
         // Find which word failed for a better error message
         const failedWord = DRE_SEMANTIC_BLACKLIST.find(w => text.toLowerCase().includes(w.toLowerCase()));
         assert.fail(`Text contains extrapolated term "${failedWord}": "${text}"`);
      }
      assert.ok(isIsolated, 'Text must be free of unsourced strategic inferences.');
    }
  }
});
