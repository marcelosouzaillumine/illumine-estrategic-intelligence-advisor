export interface ScenarioValuationInput {
  clientId: string;
  scenarioId: string;
  revenueProjection: number[];
  ebitdaProjection: number[];
  taxRate: number; // percentage, e.g. 34.0
  capexProjection: number[];
  workingCapitalProjection: number[]; // NCG change
  discountRate: number; // WACC percentage, e.g. 14.0
  terminalGrowthRate: number; // percentage, e.g. 3.0
  depreciationAmortization?: number[]; // Not provided natively by basic proj, but useful
}

export interface ScenarioValuationOutput {
  scenarioId: string;
  fcffProjection: number[];
  presentValueOfFCFF: number;
  terminalValue: number;
  presentValueTerminal: number;
  enterpriseValue: number;
  valueDeltaVsBaseline: number;
  valueCreationStatus: 'Value Creating' | 'Value Neutral' | 'Value Destroying';
  assumptionsUsed: {
    discountRate: number;
    terminalGrowthRate: number;
    taxRate: number;
  };
}

/**
 * Validates inputs to ensure economic sense.
 */
export function validateValuationInputs(input: ScenarioValuationInput) {
  if (input.discountRate <= input.terminalGrowthRate) {
    throw new Error("ValuationError: Discount Rate (WACC) must be strictly greater than Terminal Growth Rate.");
  }
  if (!input.revenueProjection || input.revenueProjection.length === 0) {
    throw new Error("ValuationError: Missing revenue projection.");
  }
}

/**
 * Calculates Free Cash Flow to Firm (FCFF).
 * FCFF = EBITDA * (1 - TaxRate) + D&A * TaxRate - CAPEX - Change in NCG
 * Assuming D&A is roughly equal to maintenance CAPEX if not provided, or simply EBITDA * (1-TaxRate) - Growth CAPEX - NCG.
 */
export function calculateFCFFProjection(input: ScenarioValuationInput): number[] {
  const taxMultiplier = 1 - (input.taxRate / 100);
  
  return input.revenueProjection.map((_, i) => {
    const ebitda = input.ebitdaProjection[i] || 0;
    const capex = input.capexProjection[i] || 0;
    const ncg = input.workingCapitalProjection[i] || 0;
    const da = input.depreciationAmortization?.[i] || 0;

    // FCFF = EBIT*(1-t) + D&A - Capex - NCG
    // If we only have EBITDA, EBIT = EBITDA - D&A. 
    // So EBIT*(1-t) = (EBITDA - D&A)*(1-t).
    // Adding D&A back: FCFF = EBITDA*(1-t) - D&A*(1-t) + D&A - Capex - NCG
    // Which is EBITDA*(1-t) + D&A*t - Capex - NCG
    
    return (ebitda * taxMultiplier) + (da * (input.taxRate / 100)) - capex - ncg;
  });
}

/**
 * Calculates Present Value of projected FCFFs.
 */
export function calculateDiscountedCashFlow(fcff: number[], discountRate: number): number {
  const r = discountRate / 100;
  return fcff.reduce((pv, cashFlow, yearIndex) => {
    // yearIndex is 0-based. Year 1 is index 0.
    return pv + (cashFlow / Math.pow(1 + r, yearIndex + 1));
  }, 0);
}

/**
 * Calculates Terminal Value at the end of the projection period.
 * TV = FCFF_final * (1 + g) / (WACC - g)
 */
export function calculateTerminalValue(fcff: number[], discountRate: number, terminalGrowthRate: number): number {
  const r = discountRate / 100;
  const g = terminalGrowthRate / 100;
  const finalFCFF = fcff[fcff.length - 1] || 0;
  
  return (finalFCFF * (1 + g)) / (r - g);
}

/**
 * Calculates Total Enterprise Value.
 */
export function calculateEnterpriseValue(input: ScenarioValuationInput): Omit<ScenarioValuationOutput, 'valueDeltaVsBaseline' | 'valueCreationStatus'> {
  validateValuationInputs(input);

  const fcff = calculateFCFFProjection(input);
  const pvOfFcff = calculateDiscountedCashFlow(fcff, input.discountRate);
  
  const tv = calculateTerminalValue(fcff, input.discountRate, input.terminalGrowthRate);
  // Discount TV to present (using the last projection year)
  const r = input.discountRate / 100;
  const pvOfTv = tv / Math.pow(1 + r, fcff.length);

  const ev = pvOfFcff + pvOfTv;

  return {
    scenarioId: input.scenarioId,
    fcffProjection: fcff,
    presentValueOfFCFF: pvOfFcff,
    terminalValue: tv,
    presentValueTerminal: pvOfTv,
    enterpriseValue: ev,
    assumptionsUsed: {
      discountRate: input.discountRate,
      terminalGrowthRate: input.terminalGrowthRate,
      taxRate: input.taxRate
    }
  };
}

/**
 * Computes delta between Baseline and Scenario to identify Value Creation.
 */
export function calculateScenarioValueDelta(baselineInput: ScenarioValuationInput | null, scenarioInput: ScenarioValuationInput): ScenarioValuationOutput {
  const scenarioValuation = calculateEnterpriseValue(scenarioInput);
  
  let baselineEv = 0;
  if (baselineInput) {
    const baselineValuation = calculateEnterpriseValue(baselineInput);
    baselineEv = baselineValuation.enterpriseValue;
  }

  const delta = scenarioValuation.enterpriseValue - baselineEv;
  
  let status: 'Value Creating' | 'Value Neutral' | 'Value Destroying' = 'Value Neutral';
  // Use a tiny epsilon to handle floating point imprecision
  if (delta > 0.01) status = 'Value Creating';
  if (delta < -0.01) status = 'Value Destroying';

  return {
    ...scenarioValuation,
    valueDeltaVsBaseline: delta,
    valueCreationStatus: status
  };
}
