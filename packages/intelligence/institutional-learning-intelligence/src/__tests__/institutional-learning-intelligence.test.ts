/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import {
  InstitutionalWisdomEngine,
  InstitutionalMemoryLedgerEngine,
  DecisionCalibrationEngine,
  WisdomGraphEvolutionEngine,
  HumanFeedbackSynthesizer,
  InstitutionalLearningEngine
} from '../index';

describe('Wave 19.5 — Institutional Learning Governance Layer (ILI v1.0)', () => {
  it('should synthesize InstitutionalWisdomObject with episodic memory', () => {
    const wisdom = InstitutionalWisdomEngine.synthesizeWisdom('dec-01', 'EPISODIC', 3.5, 'Redução de custos operacionais aumentou EBITDA.');
    expect(wisdom.decisionId).toBe('dec-01');
    expect(wisdom.memoryType).toBe('EPISODIC');
    expect(wisdom.confidenceAdjustment).toBe(0.05);
    expect(wisdom.wisdomHash).toContain('wisdom-hash-');
  });

  it('should process full learning cycle and store wisdom in ledger', () => {
    const cycle = InstitutionalLearningEngine.processLearningCycle('empresa-01', 'dec-02', 'SEMANTIC', 4.0, 'Revisão contratual trimestral previne sangria de margem.');
    expect(cycle.companyId).toBe('empresa-01');
    expect(cycle.totalWisdomCount).toBeGreaterThan(0);
  });

  it('should generate causal graph evolution signal and calibrate decision weight', () => {
    const wisdom = InstitutionalWisdomEngine.synthesizeWisdom('dec-03', 'PROCEDURAL', 2.0, 'Gatilho preventivo acionado.');
    const signal = WisdomGraphEvolutionEngine.generateCausalEvolutionSignal(wisdom);
    expect(signal.targetGraphNode).toContain('node-');

    const newWeight = DecisionCalibrationEngine.calculateCalibratedWeight(0.8, wisdom);
    expect(newWeight).toBe(0.85);

    const feedback = HumanFeedbackSynthesizer.synthesizeHumanFeedback('Excelente diretriz de governança.', 5);
    expect(feedback.qualitativeScore).toBe(5);
  });
});
