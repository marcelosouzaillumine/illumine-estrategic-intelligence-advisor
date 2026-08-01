import { useState, useCallback, useRef } from 'react';
import { CopilotMessage, ConversationContext, JourneyType } from './types';
import { conversationRouter } from './ConversationRouter';

export function useConversationEngine() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const queueActive = useRef(false);
  const initialized = useRef(false);
  
  const [context, setContext] = useState<ConversationContext>({
    profile: null,
    leadScore: 0,
    confidence: 0,
  });

  const addMessages = useCallback(async (newMessages: CopilotMessage[]) => {
    // Basic queue to prevent overlapping messages if called rapidly
    while (queueActive.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    queueActive.current = true;

    for (const msg of newMessages) {
      if (msg.sender === 'bot' || msg.sender === 'system') {
        setIsTyping(true);
        // Default delay 600ms, overrides by msg.delay
        const delay = msg.delay !== undefined ? msg.delay : (msg.type === 'insight' ? 1500 : 600);
        await new Promise(resolve => setTimeout(resolve, delay));
        setIsTyping(false);
      }
      setMessages(prev => [...prev, msg]);
    }
    
    queueActive.current = false;
  }, []);

  const initialize = useCallback(() => {
    if (initialized.current) return;
    initialized.current = true;
    addMessages(conversationRouter.getInitialMessages());
  }, [addMessages]);

  const handleUserSelect = useCallback((msgId: string, optionId: string, value?: any) => {
    const originalMsg = messages.find(m => m.id === msgId);
    if (!originalMsg) return;
    
    const selectedOption = originalMsg.options?.find(o => o.id === optionId);
    if (!selectedOption) return;

    // Remove options from the original message so they can't be clicked again
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, options: undefined } : m));

    // Add user message
    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      type: 'user',
      sender: 'user',
      content: selectedOption.label
    };
    
    setMessages(prev => [...prev, userMsg]);

    // Let the router handle the next step based on context
    const { nextMessages, newContext } = conversationRouter.handleInteraction(
      context, 
      originalMsg.nodeId || '', 
      optionId, 
      value
    );

    setContext(newContext);
    
    if (nextMessages && nextMessages.length > 0) {
      addMessages(nextMessages);
    }
  }, [messages, context, addMessages]);

  const reset = useCallback(() => {
    setMessages([]);
    setContext({ profile: null, leadScore: 0, confidence: 0 });
    queueActive.current = false;
    initialized.current = false;
    // We don't initialize here to prevent race conditions. The component will call initialize when empty.
  }, []);

  return {
    messages,
    isTyping,
    context,
    initialize,
    handleUserSelect,
    reset
  };
}
