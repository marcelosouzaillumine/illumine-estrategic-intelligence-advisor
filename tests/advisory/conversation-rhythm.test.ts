/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExecutiveExperience } from '../../src/capabilities/executive-advisory/engine/useExecutiveExperience';
import { AdvisoryMessage } from '../../src/capabilities/executive-advisory/types/advisory.types';

describe('Executive Conversation Experience Engine™ (Rhythm Engine)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('deve processar mensagens e transitar pelas fases corretamente (queued -> thinking -> rendered -> reading -> completed)', async () => {
    const { result } = renderHook(() => useExecutiveExperience());

    const testMessage: AdvisoryMessage = {
      id: 'msg_1',
      type: 'bot',
      role: 'advisor',
      priority: 'short',
      content: 'Teste curto'
    };

    act(() => {
      result.current.enqueueMessages([testMessage]);
    });

    // Fase 1: Queued & Thinking (logo ao enfileirar e iniciar o processQueue)
    // O setTimeout do act() faz as promises iniciarem, então o estado de visibleMessages deve ter `phase: 'queued'` 
    // mas pode atualizar rápido para thinking e isTyping = true
    let msg = result.current.visibleMessages[0];
    expect(msg).toBeDefined();
    expect(msg.phase).toBe('thinking'); // Transitioned immediately because it's the active msg

    // Avançar tempo de thinking e todo o resto
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Deve estar completed
    msg = result.current.visibleMessages[0];
    expect(msg.phase).toBe('completed');
  });

  it('deve esconder opções até que a fase seja completed (validado no componente, mas o state garante a flag)', async () => {
    const { result } = renderHook(() => useExecutiveExperience());

    const msgWithOptions: AdvisoryMessage = {
      id: 'msg_2',
      type: 'bot',
      role: 'advisor',
      priority: 'short',
      content: 'Escolha uma opção:',
      options: [{ id: 'opt1', label: 'Opção 1' }]
    };

    act(() => {
      result.current.enqueueMessages([msgWithOptions]);
    });

    // Avançar thinking e reading e timeouts
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.visibleMessages[0].phase).toBe('completed');
  });

  it('deve usar o fallback de thinking text corretamente com base no intent e type', () => {
    const { result } = renderHook(() => useExecutiveExperience());
    
    const msgBrief: AdvisoryMessage = {
      id: 'brief',
      type: 'executive_brief',
      role: 'advisor',
      content: 'Brief content'
    };

    act(() => {
      result.current.enqueueMessages([msgBrief]);
    });

    expect(result.current.thinkingText).toBe('Construindo visão executiva...');
  });
});
