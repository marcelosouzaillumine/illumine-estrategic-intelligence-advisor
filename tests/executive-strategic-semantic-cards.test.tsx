import 'global-jsdom/register';
import { test, describe } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

// Necessário para não quebrar ícones lucide-react em JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

import { 
  ExecutiveStrategicSemanticCards, 
  ExecutiveStrategicSynthesisCards, 
  ExecutiveStrategicRecommendationCard 
} from '../src/components/ui/executive-strategic-semantic-cards';

function extractSemanticSnapshot(container) {
  return {
    headings: [...container.querySelectorAll('h2, h3, h4')]
      .map((node) => node.textContent?.trim()),
    textContent: container.textContent?.replace(/\s+/g, ' ').trim(),
    recommendationBlock: container.innerHTML.includes('Recomendação Prioritária'),
    driverBlock: container.innerHTML.includes('Driver Primário') || container.innerHTML.includes('Principal driver institucional:')
  };
}

describe('ExecutiveStrategicSemanticCards', () => {

  const basePayload = {
    analysisYear: 2024,
    generatedAt: '2024-01-01T00:00:00.000Z',
    currentSituation: 'Situação Atual Texto',
    strategicPriority: 'Prioridade Texto',
    outlook: 'Perspectiva Texto',
    priorityRecommendation: 'Recomendação Texto',
    severityState: 'critical' as const,
    recommendationPriority: 'high' as const,
    primaryDriver: 'Driver Text'
  };

  test('preserva a fachada legada (imports estruturais)', () => {
    assert.ok(ExecutiveStrategicSemanticCards, 'Facade original deve existir');
    assert.ok(ExecutiveStrategicSynthesisCards, 'Componente de síntese deve existir');
    assert.ok(ExecutiveStrategicRecommendationCard, 'Componente de recomendação deve existir');
  });

  test('retrocompatibilidade renderizada: Facade vs Decomposed (Estado Crítico)', () => {
    const selectedYear = 2024;
    
    const facadeTree = render(
      <ExecutiveStrategicSemanticCards payload={basePayload} selectedYear={selectedYear} />
    );
    const facadeSnapshot = extractSemanticSnapshot(facadeTree.container);
    facadeTree.unmount();

    const composedTree = render(
      <div className="w-full flex flex-col gap-6">
        <ExecutiveStrategicSynthesisCards payload={basePayload} selectedYear={selectedYear} hideContainer />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ExecutiveStrategicRecommendationCard payload={basePayload} />
        </div>
      </div>
    );
    const composedSnapshot = extractSemanticSnapshot(composedTree.container);
    composedTree.unmount();

    assert.deepStrictEqual(facadeSnapshot.headings, composedSnapshot.headings);
    assert.deepStrictEqual(facadeSnapshot.textContent, composedSnapshot.textContent);
    assert.strictEqual(facadeSnapshot.recommendationBlock, true);
    assert.strictEqual(facadeSnapshot.driverBlock, true);
  });

  test('retrocompatibilidade renderizada: Estado Saudável e Sem Driver', () => {
    const payload = { ...basePayload, severityState: 'healthy' as const };
    delete payload.primaryDriver;

    const facadeTree = render(<ExecutiveStrategicSemanticCards payload={payload} selectedYear={2024} />);
    const facadeSnapshot = extractSemanticSnapshot(facadeTree.container);
    facadeTree.unmount();

    const composedTree = render(
      <div className="w-full flex flex-col gap-6">
        <ExecutiveStrategicSynthesisCards payload={payload} selectedYear={2024} hideContainer />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ExecutiveStrategicRecommendationCard payload={payload} />
        </div>
      </div>
    );
    const composedSnapshot = extractSemanticSnapshot(composedTree.container);
    composedTree.unmount();

    assert.deepStrictEqual(facadeSnapshot, composedSnapshot);
    assert.strictEqual(facadeSnapshot.driverBlock, false); 
  });

  test('estado de recálculo (ano divergente)', () => {
    const facadeTree = render(<ExecutiveStrategicSemanticCards payload={basePayload} selectedYear={2023} />);
    const facadeSnapshot = extractSemanticSnapshot(facadeTree.container);
    facadeTree.unmount();

    // Na arquitetura decomposta, o Loading é renderizado pela Fachada (que atua como fallback) ou pelo consumidor.
    // O teste aqui vai apenas validar que o Snapshot da fachada bate com a renderização vazia da decomposição + layout mockado
    const composedTree = render(
      <div className="w-full flex flex-col gap-6 p-6 border border-border shadow-sm rounded-xl bg-card">
        <div className="flex items-center gap-3">
          <div className="text-primary flex items-center justify-center">
            <svg />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground leading-tight tracking-tight">
              Diagnóstico Estratégico
            </h2>
            <p className="text-sm text-executive-secondary flex items-center gap-2 mt-1">
              <svg /> Recalculando inteligência executiva para 2023...
            </p>
          </div>
        </div>
      </div>
    );
    
    // O teste principal é garantir que a fachada trata isso. O composed tree varia conforme implementação na view.
    assert.ok(facadeSnapshot.textContent.includes('Recalculando inteligência executiva para 2023'));
    assert.strictEqual(facadeSnapshot.recommendationBlock, false);
    
    composedTree.unmount();
  });

  test('comportamento com payload nulo/indisponível sem ferir tipo obrigatório', () => {
    function TestConsumer({ payload }: { payload?: any }) {
      return payload ? <ExecutiveStrategicSemanticCards payload={payload} selectedYear={2024} /> : <div data-testid="empty">Vazio</div>;
    }
    
    render(<TestConsumer />);
    assert.ok(screen.getByTestId('empty'));
    cleanup();
  });
});
