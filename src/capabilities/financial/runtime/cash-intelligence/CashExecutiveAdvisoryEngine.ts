export interface CompressedAdvisory {
  situacaoAtual: string;
  restricaoPrincipal: string;
  prioridadeEstrategica: string;
  outlook: string;
  fullTextLength: number;
}

/** Payload that includes deterministic lineage hash */
export interface AdvisoryPayload extends CompressedAdvisory {
  lineageHash: string;
}

import { LineageService } from '../../../../core/runtime/lineage/LineageService';
import { RuntimeLineageGuard } from '../../../../workspace/runtime/executive-consolidation/RuntimeLineageGuard';
export class CashExecutiveAdvisoryEngine {
  /**
   * Sintetiza o Advisory em formato executivo comprimido (max 600 caracteres)
   */
  public static compress(
    isBurning: boolean,
    dependencyCritical: boolean,
    primaryConstraint: string,
    runwayCritical: boolean
  ): CompressedAdvisory {
    
    let situacaoAtual = '';
    let restricao = '';
    let prioridade = '';
    let outlook = '';

    if (isBurning) {
      if (dependencyCritical) {
        situacaoAtual = 'A companhia dependeu da capitalização dos sócios para sustentar a liquidez.';
      } else {
        situacaoAtual = 'A operação consumiu reservas acumuladas para sustentar a liquidez no período.';
      }
      
      restricao = 'A operação consumiu caixa em ritmo superior à capacidade de geração operacional.';
      prioridade = 'Restabelecer a autossuficiência financeira operacional.';
      
      if (runwayCritical) {
        outlook = 'Sem reversão da geração operacional negativa de caixa, novos aportes serão necessários urgentemente para sustentar a continuidade.';
      } else {
        outlook = 'Sem reversão da geração operacional negativa de caixa, novos aportes serão necessários a médio ciclo para sustentar a continuidade.';
      }
    } else {
      situacaoAtual = 'A operação foi capaz de gerar caixa e manter sua independência financeira estrutural.';
      restricao = 'Otimização de capital de giro (estoques e recebíveis) para acelerar a conversão.';
      prioridade = 'Manter a eficiência operacional e reinvestir o caixa excedente com segurança.';
      outlook = 'Mantido o ciclo atual, a companhia continuará expandindo suas margens de liquidez organicamente.';
    }

    const fullText = `${situacaoAtual} ${restricao} ${prioridade} ${outlook}`;

    // Guarantee < 600 chars rule
    if (fullText.length > 600) {
      outlook = 'Risco de continuidade requer ajustes táticos (texto condensado).';
    }

    return {
      situacaoAtual,
      restricaoPrincipal: restricao,
      prioridadeEstrategica: prioridade,
      outlook,
      fullTextLength: `${situacaoAtual} ${restricao} ${prioridade} ${outlook}`.length
    };
  }
  /**
   * Generate full payload with deterministic lineage hash and guard validation.
   */
  public static generatePayload(
    isBurning: boolean,
    dependencyCritical: boolean,
    primaryConstraint: string,
    runwayCritical: boolean
  ): AdvisoryPayload {
    const compressed = this.compress(
      isBurning,
      dependencyCritical,
      primaryConstraint,
      runwayCritical,
    );
    const lineageHash = LineageService.createHash(compressed);
    const payload: AdvisoryPayload = { ...compressed, lineageHash };
    // Guard validates only in DEBUG/TECHNICAL (test/ci/dev)
    RuntimeLineageGuard.validate(payload);
    return payload;
  }
}

