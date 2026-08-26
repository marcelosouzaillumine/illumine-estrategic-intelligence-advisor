import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveCommunicationProfiles } from '../src/core/executive-delivery/ExecutiveCommunicationProfiles';

describe('ExecutiveCommunicationProfiles Persona Preferences Tests', () => {
  const mockReport: any = {
    advisory: {
      executiveSummary: 'Operação financeira estável e robusta. ARR cresceu mais de 25% no ano fiscal corrente. Liquidez de caixa é satisfatória e cobre 12 meses de passivo circulante. Recomendamos reinvestimento.'
    }
  };

  it('1. Deve retornar as preferências corretas para cada persona', () => {
    const ceo = ExecutiveCommunicationProfiles.getProfile('CEO_PROFILE');
    assert.strictEqual(ceo.id, 'CEO_PROFILE');
    assert.strictEqual(ceo.narrativeVerbosity, 'SUMMARY');

    const board = ExecutiveCommunicationProfiles.getProfile('BOARD_PROFILE');
    assert.strictEqual(board.id, 'BOARD_PROFILE');
    assert.strictEqual(board.narrativeVerbosity, 'CONCISE');

    const advisor = ExecutiveCommunicationProfiles.getProfile('ADVISOR_PROFILE');
    assert.strictEqual(advisor.id, 'ADVISOR_PROFILE');
    assert.strictEqual(advisor.narrativeVerbosity, 'DETAILED');
  });

  it('2. Deve formatar a narrativa executiva passivamente de acordo com a verbosidade do perfil', () => {
    const conciseSummary = ExecutiveCommunicationProfiles.formatSummary(mockReport, 'BOARD_PROFILE');
    assert.ok(conciseSummary.length < mockReport.advisory.pureViewModel.executiveSummary.length);
    assert.ok(conciseSummary.includes('Operação financeira estável e robusta'));

    const detailedSummary = ExecutiveCommunicationProfiles.formatSummary(mockReport, 'ADVISOR_PROFILE');
    assert.strictEqual(detailedSummary, mockReport.advisory.pureViewModel.executiveSummary);
  });
});
