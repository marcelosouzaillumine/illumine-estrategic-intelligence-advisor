export interface ExecutiveNarrativeBlock {
  readonly headline: string;
  readonly situation: string;
  readonly interpretation: string;
  readonly recommendation: string;
  readonly reason: string;
  readonly evidence: string;
  readonly confidence: number;
  readonly nextStep: string;
}
