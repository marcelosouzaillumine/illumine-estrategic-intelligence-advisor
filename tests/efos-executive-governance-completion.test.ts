import { ExecutiveStrategicMaturityEngine } from '../src/core/runtime/executive-consolidation/ExecutiveStrategicMaturityEngine';
import { CrossStatementPropagationEngine } from '../src/core/runtime/executive-consolidation/CrossStatementPropagationEngine';
import { CrossStatementExecutiveNarrativeEngine } from '../src/core/runtime/executive-consolidation/CrossStatementExecutiveNarrativeEngine';
import { DominantRiskResolver, PriorityDecisionResolver } from '../src/core/runtime/executive-consolidation/Resolvers';
import { BoardDecisionEscalationEngine } from '../src/core/runtime/executive-consolidation/BoardDecisionEscalationEngine';
import { BoardTop3DecisionEngine } from '../src/core/runtime/executive-prioritization/BoardTop3DecisionEngine';
import { BADIConsistencyEngine } from '../src/core/runtime/executive-consolidation/BADIConsistencyEngine';
import { EFOSExecutiveConsistencyAuditEngine } from '../src/core/runtime/executive-consolidation/EFOSExecutiveConsistencyAuditEngine';
import { ExecutiveRecommendationDeduplicationEngine } from '../src/core/runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('EFOS Executive Governance Completion Framework v1.0', () => {
  it('1. Snapshot não retorna respostas binárias', () => {
    const result = ExecutiveStrategicMaturityEngine.evaluate({
      fco: -100,
      fcf: -100,
      lucroLiquido: -200,
      patrimonioLiquido: -50,
      runwayMonths: 2,
      capitalConsumido: 50
    });
    assert.strictEqual(result.survivalStatus, 'Dependente de Liquidez Externa');
    assert.strictEqual(result.valueCreationStatus, 'Destruição Acelerada');
    assert.strictEqual(result.capitalProtectionStatus, 'Capital Fragilizado');
  });

  it('2. DRE -> DFC -> DLPA é detectado e gera tensão', () => {
    const propagations = CrossStatementPropagationEngine.detect({
      lucroLiquido: -100,
      ebitda: -50,
      fco: -50,
      liquidezReal: 0.8,
      runway: 2,
      capitalConsumido: 100
    });
    assert.ok(propagations.tensions.some((t: any) => t.chain === 'DRE_DFC_DLPA'));
    assert.strictEqual(propagations.tensions.length > 0, true);
    
    const narrative = CrossStatementExecutiveNarrativeEngine.generateNarrative(propagations);
    assert.strictEqual(narrative.hasTension, true);
    assert.ok(narrative.narrative.includes('prejuízo econômico'));
  });

  it('3. BADI > 70 exige BoardTop3', () => {
    const escalation = BoardDecisionEscalationEngine.requiresEscalation({
      badiScore: 75,
      runwayMonths: 10,
      capitalConsumido: 0,
      fco: 100,
      lucroLiquido: 100,
      patrimonioLiquido: 1000
    });
    assert.strictEqual(escalation, true);
  });

  it('4. BoardTop3 nunca retorna vazio sob risco fiduciário e retorna exatamente 3', () => {
    const decisions = BoardTop3DecisionEngine.generate({ scores: { composite: 30 } }, true);
    assert.strictEqual(decisions.length, 3);
    assert.ok(['Capital', 'Estratégia', 'Risco', 'Governança', 'Destruição de Valor', 'Liquidez'].includes(decisions[0].domain!));
  });

  it('5. DominantRisk não pode ser genérico', () => {
    const risk = DominantRiskResolver.resolve({
      fco: -100,
      lucroLiquido: -200,
      runwayMonths: 4,
      capitalConsumido: 50,
      patrimonioLiquido: -10,
      liquidezReal: 0.5
    });
    assert.notStrictEqual(risk, 'Risco sistêmico.');
    assert.strictEqual(risk, 'Dependência de capitalização para continuidade operacional.');
  });

  it('6. PriorityDecision não pode ser genérica', () => {
    const decision = PriorityDecisionResolver.resolve({
      fco: -100,
      lucroLiquido: -200,
      runwayMonths: 4,
      capitalConsumido: 50,
      patrimonioLiquido: -10,
      liquidezReal: 0.5
    });
    assert.notStrictEqual(decision, 'Revisão estratégica executiva.');
    assert.strictEqual(decision, 'Atingir break-even operacional antes do esgotamento da capacidade de capitalização.');
  });

  it('7. Recomendações duplicadas são removidas e fundidas', () => {
    const recs = ExecutiveRecommendationDeduplicationEngine.deduplicate([
      { text: 'Preservar caixa da operação', type: 'EXECUTIVE', impact: 'Alto' },
      { text: 'Melhorar liquidez imediatamente', type: 'EXECUTIVE', impact: 'Alto' },
      { text: 'Estabilizar tesouraria', type: 'EXECUTIVE', impact: 'Alto' }
    ]);
    assert.ok(recs.executiveTop5[0].text.includes('preservação de caixa'));
    assert.strictEqual(recs.executiveTop5.length, 1);
  });

  it('8. EFOSExecutiveConsistencyAudit retorna CONSISTENT se regras forem seguidas', () => {
    const audit = EFOSExecutiveConsistencyAuditEngine.audit({
      badiScore: 80,
      boardTop3: [
        { titulo: 'Aporte de Capital', problema: 'Necessidade de fundos', impactoEsperado: 'Restaurar liquidez', prazoRecomendadoLabel: '', consequenciaInacao: '', impactLabel: '', urgencyLabel: '', origin: '', evidence: [], domain: 'Capital' } as any,
        { titulo: 'Risco sistêmico', problema: 'Ameaça externa', impactoEsperado: 'Mitigação', prazoRecomendadoLabel: '', consequenciaInacao: '', impactLabel: '', urgencyLabel: '', origin: '', evidence: [], domain: 'Risco' } as any,
        { titulo: 'Governança', problema: 'Falta de controle', impactoEsperado: 'Adoção de comitê', prazoRecomendadoLabel: '', consequenciaInacao: '', impactLabel: '', urgencyLabel: '', origin: '', evidence: [], domain: 'Governança' } as any
      ],
      lucroLiquido: -100,
      fco: -50,
      tensions: [{ chain: 'DRE_DFC_DLPA', category: 'VALUE_DESTRUCTION_CHAIN', severity: 'CRITICAL', evidence: {}, narrative: '', source: 'CANONICAL_PROPAGATION' } as any],
      patrimonioLiquido: -10,
      capitalConsumido: 100,
      runwayMonths: 2,
      dominantRisk: 'Dependência de capitalização.',
      priorityDecision: 'Atingir break-even para proteger o caixa.',
      dlpaCapitalStatus: 'Capital Fragilizado',
      snapshotCapitalProtectionStatus: 'Capital Fragilizado',
      executiveTop5: [{ text: 'Preservar caixa da operação', type: 'EXECUTIVE', impact: 'Alto' }]
    });
    assert.strictEqual(audit.status, 'EFOS_EXECUTIVE_CONSISTENT');
  });

  it('9. EFOSExecutiveConsistencyAudit retorna INCONSISTENT se BADI alto mas sem Tensão e sem BoardTop3', () => {
    const valid = BADIConsistencyEngine.validate(80, false, []);
    assert.strictEqual(valid, false);

    const audit = EFOSExecutiveConsistencyAuditEngine.audit({
      badiScore: 80,
      boardTop3: [{ titulo: 'Recapitalização', problema: 'p', impactoEsperado: 'i', prazoRecomendadoLabel: '', consequenciaInacao: '', impactLabel: '', urgencyLabel: '', origin: '', evidence: [], domain: 'Capital' } as any],
      lucroLiquido: -100,
      fco: -100,
      tensions: [{ chain: 'DRE_DFC_DLPA', category: 'VALUE_DESTRUCTION_CHAIN', severity: 'CRITICAL', evidence: {}, narrative: '', source: 'CANONICAL_PROPAGATION' } as any],
      patrimonioLiquido: -50,
      capitalConsumido: 100,
      runwayMonths: 1,
      dominantRisk: 'Dependência de capitalização para sobrevivência.',
      priorityDecision: 'Recompor caixa e reestruturar passivo de curto prazo.',
      dlpaCapitalStatus: 'Capital Fragilizado',
      snapshotCapitalProtectionStatus: 'Capital Fragilizado',
      executiveTop5: [{ text: 'teste', type: 'EXECUTIVE', impact: 'Baixo' }]
    });
    // With all proper variables, it will flag because boardTop3 is incomplete for some rules, but the test name is about BADI without tension.
    // However, here we force an INCONSISTENT status. We will test the 'empty board top 3'
    const audit2 = EFOSExecutiveConsistencyAuditEngine.audit({
      badiScore: 80,
      boardTop3: [],
      lucroLiquido: 100,
      fco: 100,
      tensions: [],
      patrimonioLiquido: 1000,
      capitalConsumido: 0,
      runwayMonths: 12,
      dominantRisk: 'Operacional',
      priorityDecision: 'Operacional',
      dlpaCapitalStatus: 'Capital Preservado',
      snapshotCapitalProtectionStatus: 'Capital Preservado',
      executiveTop5: []
    });
    assert.strictEqual(audit2.status, 'EFOS_EXECUTIVE_INCONSISTENT');
    assert.ok(audit2.violations.length > 0);
  });
});

