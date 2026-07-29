import React from 'react';
import { createRoot } from 'react-dom/client';
import EACSummaryVisualHarness from './EACSummaryVisualHarness';
import '../../../src/index.css';

import EACWave01VisualHarness from './EACWave01VisualHarness';
import EACWave02A1VisualHarness from './EACWave02A1VisualHarness';
import EACWave02A2VisualHarness from './EACWave02A2VisualHarness';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  let target = '';
  let wave = '';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    target = params.get('target') || '';
    wave = params.get('wave') || '';
  }

  const renderHarness = () => {
    if (wave === '02a2') return <EACWave02A2VisualHarness />;
    if (wave === '02a1') return <EACWave02A1VisualHarness />;
    if (target) return <EACWave01VisualHarness />;
    return <EACSummaryVisualHarness />;
  };

  root.render(
    <React.StrictMode>
      {renderHarness()}
    </React.StrictMode>
  );
}

