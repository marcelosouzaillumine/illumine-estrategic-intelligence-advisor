export interface IndustryWeights {
  inventoryConvertibility: number;
  receivablesConvertibility: number;
  idealCurrentLiquidity: number;
  workingCapitalTolerance: number; // Percentual of CGL negative vs EBITDA allowed
}

export function getIndustryWeights(industry?: string): IndustryWeights {
  const normIndustry = (industry || 'Geral').toLowerCase();

  if (normIndustry.includes('indústria') || normIndustry.includes('industria')) {
    return {
      inventoryConvertibility: 0.40, // Industrial inventory is slow and hard to liquidate
      receivablesConvertibility: 0.90,
      idealCurrentLiquidity: 1.3,
      workingCapitalTolerance: 0.15 // Higher tolerance for tied capital
    };
  }
  
  if (normIndustry.includes('varejo') || normIndustry.includes('comércio')) {
    return {
      inventoryConvertibility: 0.60, // Retail inventory converts faster with discounts
      receivablesConvertibility: 0.95,
      idealCurrentLiquidity: 1.1,
      workingCapitalTolerance: 0.10
    };
  }

  if (normIndustry.includes('serviços') || normIndustry.includes('servico')) {
    return {
      inventoryConvertibility: 0.0, // Services typically have no liquidatable inventory
      receivablesConvertibility: 0.85,
      idealCurrentLiquidity: 1.0,
      workingCapitalTolerance: 0.05 // Low tolerance, services must generate cash
    };
  }

  if (normIndustry.includes('tecnologia') || normIndustry.includes('saas') || normIndustry.includes('software')) {
    return {
      inventoryConvertibility: 0.0,
      receivablesConvertibility: 0.90, // MRR implies stability
      idealCurrentLiquidity: 1.0,
      workingCapitalTolerance: 0.20 // High tolerance if growth is fast
    };
  }

  if (normIndustry.includes('saúde') || normIndustry.includes('saude') || normIndustry.includes('hospital')) {
    return {
      inventoryConvertibility: 0.30, // Meds/Supplies
      receivablesConvertibility: 0.60, // Glosas and delayed payments from plans
      idealCurrentLiquidity: 1.5, // Needs higher buffer
      workingCapitalTolerance: 0.10
    };
  }

  if (normIndustry.includes('agronegócio') || normIndustry.includes('agro')) {
    return {
      inventoryConvertibility: 0.70, // Commodities have high liquidity
      receivablesConvertibility: 0.80,
      idealCurrentLiquidity: 1.2,
      workingCapitalTolerance: 0.25 // Highly cyclical
    };
  }

  if (normIndustry.includes('distribuição') || normIndustry.includes('logística')) {
    return {
      inventoryConvertibility: 0.65, // Fast moving goods
      receivablesConvertibility: 0.90,
      idealCurrentLiquidity: 1.2,
      workingCapitalTolerance: 0.15
    };
  }

  // Default / Geral
  return {
    inventoryConvertibility: 0.50,
    receivablesConvertibility: 0.90,
    idealCurrentLiquidity: 1.2,
    workingCapitalTolerance: 0.10
  };
}

export interface IndustryOkrs {
  targetCmvMax: number;
  targetEbitdaMin: number;
  targetAdminMax: number;
  targetFinMax: number;
  targetTribMax: number;
  targetAbsorcaoMin: number;
}

export function getIndustryOkrs(industry?: string): IndustryOkrs {
  const normIndustry = (industry || 'Geral').toLowerCase();
  
  if (normIndustry.includes('saas') || normIndustry.includes('tecnologia') || normIndustry.includes('software')) {
    return { targetCmvMax: 25, targetEbitdaMin: 25, targetAdminMax: 15, targetFinMax: 2, targetTribMax: 12, targetAbsorcaoMin: 2.0 };
  }
  if (normIndustry.includes('indústria') || normIndustry.includes('industria') || normIndustry.includes('manufatura') || normIndustry.includes('cosmético') || normIndustry.includes('cosmetico')) {
    return { targetCmvMax: 60, targetEbitdaMin: 15, targetAdminMax: 10, targetFinMax: 5, targetTribMax: 15, targetAbsorcaoMin: 1.5 };
  }
  if (normIndustry.includes('varejo') || normIndustry.includes('comércio')) {
    return { targetCmvMax: 70, targetEbitdaMin: 10, targetAdminMax: 12, targetFinMax: 3, targetTribMax: 10, targetAbsorcaoMin: 1.2 };
  }
  if (normIndustry.includes('saúde') || normIndustry.includes('hospital')) {
    return { targetCmvMax: 55, targetEbitdaMin: 18, targetAdminMax: 15, targetFinMax: 4, targetTribMax: 15, targetAbsorcaoMin: 1.3 };
  }
  if (normIndustry.includes('serviço')) {
    return { targetCmvMax: 40, targetEbitdaMin: 20, targetAdminMax: 15, targetFinMax: 3, targetTribMax: 12, targetAbsorcaoMin: 1.5 };
  }
  if (normIndustry.includes('agronegócio') || normIndustry.includes('agro')) {
    return { targetCmvMax: 65, targetEbitdaMin: 12, targetAdminMax: 8, targetFinMax: 6, targetTribMax: 10, targetAbsorcaoMin: 1.4 };
  }
  if (normIndustry.includes('distribuição') || normIndustry.includes('logística')) {
    return { targetCmvMax: 75, targetEbitdaMin: 8, targetAdminMax: 10, targetFinMax: 3, targetTribMax: 12, targetAbsorcaoMin: 1.1 };
  }

  // Default / Geral
  return { targetCmvMax: 50, targetEbitdaMin: 15, targetAdminMax: 12, targetFinMax: 4, targetTribMax: 15, targetAbsorcaoMin: 1.5 };
}
