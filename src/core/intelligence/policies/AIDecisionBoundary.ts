/**
 * Explicitly defines the boundary between Artificial Intelligence capabilities
 * and Human executive authority.
 */
export interface AIDecisionBoundary {
  canSuggest: boolean;  // AI can propose a course of action (Recommendation)
  canApprove: boolean;  // AI can approve its own or others' suggestions (Must be false)
  canExecute: boolean;  // AI can trigger downstream systems automatically without human gating
}

export const CanonicalDecisionBoundary: AIDecisionBoundary = {
  canSuggest: true,
  canApprove: false, // Humans must explicitly approve via Human Intelligence Layer
  canExecute: false  // Execution is gated by Approval
};
