export interface ExecutiveBaseViewModel {
  visible: {
    title?: string;
    subtitle?: string;
    description?: string;
    attentionLabel?: string;
    statusLabel?: string;
    recommendation?: string;
    [key: string]: unknown; // Allow extensions for specialized visual fields
  };
  internal?: {
    id?: string;
    sourceModule?: string;
    traceId?: string;
    runtimeCode?: string;
    [key: string]: unknown; // Allow extensions for specialized internal fields
  };
}

export interface ExecutiveCardViewModel extends ExecutiveBaseViewModel {
  visible: ExecutiveBaseViewModel["visible"] & {
    title: string;
    subtitle?: string;
    attentionLabel?: string;
    description: string;
  };
}

export interface ExecutiveSectionViewModel extends ExecutiveBaseViewModel {
  visible: ExecutiveBaseViewModel["visible"] & {
    title: string;
    statusLabel?: string;
  };
}

export interface ExecutiveLatencyViewModel extends ExecutiveBaseViewModel {
  visible: ExecutiveBaseViewModel["visible"] & {
    totalDurationMs: number;
    stages: { stage: string; durationMs: number }[];
    bottlenecks: string[];
  };
}

export interface ExecutiveHealthViewModel extends ExecutiveBaseViewModel {
  visible: ExecutiveBaseViewModel["visible"] & {
    confidenceLevel: string;
    confidenceLabel: string;
    causalDepth: string;
    dataCompletenessPercent: string;
    modeLabel: string;
    restrictions: string[];
  };
}

export interface ExecutiveViolationViewModel extends ExecutiveBaseViewModel {
  visible: ExecutiveBaseViewModel["visible"] & {
    severityLabel: string;
    message: string;
    context: string;
  };
}

export interface ExecutiveConfidenceBadgeViewModel extends ExecutiveBaseViewModel {
  visible: ExecutiveBaseViewModel["visible"] & {
    confidenceLevel: string;
    label: string;
  };
}
