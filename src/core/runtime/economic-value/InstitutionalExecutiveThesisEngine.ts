// src/core/runtime/economic-value/InstitutionalExecutiveThesisEngine.ts

export interface ThesisInput {
  contexto: string;
  tensaoPrincipal: string;
  riscoDominante: string;
  oportunidadeDominante: string;
  direcaoRecomendada: string;
}

export interface ThesisOutput {
  narrative: string;
}

export class InstitutionalExecutiveThesisEngine {
  public static generate(input: ThesisInput): ThesisOutput {
    const sanitize = (text: string) => text.replace(/\[\[runtime\.[^\]]+\]\]/g, '').trim();

    // Construct single consolidated narrative
    const parts = [
      `Contexto: ${sanitize(input.contexto)}.`,
      `Tensão: ${sanitize(input.tensaoPrincipal)}.`,
      `Risco: ${sanitize(input.riscoDominante)}.`,
      `Oportunidade: ${sanitize(input.oportunidadeDominante)}.`,
      `Direção: ${sanitize(input.direcaoRecomendada)}.`
    ];

    let narrative = parts.join(' ').replace(/\s+/g, ' ');

    // Ensure it strictly obeys the 700-character constraint
    if (narrative.length > 700) {
      // If too long, build a shortened version
      const shortContext = sanitize(input.contexto).substring(0, 120);
      const shortTensao = sanitize(input.tensaoPrincipal).substring(0, 120);
      const shortRisco = sanitize(input.riscoDominante).substring(0, 120);
      const shortOportunidade = sanitize(input.oportunidadeDominante).substring(0, 120);
      const shortDirecao = sanitize(input.direcaoRecomendada).substring(0, 120);

      narrative = `Contexto: ${shortContext}. Tensão: ${shortTensao}. Risco: ${shortRisco}. Oportunidade: ${shortOportunidade}. Direção: ${shortDirecao}.`;
      if (narrative.length > 700) {
        narrative = narrative.substring(0, 697) + '...';
      }
    }

    return {
      narrative
    };
  }
}
