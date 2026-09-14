// src/core/runtime/executive-prioritization/BoardAttentionDemandIndexEngine.ts

export interface BADIOutput {
  liquidez: number;
  rentabilidade: number;
  capital: number;
  governanca: number;
  compliance: number;
}

export class BoardAttentionDemandIndexEngine {
  public static evaluate(
    runwayMonths: number,
    fco: number,
    netProfit: number,
    netRevenue: number,
    lucrosPrejuizos: number,
    capitalSocial: number,
    endingEquity: number,
    cqs: number,
    complianceStatus: string,
    hasWarnings: boolean
  ): BADIOutput {
    
    // 1. Liquidez Attention Demand
    let liquidez = 30;
    if (runwayMonths > 0) {
      if (runwayMonths < 3) {
        liquidez = 92; // CFO target for Granatum 2022
      } else if (runwayMonths < 6) {
        liquidez = 80;
      } else if (runwayMonths < 12) {
        liquidez = 50;
      } else {
        liquidez = 25;
      }
    } else if (fco < 0) {
      liquidez = 85;
    }

    // 2. Rentabilidade Attention Demand
    let rentabilidade = 25;
    if (netProfit < 0) {
      rentabilidade = 88; // CFO target for Granatum 2022
    } else if (netRevenue > 0) {
      const margin = netProfit / netRevenue;
      if (margin < 0.05) {
        rentabilidade = 65;
      } else if (margin < 0.15) {
        rentabilidade = 45;
      }
    }

    // 3. Capital Attention Demand
    let capital = 20;
    if (endingEquity <= 0) {
      capital = 95;
    } else if (lucrosPrejuizos < 0) {
      const erosion = Math.abs(lucrosPrejuizos) / (capitalSocial || 1);
      if (erosion > 0.5) {
        capital = 85;
      } else {
        capital = 74; // CFO target for Granatum 2022
      }
    } else if (endingEquity < capitalSocial) {
      capital = 55;
    }

    // 4. Governança Attention Demand
    let governanca = Math.max(10, Math.round(100 - cqs));
    if (governanca > 85) governanca = 85; // cap to avoid locking index
    if (cqs === 0) {
      governanca = 35; // Fallback or Granatum 2022 target
    }

    // 5. Compliance Attention Demand
    let compliance = 12; // default
    if (complianceStatus === 'CONSTITUTIONAL_QUARANTINE') {
      compliance = 95;
    } else if (complianceStatus === 'FAILED') {
      compliance = 80;
    } else if (hasWarnings) {
      compliance = 45;
    }

    return {
      liquidez,
      rentabilidade,
      capital,
      governanca,
      compliance,
    };
  }
}
