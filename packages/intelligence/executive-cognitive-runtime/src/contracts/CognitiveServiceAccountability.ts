export interface Evidence {
  id: string;
  sourceType: string;
  description: string;
  weight: number;
}

export interface CognitiveServiceResult {
  /**
   * The name of the service that generated this result (e.g., "ExecutiveReflectionService").
   */
  serviceName: string;
  
  /**
   * The version ID of the decision package that this service consumed as input.
   */
  inputPackageVersion: string;
  
  /**
   * The version ID of the decision package that this service produced.
   */
  outputVersion: string;
  
  /**
   * The exact evidence used by this service to formulate its contribution.
   */
  evidenceUsed: Evidence[];
  
  /**
   * The mathematical impact on the overall confidence score (-100 to +100).
   */
  confidenceImpact: number;
  
  /**
   * The global lineage ID that binds this result to the original observation.
   */
  lineageId: string;
}
