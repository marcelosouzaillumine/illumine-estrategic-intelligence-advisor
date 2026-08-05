import { useState, useCallback, useRef, useEffect } from 'react';
import { AdvisoryMessage, ConversationContext, JourneyType, ConversationState } from '../types/advisory.types';
import { ExecutiveAdvisoryRouter } from './ExecutiveAdvisoryRouter';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useExecutiveExperience } from './useExecutiveExperience';

export function useExecutiveAdvisoryEngine(t: TFunction) {
  const {
    visibleMessages,
    isTyping,
    thinkingText,
    enqueueMessages,
    resetExperience,
    markOptionsInteracted
  } = useExecutiveExperience();

  const initialized = useRef(false);
  const { i18n } = useTranslation();
  
  const [context, setContext] = useState<ConversationContext>({
    profile: null,
    leadScore: 0,
    confidence: 0,
    answers: {},
  });

  const router = useRef(new ExecutiveAdvisoryRouter(t));
  const tRef = useRef(t);
  
  // Sync t function reference without triggering effects
  useEffect(() => {
    tRef.current = t;
    router.current = new ExecutiveAdvisoryRouter(t);
  }, [t]);

  // Sync router and reset chat when language changes
  useEffect(() => {
    if (initialized.current) {
      setContext({ profile: null, leadScore: 0, confidence: 0, answers: {} });
      resetExperience();
      enqueueMessages(router.current.getInitialMessages());
    }
  }, [i18n.language, resetExperience, enqueueMessages]);

  const initialize = useCallback(() => {
    if (initialized.current) return;
    initialized.current = true;
    enqueueMessages(router.current.getInitialMessages());
  }, [enqueueMessages]);

  const handleUserSelect = useCallback((msgId: string, optionId: string, value?: any) => {
    const originalMsg = visibleMessages.find(m => m.id === msgId);
    if (!originalMsg) return;
    
    const selectedOption = originalMsg.options?.find(o => o.id === optionId);
    if (!selectedOption) return;

    // Remove options from the original message so they can't be clicked again
    markOptionsInteracted(msgId);

    // Add user message directly to queue
    const userMsg: AdvisoryMessage = {
      id: Date.now().toString(),
      type: 'user',
      role: 'executive',
      content: selectedOption.label
    };
    
    enqueueMessages([userMsg]);

    // Let the router handle the next step based on context
    const updatedContext = {
      ...context,
      answers: {
        ...(context.answers || {}),
        [originalMsg.nodeId || msgId]: selectedOption.id
      }
    };

    const { nextMessages, newContext } = router.current.handleInteraction(
      updatedContext, 
      originalMsg.nodeId || '', 
      optionId, 
      value
    );

    setContext(newContext);
    
    if (nextMessages && nextMessages.length > 0) {
      enqueueMessages(nextMessages);
    }
  }, [visibleMessages, context, enqueueMessages, markOptionsInteracted]);

  const reset = useCallback(() => {
    setContext({ profile: null, leadScore: 0, confidence: 0 });
    resetExperience();
    initialized.current = false;
  }, [resetExperience]);

  return {
    messages: visibleMessages,
    isTyping,
    thinkingText,
    context,
    initialize,
    handleUserSelect,
    reset
  };
}
