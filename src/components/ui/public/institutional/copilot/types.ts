import { ReactNode } from 'react';

export type JourneyType = 
  | 'EXECUTIVE' 
  | 'BOARD' 
  | 'FINANCE' 
  | 'ADVISOR' 
  | 'ORGANIZATION' 
  | 'DISCOVERY'
  | null;

export type MessageType = 
  | 'bot' 
  | 'user' 
  | 'options' 
  | 'insight' 
  | 'summary' 
  | 'cta' 
  | 'advisor_card';

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

export interface CopilotMessage {
  id: string;
  nodeId?: string; // Links this message to a logic node in the router
  type: MessageType;
  sender: 'bot' | 'user' | 'system';
  content: string | ReactNode;
  options?: Option[];
  ctas?: MessageCTA[];
  delay?: number; // Simulated typing delay before this message appears
}

export interface ConversationContext {
  profile: JourneyType;
  companySize?: string;
  specialty?: string;
  challenge?: string;
  leadScore: number;
  recommendedJourney?: string;
  confidence: number;
  [key: string]: any;
}
