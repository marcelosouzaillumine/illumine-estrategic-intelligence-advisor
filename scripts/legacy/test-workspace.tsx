import 'global-jsdom/register';
import { render, act } from '@testing-library/react';
import React from 'react';
import { ClientExecutiveWorkspace } from './src/components/pages/ClientExecutiveWorkspace';

async function run() {
  try {
    const { container } = render(<ClientExecutiveWorkspace selectedClient="client" selectedYear={2026} />);
    
    // Wait for the Dashboard to load (Wait for "Processando" to disappear)
    await act(async () => {
      await new Promise(r => setTimeout(r, 2000));
    });
    
    console.log("--- AFTER DASHBOARD RENDER (first 200 chars):", container.innerHTML.substring(0, 200));

    // Find the Conselho & Copilot button
    const btns = Array.from(document.querySelectorAll('button'));
    const boardBtn = btns.find(b => b.textContent?.includes('Conselho & Copilot'));
    if (!boardBtn) {
       console.log("ERROR: BUTTON NOT FOUND. Found buttons:", btns.map(b => b.textContent).join(', '));
       return;
    }

    // Click it
    console.log("--- CLICKING BOARD TAB ---");
    await act(async () => {
      boardBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    });

    // Check if Copilot Read-Only exists
    if (container.innerHTML.includes('Copilot Read-Only') || container.innerHTML.includes('Board Meeting Copilot')) {
       console.log("✅ SUCCESS: COPILOT IS MOUNTED");
    } else {
       console.log("❌ ERROR: COPILOT NOT MOUNTED! FULL HTML DUMP:");
       console.log(container.innerHTML);
    }
  } catch(e) {
    console.error("🔥 REACT CRASH DETECTED:", e);
  }
}
run();
