import React from 'react';
import { ExecutiveSummarySection } from '../../../src/components/executive-architecture/executive-summary-section';
import { ExecutiveStrategicSynthesisCards } from '../../../src/components/ui/executive-strategic-semantic-cards';
import { ExecutiveStrategicRecommendationCard } from '../../../src/components/ui/executive-strategic-semantic-cards';
import { healthyFixture, criticalFixture, longTextFixture, recalculatingFixture } from './fixtures';

export default function EACSummaryVisualHarness() {
  // avoid hooks to bypass Invalid Hook Call if it's an import issue
  let scenario = 'healthy';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const scen = params.get('scenario');
    if (scen) scenario = scen;
  }

  let payload = healthyFixture;
  if (scenario === 'critical') payload = criticalFixture;
  if (scenario === 'long-text') payload = longTextFixture;
  if (scenario === 'recalculating') payload = recalculatingFixture;

  const mockViewModel = {
    ...payload,
    id: scenario,
    dataRef: '2024-01-01',
    clientId: 'mock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    month: 1,
    year: 2024,
    analysisYear: 2024
  } as any;

  const selectedYear = scenario === 'recalculating' ? 2023 : 2024;

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Reproduced from DREPage/DLPAPage */}
        <div className="mb-10 mt-10 flex flex-col w-full">
          <ExecutiveSummarySection aria-label="Síntese Executiva Teste">
            <div data-visual-role="current-situation">
              <ExecutiveStrategicSynthesisCards 
                payload={mockViewModel} 
                selectedYear={selectedYear} 
              />
            </div>
          </ExecutiveSummarySection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="hidden lg:block" />
            <div data-visual-role="recommendation">
              <ExecutiveStrategicRecommendationCard 
                payload={mockViewModel} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
