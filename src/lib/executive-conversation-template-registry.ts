// src/lib/executive-conversation-template-registry.ts

import type { ExecutiveConversationMode } from './executive-conversation-types';

export interface ExecutiveTemplate {
  mode: ExecutiveConversationMode;
  focusArea: string;
  templateStrings: Record<string, string>;
}

export class ExecutiveConversationTemplateRegistry {
  private static templates: ExecutiveTemplate[] = [
    {
      mode: 'BOARD',
      focusArea: 'RISKS',
      templateStrings: {
        insufficientContext: "Oversight limitations prevent a definitive assessment of this risk.",
        conflictObserved: "There are structural conflicts requiring Board-level intervention.",
        standardFinding: "Governance controls indicate specific structural behaviors."
      }
    },
    {
      mode: 'CEO',
      focusArea: 'EXECUTION',
      templateStrings: {
        insufficientContext: "Execution visibility is restricted; immediate operational clarity is required.",
        conflictObserved: "Strategic priorities are conflicting with execution capacity.",
        standardFinding: "Current execution patterns demonstrate identifiable trends."
      }
    },
    {
      mode: 'ADVISOR',
      focusArea: 'TRANSFORMATION',
      templateStrings: {
        insufficientContext: "Insufficient diagnostic data to validate an intervention.",
        conflictObserved: "Frictional anomalies detected; diagnostic review recommended.",
        standardFinding: "Diagnostic patterns suggest specific intervention vectors."
      }
    }
  ];

  static getTemplate(mode: ExecutiveConversationMode, topic: string): ExecutiveTemplate | undefined {
    return this.templates.find(t => t.mode === mode && t.focusArea === topic);
  }

  static getFallbackTemplate(mode: ExecutiveConversationMode): ExecutiveTemplate {
    return {
      mode,
      focusArea: 'GENERAL',
      templateStrings: {
        insufficientContext: mode === 'BOARD' ? "Information insufficient for Board oversight." : mode === 'CEO' ? "Lack of operational visibility to conclude." : "Diagnostic data unavailable.",
        conflictObserved: mode === 'BOARD' ? "Governance tensions detected." : mode === 'CEO' ? "Execution tensions detected." : "Diagnostic tensions detected.",
        standardFinding: mode === 'BOARD' ? "Institutional patterns observed." : mode === 'CEO' ? "Operational patterns observed." : "Intervention patterns observed."
      }
    };
  }
}
