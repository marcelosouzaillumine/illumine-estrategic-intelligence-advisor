export enum SessionEvent {
  FIRST_ACCESS_OF_DAY = 'FIRST_ACCESS_OF_DAY',
  SESSION_RESUME = 'SESSION_RESUME',
  PAGE_CONTEXT_UPDATE = 'PAGE_CONTEXT_UPDATE',
  FIRST_PAGE_VISIT = 'FIRST_PAGE_VISIT',
  LONG_ABSENCE = 'LONG_ABSENCE',
  CRITICAL_EVENT = 'CRITICAL_EVENT',
  SILENT_MODE = 'SILENT_MODE'
}

export interface SessionContext {
  event: SessionEvent;
  timestamp: string;
  pageId?: string;
  criticalAlerts?: number;
  recommendations?: number;
  changes?: number;
  // Novos campos para alimentar o Score de Interação
  contextDescription?: string;
  impactDescription?: string;
  recipientIdentified?: boolean;
  potentialAction?: string;
  noveltyScore?: number; // 0-100
  urgencyScore?: number; // 0-100
  confidenceScore?: number; // 0-100
  isCriticalOverride?: boolean;
}
