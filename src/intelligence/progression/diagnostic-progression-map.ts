export type ProgressionMap = Record<string, Record<string, string>>;

/**
 * Maps the current maturity output of a specific domain to the next recommended journey.
 */
export const DIAGNOSTIC_PROGRESSION_MAP: ProgressionMap = {
  financial: {
    // If maturity is Developing or lower, focus on planning
    initial: 'financial-planning',
    developing: 'financial-planning',
    
    // If maturity is Structured or higher, evolve to governance
    structured: 'governance-governance',
    advanced: 'governance-governance',
    excellence: 'governance-governance'
  },
  governance: {
    initial: 'leadership-governance',
    developing: 'leadership-governance',
    structured: 'operational-governance',
    advanced: 'operational-governance',
    excellence: 'operational-governance'
  }
};
