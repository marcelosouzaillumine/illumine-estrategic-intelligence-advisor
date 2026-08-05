import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutiveAdvisoryRouter } from '../../src/capabilities/executive-advisory/engine/ExecutiveAdvisoryRouter';
import { ConversationContext } from '../../src/capabilities/executive-advisory/types/advisory.types';
import { ExecutiveMemoryService } from '../../src/intelligence/memory/executive-memory.service';

describe('Wave B.3.7 — Conversation Integrity Certification™', () => {
  let router: ExecutiveAdvisoryRouter;
  let context: ConversationContext;
  let t = (key: string, fallback: string) => fallback;

  beforeEach(() => {
    (global as any).window = {};
    router = new ExecutiveAdvisoryRouter(t as any);
    context = {
      contextId: `test_context_${Date.now()}`,
      profile: null,
      stage: 'WELCOME',
      history: [],
      confidence: 0,
      leadScore: 0
    };
  });

  describe('Gate 1 - Brand & Vocabulary Restrictions', () => {
    it('Should never use legacy or bot terminology', () => {
      const messages = router.getInitialMessages();
      const outputText = (messages[0].content as string).toLowerCase();

      expect(outputText).not.toContain('copilot');
      expect(outputText).not.toContain('copiloto');
      expect(outputText).not.toContain('chatbot');
      expect(outputText).not.toContain('assistente virtual');
      expect(outputText).not.toContain('inteligência artificial');
    });
  });

  describe('Gate 6 - Conversation Integrity™ (Executive Journey)', () => {
    it('Should execute the full Executive flow with Readings, Insights, and unique CTA', () => {
      // 1. Welcome -> Select Executive
      const { nextMessages: execMsgs, newContext: c1 } = router.handleInteraction(context, 'welcome', 'EXECUTIVE');
      context = c1;
      expect(context.profile).toBe('EXECUTIVE');
      const text1 = execMsgs.map(m => m.content).join(' ');
      expect(text1).toContain('compreender melhor o contexto executivo'); // Transition

      // 2. Select Scenario (e.g. Crescimento)
      const { nextMessages: scenMsgs, newContext: c2 } = router.handleInteraction(context, 'exec_step_context', 'ctx-growth');
      context = c2;
      const text2 = scenMsgs.map(m => m.content).join(' ');
      expect(text2).toContain('enfrentam um desafio curioso'); // Reading
      expect(text2).toContain('qual pilar estrutural tem exigido maior foco'); // Question

      // 3. Select Priority (e.g. Liderança)
      const { nextMessages: prioMsgs, newContext: c3 } = router.handleInteraction(context, 'exec_step_priority', 'prio-people');
      context = c3;
      const text3 = prioMsgs.map(m => m.content).join(' ');
      expect(text3).toContain('Liderança e cultura determinam o limite da capacidade de execução'); // Insight
      expect(text3).toContain('urgência'); // Question

      // 4. Select Urgency (e.g. Imediata)
      const { nextMessages: urgMsgs, newContext: c4 } = router.handleInteraction(context, 'exec_step_urgency', 'urg-resolve');
      
      const finalMsg = urgMsgs[urgMsgs.length - 1];
      expect(finalMsg).toBeDefined();
      
      const text4 = urgMsgs.map(m => m.content).join(' ');
      // Should generate an Executive Brief and CTA
      expect(text4).toContain('uma organização em fase de crescimento');
      expect(text4).toContain('Pessoas e Liderança');
      
      // Should offer a CTA to workspace or advisory
      expect(finalMsg.ctas?.length).toBeGreaterThan(0);
      const ctaText = finalMsg.ctas?.map(o => o.label).join(' ');
      expect(ctaText).toContain('Acessar Workspace Executivo');
    });
  });

  describe('Gate 6 - Conversation Integrity™ (Advisor Journey)', () => {
    it('Should execute the full Advisor flow uniquely', () => {
      // 1. Welcome -> Select Advisor
      const { nextMessages: advMsgs, newContext: c1 } = router.handleInteraction(context, 'welcome', 'ADVISOR');
      context = c1;
      expect(context.profile).toBe('ADVISOR');
      const text1 = advMsgs.map(m => m.content).join(' ');
      expect(text1).toContain('potencializa a atuação'); // Transition

      // 2. Select Intent (e.g. Aumentar Portfólio)
      const { nextMessages: intMsgs, newContext: c2 } = router.handleInteraction(context, 'adv_step_intent', 'adv-talk');
      context = c2;
      const text2 = intMsgs.map(m => m.content).join(' ');
      expect(text2).toContain('Identificamos uma intenção direta de alinhamento estratégico');
      
      // Should offer specific Advisor CTA (different from Executive)
      const finalMsg = intMsgs[intMsgs.length - 1];
      const ctaText = finalMsg.ctas?.map(o => o.label).join(' ');
      expect(ctaText).toContain('Parcerias'); // Base on CTA definition in AdvisorJourney
    });
  });

  describe('Gate 6 - Conversation Integrity™ (Client Journey)', () => {
    it('Should route directly to login for existing clients', () => {
      const { nextMessages: cliMsgs, newContext: c1 } = router.handleInteraction(context, 'welcome', 'CLIENT');
      context = c1;
      expect(context.profile).toBe('CLIENT');
      
      const text1 = cliMsgs.map(m => m.content).join(' ');
      expect(text1).toContain('Bem-vindo de volta');
      
      const finalMsg = cliMsgs[0];
      const ctaText = finalMsg.options?.map(o => o.label).join(' ');
      expect(ctaText).toContain('Entrar na Plataforma');
      expect(ctaText).toContain('Suporte');
    });
  });
});
