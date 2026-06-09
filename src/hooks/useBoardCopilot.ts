import { CopilotRuntimeAdapter } from '../services/CopilotRuntimeAdapter';
import { useState, useMemo, useCallback } from 'react';
import type { GovernanceCopilotQuestion } from '../lib/governance-copilot-reasoning-types';
import type { ExecutiveConversationResult } from '../lib/executive-conversation-types';




export interface CopilotMessage {
  id: string;
  type: 'QUESTION' | 'ANSWER';
  text?: string;
  result?: ExecutiveConversationResult;
  timestamp: Date;
}

export function useBoardCopilot(baseReport: any, prescriptiveData: any) {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate suggested questions based on the prescriptive data (agenda, decisions, etc)
  const suggestedQuestions = useMemo(() => {
    if (!prescriptiveData || !prescriptiveData.boardAgenda) return [];
    
    const questions: GovernanceCopilotQuestion[] = [];
    
    // Always include some fiduciary base questions
    questions.push({ questionId: 'q-overall-risk', text: 'Quais os principais riscos emergentes neste ciclo?' });
    questions.push({ questionId: 'q-fiduciary-priority', text: 'Qual a prioridade fiduciária máxima neste momento?' });

    // Include questions based on the agenda items
    prescriptiveData.boardAgenda.items.forEach((item: any, index: number) => {
      questions.push({
        questionId: `q-agenda-${index}`,
        text: `Me dê mais contexto sobre o tópico da agenda: "${item.topic}".`
      });
    });

    // Include questions based on board resolutions
    prescriptiveData.boardResolutions.forEach((res: any, index: number) => {
      questions.push({
        questionId: `q-res-${index}`,
        text: `Quais evidências suportam a minuta de deliberação: "${res.title}"?`
      });
    });

    return questions;
  }, [prescriptiveData]);

  const askQuestion = useCallback((question: GovernanceCopilotQuestion) => {
    setIsProcessing(true);
    
    // Add question message
    setMessages(prev => [...prev, {
      id: `msg-q-${Date.now()}`,
      type: 'QUESTION',
      text: question.text,
      timestamp: new Date()
    }]);

    // Process deterministically
    setTimeout(() => {
      try {
        // 1. Context Adapter
        const reportWithContext = CopilotRuntimeAdapter.runGovernanceCopilotAdapter(baseReport);
        
        // 2. Reasoning Adapter
        const reportWithReasoning = CopilotRuntimeAdapter.runGovernanceCopilotReasoningAdapter(reportWithContext, question);
        
        // 3. Conversation Adapter
        const finalReport = CopilotRuntimeAdapter.runExecutiveConversationAdapter(reportWithReasoning, question, 'BOARD');
        
        if (finalReport.executiveConversation) {
          setMessages(prev => [...prev, {
            id: `msg-a-${Date.now()}`,
            type: 'ANSWER',
            result: finalReport.executiveConversation,
            timestamp: new Date()
          }]);
        }
      } catch (e) {
        console.error('Error running Copilot Layer:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 500); // Small delay to simulate processing but it's purely deterministic local execution
  }, [baseReport]);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isProcessing,
    suggestedQuestions,
    askQuestion,
    clearHistory
  };
}
