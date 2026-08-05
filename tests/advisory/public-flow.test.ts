import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutiveAdvisoryRouter } from '../../src/capabilities/executive-advisory/engine/ExecutiveAdvisoryRouter';
import { ExecutiveMemoryService } from '../../src/intelligence/memory/executive-memory.service';

describe('Public Intelligence Flow Recovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.window = { ExecutiveMemoryService } as any;
  });

  it('should capture Executive Profile context and inject into Memory, emitting a login redirect CTA', () => {
    const t = vi.fn((key: string, defaultText: string) => defaultText || key);
    const router = new ExecutiveAdvisoryRouter(t as any);

    const initialContext = {
      profile: null,
      leadScore: 0,
      confidence: 0,
    };

    // Simulate user selecting "EXECUTIVE" profile on the welcome message
    const { nextMessages, newContext } = router.handleInteraction(initialContext, 'welcome', 'EXECUTIVE');

    expect(newContext.profile).toBe('EXECUTIVE');
    expect(newContext.confidence).toBeGreaterThan(0);
    
    // Simulate user finishing the executive journey
    const finalStep = router.handleInteraction(newContext, 'exec_init', 'exec_execution');
    
    // Check if CTA was modified
    const ctaMessage = finalStep.nextMessages.find(m => m.type === 'cta');
    expect(ctaMessage).toBeDefined();
    
    // The new href should point to /login with a contextId
    const ctaBtn = ctaMessage?.ctas?.[0];
    expect(ctaBtn?.href).toMatch(/\/login\?contextId=EXECUTIVE_\d+/);
    
    // Extract contextId to verify memory injection
    const match = ctaBtn?.href.match(/contextId=(EXECUTIVE_\d+)/);
    expect(match).toBeTruthy();
    
    if (match) {
      const contextId = match[1];
      const memoryState = ExecutiveMemoryService.getInstance().getMemory(`temp_EXECUTIVE`);
      expect(memoryState).toBeDefined();
      expect(memoryState?.activeContexts['executive']?.id).toBe(contextId);
    }
  });
});
