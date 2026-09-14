import { BenchmarkReference } from '../../../core/runtime/benchmark/BenchmarkReferenceEngine';
import { StrategicTarget } from '../../../core/runtime/strategy/StrategicTargetRuntime';

export interface InterpretationResult {
  currentValue: number;
  gapVsBenchmark: number;
  gapVsTarget: number;
  status: 'CRÍTICO' | 'ALERTA' | 'SAUDÁVEL' | 'EXCELÊNCIA';
  narrative: string;
}

export class OperationalEfficiencyInterpreter {
  /**
   * Compara o valor atual com benchmark, meta estratégica e threshold para gerar interpretação.
   */
  public static interpret(
    currentValue: number,
    benchmark: BenchmarkReference,
    target: StrategicTarget
  ): InterpretationResult {
    const gapVsBenchmark = currentValue - benchmark.targetValue;
    const gapVsTarget = currentValue - target.strategicTarget;
    
    let status: 'CRÍTICO' | 'ALERTA' | 'SAUDÁVEL' | 'EXCELÊNCIA';
    let narrative = '';

    if (currentValue < benchmark.prudenceThreshold) {
      status = 'CRÍTICO';
      narrative = 'A operação encontra-se significativamente abaixo da faixa mínima sustentável do setor.';
    } else if (currentValue < target.strategicTarget) {
      status = 'ALERTA';
      narrative = 'A operação possui margem funcional, porém não atinge a meta estratégica definida pelo conselho.';
    } else if (currentValue >= benchmark.targetValue) {
      status = 'EXCELÊNCIA';
      narrative = 'A operação demonstra eficiência superior à média setorial, operando com alta absorção estrutural.';
    } else {
      status = 'SAUDÁVEL';
      narrative = 'A operação opera dentro da faixa esperada, atingindo a meta mas com espaço para otimização setorial.';
    }

    return {
      currentValue,
      gapVsBenchmark,
      gapVsTarget,
      status,
      narrative
    };
  }
}
