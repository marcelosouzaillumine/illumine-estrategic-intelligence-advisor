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
