// src/lib/executive-conversation-types.ts

import type { GovernanceCopilotQuestion, GovernanceCopilotReasoningResult } from './governance-copilot-reasoning-types';
import type { GovernanceCopilotContext } from './governance-copilot-types';

export type ExecutiveConversationMode = 'BOARD' | 'CEO' | 'ADVISOR';

export interface ExecutiveConversationInput {
  question: GovernanceCopilotQuestion;
  mode: ExecutiveConversationMode;
  governanceCopilotContext?: GovernanceCopilotContext;
  governanceCopilotReasoning?: GovernanceCopilotReasoningResult;
}

export interface ExecutiveConversationResponse {
  executiveSummary: string;
  keyFindings: string[];
  nextSuggestedTopics: string[];
}

export interface ExecutiveConversationTraceability {
  evidenceCount: number;
  memoryCount: number;
  conflictCount: number;
  confidenceLevel: string;
  sourceTopics: string[];
}

export interface ExecutiveConversationResult {
  mode: ExecutiveConversationMode;
  questionId: string;
  response: ExecutiveConversationResponse;
  traceability: ExecutiveConversationTraceability;
}

export interface ExecutiveConversationReportLike {
  governanceCopilotContext?: GovernanceCopilotContext;
  governanceCopilotReasoning?: GovernanceCopilotReasoningResult;
  executiveConversation?: ExecutiveConversationResult;
}
