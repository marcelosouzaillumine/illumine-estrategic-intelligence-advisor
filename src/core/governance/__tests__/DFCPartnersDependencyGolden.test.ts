import { describe, it, expect } from 'vitest';
import { DFCGovernanceOrchestrator } from '../runtime/governance/dfc/DFCGovernanceOrchestrator';

describe('DFCPartnersDependencyGolden - Granatum 2023 Rules', () => {
  it('deve classificar como DEPENDENCIA_CRITICA quando FCO é negativo e sócios cobrem mais de 70% da queima', () => {
    // Cenário: FCO negativo R$ -100k, Sócios aportam R$ 80k (80%)
    const output = DFCGovernanceOrchestrator.orchestrate(
      2023, 
      -100000, // FCO
      0,       // FCI
      80000,   // FCF
      -20000,  // Net Variation
      -50000,  // Accounting Profit
      80000,   // Shareholder contributions
      50000,   // BP Cash
      50000,   // DFC Cash
      5        // Runway
    );

    expect(output.classifications.shareholderDependency).toBe('DEPENDENCIA_CRITICA');
    expect(output.classifications.cashGenerationStatus).toBe('CONSUMO_OPERACIONAL');
  });

  it('deve classificar como DEPENDENCIA_RELEVANTE quando FCO é negativo e sócios cobrem entre 30% e 70%', () => {
    // Cenário: FCO negativo R$ -100k, Sócios aportam R$ 50k (50%)
    const output = DFCGovernanceOrchestrator.orchestrate(
      2023, 
      -100000, 
      0,       
      150000,  // Total FCF
      50000,   
      -50000,  
      50000,   // Shareholder contributions
      50000,   
      50000,   
      8        
    );

    expect(output.classifications.shareholderDependency).toBe('DEPENDENCIA_RELEVANTE');
  });

  it('deve classificar como DEPENDENCIA_MODERADA quando FCO é negativo, aportes são <= 30% e runway é seguro', () => {
    // Cenário: FCO negativo R$ -100k, Sócios aportam R$ 20k (20%), runway > 6 meses
    const output = DFCGovernanceOrchestrator.orchestrate(
      2023, 
      -100000, 
      0,       
      150000,  // Total FCF
      50000,   
      -50000,  
      20000,   // Shareholder contributions
      50000,   
      50000,   
      12       // Runway > 6
    );

    expect(output.classifications.shareholderDependency).toBe('DEPENDENCIA_MODERADA');
  });

  it('deve classificar como AUTOSSUFICIENTE quando FCO for positivo', () => {
    const output = DFCGovernanceOrchestrator.orchestrate(
      2023, 
      100000,  // FCO > 0
      -50000,       
      -20000,  
      30000,   
      80000,  
      0,       
      50000,   
      50000,   
      24       
    );

    expect(output.classifications.shareholderDependency).toBe('AUTOSSUFICIENTE');
    expect(output.narratives.executiveSummary).toContain('comprova autossuficiência fiduciária');
  });
});
