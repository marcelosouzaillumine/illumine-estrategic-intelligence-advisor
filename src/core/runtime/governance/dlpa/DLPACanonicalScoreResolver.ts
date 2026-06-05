export class DLPACanonicalScoreResolver {
  public static resolve(capitalPreservationScore: any): {
    score: number;
    value: number;
    classification: string;
    rationale: string;
  } {
    const score = capitalPreservationScore?.score ?? capitalPreservationScore?.value ?? 0;
    const classification = capitalPreservationScore?.classification || 'Capital Erodido';
    const rationale = capitalPreservationScore?.rationale || '';

    return {
      score,
      value: score,
      classification,
      rationale
    };
  }
}
