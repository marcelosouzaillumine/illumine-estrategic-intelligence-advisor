export interface SemanticRootAudit {
  rootSource: string;
  lifecycleStage: string;
  semanticSource: string;
  semanticContextPresent: boolean;
  lifecycleProfilePresent: boolean;
  advisorySourcePresent: boolean;
  cqsSemanticPresent: boolean;
  eqsSemanticPresent: boolean;
}
