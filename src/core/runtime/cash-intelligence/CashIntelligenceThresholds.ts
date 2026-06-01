export const CashIntelligenceThresholds = {
  // Reconciliation Thresholds (Variance between DFC and BP/DRE inferred cash)
  RECONCILIATION: {
    ALLOWED_WITH_DISCLOSURE_MAX: 0.05, // 5%
    RESTRICTED_MAX: 0.10, // 10%
    BLOCKED_MAX: 0.20, // 20%
  },

  // Operating Cash Flow (FCO) Rules
  FCO: {
    // If Net Income > 0 but FCO < 0
    POSITIVE_NET_INCOME_NEGATIVE_FCO_MIN_SEVERITY: 'DETERIORATING' as const,
    
    // If EBITDA > 0 and FCO < 0
    POSITIVE_EBITDA_NEGATIVE_FCO_RECURRING: 'CRITICAL' as const,
    POSITIVE_EBITDA_NEGATIVE_FCO_ISOLATED: 'ATTENTION' as const,
    
    // Overall negative FCO default
    DEFAULT_NEGATIVE_FCO: 'DETERIORATING' as const
  }
} as const;
