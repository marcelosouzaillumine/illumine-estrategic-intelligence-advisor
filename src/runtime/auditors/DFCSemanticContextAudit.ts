export function auditSemanticContextBinding(dfcInference: any, semanticContext: any, semanticSource: string): {
  semanticContextRootPresent: boolean;
  lifecycleProfilePresent: boolean;
  advisoryUsingELSA: boolean;
  cqsUsingELSA: boolean;
  eqsUsingELSA: boolean;
  panelUsingELSA: boolean;
  bindingMismatch: boolean;
} {
  const semanticContextRootPresent = !!dfcInference?.semanticContext;
  const lifecycleProfilePresent = !!dfcInference?.lifecycleProfile;
  const advisoryUsingELSA = dfcInference?.semanticSource === 'ELSA' || dfcInference?.lifecycleProfile !== undefined;
  const cqsUsingELSA = dfcInference?.cqsSemantic === 'ELSA' || dfcInference?.cqsSemantic !== null || advisoryUsingELSA;
  const eqsUsingELSA = dfcInference?.eqsSemantic === 'ELSA' || dfcInference?.eqsSemantic !== null || advisoryUsingELSA;
  
  const panelUsingELSA = semanticSource === 'ELSA';
  const bindingMismatch = advisoryUsingELSA === true && panelUsingELSA === false;

  if (bindingMismatch) {
    console.error('CRITICAL: DFC_CONTEXT_PANEL_BINDING_FAILURE');
  }

  return {
    semanticContextRootPresent,
    lifecycleProfilePresent,
    advisoryUsingELSA,
    cqsUsingELSA,
    eqsUsingELSA,
    panelUsingELSA,
    bindingMismatch
  };
}
