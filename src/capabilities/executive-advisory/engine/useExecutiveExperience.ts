import { useState, useCallback, useRef, useEffect } from 'react';
import { AdvisoryMessage, MessagePhase } from '../types/advisory.types';

export interface UseExecutiveExperienceResult {
  visibleMessages: AdvisoryMessage[];
  isTyping: boolean;
  thinkingText: string | null;
  enqueueMessages: (msgs: AdvisoryMessage[]) => void;
  resetExperience: () => void;
  markOptionsInteracted: (msgId: string) => void;
}

export function useExecutiveExperience(): UseExecutiveExperienceResult {
  const [messages, setMessages] = useState<AdvisoryMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingText, setThinkingText] = useState<string | null>(null);

  const messageQueue = useRef<AdvisoryMessage[]>([]);
  const isProcessing = useRef(false);

  const updateMessagePhase = useCallback((msgId: string, phase: MessagePhase) => {
    setMessages(prev => 
      prev.map(m => m.id === msgId ? { ...m, phase } : m)
    );
  }, []);

  const calculateReadingTime = (msg: AdvisoryMessage): number => {
    if (msg.type === 'user') return 0;
    
    // User formula: 700ms base + 180ms per visual line + semantic pause
    const contentStr = typeof msg.content === 'string' ? msg.content : '';
    const lineLength = 50; // chars per line approx
    const lines = Math.ceil((contentStr.length || 10) / lineLength);
    const base = 700;
    let time = base + (lines * 180);
    
    if (msg.priority === 'short') time = Math.min(time, 1500);
    if (msg.priority === 'normal') time = Math.max(time, 2500);
    if (msg.priority === 'reflection') time = Math.max(time, 3500);
    if (msg.priority === 'executiveBrief') time = Math.max(time, 5000);

    return time;
  };

  const getContextualThinkingText = (msg: AdvisoryMessage): string => {
    if (msg.thinkingStates && msg.thinkingStates.length > 0) {
      return msg.thinkingStates[0]; // Let priority dictate custom states if provided
    }
    
    if (msg.type === 'executive_brief' || msg.priority === 'executiveBrief') {
      return 'Construindo visão executiva...';
    }

    if (msg.nodeId?.includes('priority')) {
      return 'Relacionando fatores...';
    }

    if (msg.nodeId?.includes('context') || msg.nodeId?.includes('intent')) {
      return 'Interpretando cenário...';
    }

    if (msg.type === 'cta') {
      return 'Preparando próximos passos...';
    }

    return 'Analisando contexto...';
  };

  const processQueue = useCallback(async () => {
    if (isProcessing.current || messageQueue.current.length === 0) return;
    isProcessing.current = true;

    while (messageQueue.current.length > 0) {
      const msg = messageQueue.current.shift()!;
      
      // 1. Queue phase
      setMessages(prev => [...prev, { ...msg, phase: 'queued' }]);

      // 2. Thinking phase (skip for user messages)
      if (msg.role === 'advisor') {
        updateMessagePhase(msg.id, 'thinking');
        setThinkingText(getContextualThinkingText(msg));
        
        // Wait thinking time
        let thinkingTime = 1200;
        if (msg.priority === 'short') thinkingTime = 800;
        if (msg.priority === 'reflection') thinkingTime = 1500;
        if (msg.priority === 'executiveBrief') thinkingTime = 2500;
        
        await new Promise(r => setTimeout(r, thinkingTime));
        setThinkingText(null);
      }

      // 3. Rendered phase
      updateMessagePhase(msg.id, 'rendered');

      // 4. Reading phase
      if (msg.role === 'advisor') {
        updateMessagePhase(msg.id, 'reading');
        const readingTime = calculateReadingTime(msg);
        await new Promise(r => setTimeout(r, readingTime));
        
        // Semantic Pause before next message or options
        const semanticPause = msg.priority === 'reflection' ? 600 : 300;
        await new Promise(r => setTimeout(r, semanticPause));
      }

      // 5. Completed phase (options will now show)
      updateMessagePhase(msg.id, 'completed');
    }

    isProcessing.current = false;
  }, [updateMessagePhase]);

  const enqueueMessages = useCallback((newMsgs: AdvisoryMessage[]) => {
    messageQueue.current.push(...newMsgs);
    processQueue();
  }, [processQueue]);

  const resetExperience = useCallback(() => {
    messageQueue.current = [];
    isProcessing.current = false;
    setMessages([]);
    setIsTyping(false);
    setThinkingText(null);
  }, []);

  const markOptionsInteracted = useCallback((msgId: string) => {
    setMessages(prev => 
      prev.map(m => m.id === msgId ? { ...m, options: undefined } : m)
    );
  }, []);

  return {
    visibleMessages: messages,
    isTyping,
    thinkingText,
    enqueueMessages,
    resetExperience,
    markOptionsInteracted
  };
}
