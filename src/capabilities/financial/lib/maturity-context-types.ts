export enum NarrativeStage {
  FORMATION = "FORMATION",
  SCALING = "SCALING",
  SUSTAINABLE = "SUSTAINABLE",
  RECOVERY = "RECOVERY",
  STRESSED = "STRESSED",
  TRANSITION = "TRANSITION",
}

export interface MaturityContext {
  /** The lifecycle stage derived from ILAE */
  stage: NarrativeStage;
  /** Human‑readable description of the stage */
  description: string;
  // Future fields can be added without breaking existing contracts
}

export interface NarrativeStageOutput {
  /** The stage for which the narrative is generated */
  stage: NarrativeStage;
  /** Portuguese narrative text, always includes fiduciary‑supremacy disclaimer */
  text: string;
}
