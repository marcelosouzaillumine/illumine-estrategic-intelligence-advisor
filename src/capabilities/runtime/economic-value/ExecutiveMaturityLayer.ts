// src/core/runtime/economic-value/ExecutiveMaturityLayer.ts

export type ExecutiveMaturityStage =
  | 'EMERGENTE'
  | 'ESTRUTURANDO'
  | 'CONSOLIDANDO'
  | 'ESCALANDO'
  | 'MATURIDADE_INSTITUCIONAL';

export interface ExecutiveMaturityOutput {
  stage: ExecutiveMaturityStage;
  label: string;
  description: string;
  severitySofteningFactor: number; // 0.5 for Emergente (softened), 1.0 for Mature (full severity)
}

export class ExecutiveMaturityLayer {
  public static evaluate(historicalCyclesCount: number, netRevenue: number): ExecutiveMaturityOutput {
    let stage: ExecutiveMaturityStage = 'EMERGENTE';
    let label = 'Emergente';
    let description = 'Empresa em estágio inicial de operação com base histórica reduzida.';
    let severitySofteningFactor = 0.5;

    if (historicalCyclesCount >= 4) {
      stage = 'MATURIDADE_INSTITUCIONAL';
      label = 'Maturidade Institucional';
      description = 'Operação madura com amplo histórico contábil e processos de governança robustos.';
      severitySofteningFactor = 1.0;
    } else if (historicalCyclesCount === 3) {
      stage = 'CONSOLIDANDO';
      label = 'Consolidando';
      description = 'Base operacional estabelecida em fase de consolidação de mercado.';
      severitySofteningFactor = 0.8;
    } else if (historicalCyclesCount === 2) {
      stage = 'ESTRUTURANDO';
      label = 'Estruturando';
      description = 'Transição da fase inicial com estruturação de processos e controles internos.';
      severitySofteningFactor = 0.65;
    } else {
      // 1 year or less
      if (netRevenue > 5000000) {
        stage = 'ESCALANDO';
        label = 'Escalando';
        description = 'Tração comercial acelerada e expansão rápida de receita.';
        severitySofteningFactor = 0.75;
      }
    }

    return {
      stage,
      label,
      description,
      severitySofteningFactor,
    };
  }
}
