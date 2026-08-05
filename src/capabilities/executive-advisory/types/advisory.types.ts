import { ReactNode } from 'react';

export type JourneyType = 
  | 'EXECUTIVE' 
  | 'BOARD' 
  | 'FINANCE' 
  | 'ADVISOR' 
  | 'ORGANIZATION' 
  | 'DISCOVERY'
  | 'CLIENT'
  | null;

export type ConversationState = 'LISTENING' | 'INTERPRETING' | 'CONNECTING' | 'RESPONDING' | 'GUIDING';

export type MessageType = 
  | 'bot' 
  | 'user' 
  | 'options' 
  | 'insight' 
  | 'summary' 
  | 'cta' 
  | 'advisor_card'
  | 'executive_brief'
  | 'transition';

export interface Option {
  id: string;
  label: string;
  value?: any;
}

export interface MessageCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

export type MessagePriority = 'short' | 'normal' | 'reflection' | 'executiveBrief';
export type MessagePhase = 'queued' | 'thinking' | 'rendered' | 'reading' | 'completed';

export interface AdvisoryMessage {
  id: string;
  nodeId?: string; // Links this message to a logic node in the router
  type: MessageType;
  role: 'advisor' | 'executive';
  content: string | ReactNode;
  options?: Option[];
  ctas?: MessageCTA[];
  priority?: MessagePriority; // Governs reading time and pacing
  phase?: MessagePhase;       // Managed by the experience engine
  delay?: number; // Simulated typing delay before this message appears (legacy, can be overridden by priority)
  thinkingStates?: string[]; // E.g., ['Interpretando cenário...', 'Analisando impacto...']
  metadata?: {
    journey?: string;
    intent?: string;
    briefData?: any; // For structured brief rendering
  };
}

export interface ConversationContext {
  profile: JourneyType;
  companySize?: string;
  specialty?: string;
  challenge?: string;
  leadScore: number;
  recommendedJourney?: string;
  confidence: number;
  answers?: Record<string, any>;
  [key: string]: any;
}
