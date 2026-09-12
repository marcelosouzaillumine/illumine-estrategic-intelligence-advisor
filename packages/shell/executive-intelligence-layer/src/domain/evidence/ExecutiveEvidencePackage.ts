import { Provenance } from './Provenance';
import { DecisionPackage } from '../decision/DecisionPackage';
import { ExecutiveNarrative } from '../narrative/ExecutiveNarrative';
import { LearningEvent } from '../learning/LearningEvent';
import { ExecutiveMaturityBenchmark } from '../benchmark/ExecutiveMaturityBenchmark';

/**
 * Envelope Mestre da Plataforma Illumine.
 * Esta é a ÚNICA saída oficial do motor cognitivo para o mundo externo.
 * Nenhuma API deve retornar dados espalhados; tudo deve ser envelopado aqui.
 */
export interface ExecutiveEvidencePackage {
  /**
   * Identificador único deste assessment.
   */
  id: string;

  /**
   * Metadados de versionamento para garantir governança e auditoria histórica.
   */
  metadata: {
    schemaVersion: string;
    engineVersion: string;
    rulesVersion: string;
    narrativeVersion: string;
    benchmarkVersion: string;
    generatedAt: string;
    companyId: string;
  };

  /**
   * Resultado bruto da integridade (Layer 0).
   */
  integrity: {
    passed: boolean;
    score: number;
    blockers: string[];
  };

  /**
   * Estado Financeiro detectado (Layer 1).
   */
  financialState: string;

  /**
   * Pacote fiduciário de decisão (Layer 3).
   */
  decisionAssessment: DecisionPackage;

  /**
   * Narrativa adaptativa gerada (Layer 4).
   */
  executiveNarrative: ExecutiveNarrative;

  /**
   * Diagnóstico Causal das raízes dos problemas (Layer 2).
   */
  causalDiagnostics: string[];

  /**
   * Benchmark de maturidade de inteligência do cliente (Layer 5).
   */
  benchmark?: ExecutiveMaturityBenchmark;

  /**
   * Histórico de aprendizado injetado na decisão atual (Layer 6).
   */
  historicalLearning?: LearningEvent[];

  /**
   * Trilha de auditoria probatória de todas as métricas críticas.
   */
  evidenceTrail: Provenance[];
}
