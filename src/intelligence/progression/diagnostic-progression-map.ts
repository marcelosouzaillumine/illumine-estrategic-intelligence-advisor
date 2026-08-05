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
    structured: 'governance-intelligence',
    advanced: 'governance-intelligence',
    excellence: 'governance-intelligence'
  },
  governance: {
    initial: 'leadership-intelligence',
    developing: 'leadership-intelligence',
    structured: 'operational-intelligence',
    advanced: 'operational-intelligence',
    excellence: 'operational-intelligence'
  }
};
