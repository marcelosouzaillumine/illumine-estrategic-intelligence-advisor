/**
 * Semantic Preservation Registry
 * 
 * Defines the institutional and executive terminology that must remain in English 
 * (or original form) across all languages, in order to preserve semantic precision 
 * and executive language consistency.
 */

export const SEMANTIC_PRESERVATION_TERMS = [
  'Governance',
  'Compliance',
  'Dashboard',
  'KPI',
  'EBITDA',
  'Framework',
  'Runtime',
  'Board',
  'Advisory',
  'Due Diligence',
  'Valuation',
  'Benchmark',
  'Benchmarking',
  'Workflow',
  'Cash Flow',
  'Business Governance',
  'Turnaround',
  'C-Level',
  'Enterprise',
  'White-label',
  'Insights',
  'Roadmap',
  'EFOS',
  'DLPA',
  'DFC',
  'DRE',
  'BP',
  'ROI',
  'ROE',
];

/**
 * Validates if a term is part of the preservation registry.
 * @param term The string to check.
 * @returns boolean true if the term must not be translated.
 */
export function isPreservedTerm(term: string): boolean {
  return SEMANTIC_PRESERVATION_TERMS.some(t => t.toLowerCase() === term.toLowerCase());
}
