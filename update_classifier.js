const fs = require('fs');
const file = 'src/core/runtime/executive-consolidation/BalanceSheetScenarioClassifier.ts';
let content = fs.readFileSync(file, 'utf8');

const newInterface = `
export interface InstitutionalScenario {
  scenario: InstitutionalScenarioType;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  primaryDriver: string;
  secondaryDriver: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  policyProfile: PolicyProfileType;
  liquidityIntent: 'STRATEGIC' | 'IDLE' | 'DEFENSIVE' | 'NEUTRAL';
}
`;

content = content.replace(/export interface InstitutionalScenario \{[\s\S]*?\}/, newInterface.trim());

const newClass = `
export class BalanceSheetScenarioClassifier {
  public static classify(facts: BalanceSheetExecutiveFacts, institutionalStage: string = ''): InstitutionalScenario {
    // 1. Sinais de Evolução Longitudinal e Intenção de Liquidez
    const isGrowingAssets = facts.growthTotalAssets > 5 || facts.growthRevenue > 5 || (facts.nonCurrentAssets > facts.currentAssets && facts.totalAssets > 0);
    const isGrowingWcNeed = facts.growthWorkingCapitalNeed > 5 || facts.workingCapitalNeed > 0;
    const isGrowingLiabilities = facts.growthCurrentLiabilities > 5;
    
    let growthScore = 0;
    if (isGrowingAssets) growthScore++;
    if (isGrowingWcNeed) growthScore++;
    if (isGrowingLiabilities) growthScore++;

    const isMature = institutionalStage.toUpperCase().includes('MATURIDADE') || institutionalStage.toUpperCase().includes('CONSOLIDAÇÃO');
    const isExpansionStage = institutionalStage.toUpperCase().includes('EXPANSÃO');

    const hasMaterialGrowth = growthScore >= 2 || isExpansionStage;
    
    // Determinação de Liquidity Intent
    let liquidityIntent: 'STRATEGIC' | 'IDLE' | 'DEFENSIVE' | 'NEUTRAL' = 'NEUTRAL';
    if (facts.liquidityImmediate < 0.50) {
      liquidityIntent = 'DEFENSIVE';
    } else if (facts.liquidityImmediate > 1.5) {
      if (hasMaterialGrowth) {
        liquidityIntent = 'STRATEGIC';
      } else {
        liquidityIntent = 'IDLE';
      }
    }

    // 1. CRITICAL_LIQUIDITY_STRESS
    if (facts.liquidityImmediate < 0.30 || facts.liquidityDry < 0.70 || (facts.liquidityCurrent > 0 && facts.liquidityCurrent < 0.50)) {
      return {
        scenario: 'CRITICAL_LIQUIDITY_STRESS',
        confidence: 'HIGH',
        primaryDriver: 'Asfixia aguda de liquidez de curto prazo',
        secondaryDriver: 'Incapacidade de honrar passivos circulantes com disponibilidades imediatas',
        severity: 'CRITICAL',
        policyProfile: 'SURVIVAL',
        liquidityIntent: 'DEFENSIVE'
      };
    }

    // 2. RECOVERY_OR_RECOMPOSITION
    if (facts.financialAutonomy >= 0.40 && facts.financialAutonomy < 0.80 && facts.workingCapital > 0 && facts.liquidityImmediate >= 0.50 && facts.liquidityCurrent >= 1.20 && facts.equity < facts.totalAssets * 0.80) {
      return {
        scenario: 'RECOVERY_OR_RECOMPOSITION',
        confidence: 'HIGH',
        primaryDriver: 'Recomposição ativa de margens de segurança',
        secondaryDriver: 'Autonomia ainda restrita, porém estabilizada pelo capital de giro positivo',
        severity: 'HIGH',
        policyProfile: 'STABILIZATION',
        liquidityIntent: 'DEFENSIVE'
      };
    }

    // 3. EXPANSION_WITH_DISCIPLINE (Prioridade sobre otimização se houver crescimento material)
    if (facts.liquidityCurrent > 1.50 && facts.financialAutonomy >= 0.60 && hasMaterialGrowth) {
      return {
        scenario: 'EXPANSION_WITH_DISCIPLINE',
        confidence: 'MEDIUM',
        primaryDriver: 'Forte ritmo de alocação e expansão de balanço',
        secondaryDriver: 'Preservação de liquidez corrente como reserva estratégica para crescimento',
        severity: 'MEDIUM',
        policyProfile: 'CONTROLLED_GROWTH',
        liquidityIntent: 'STRATEGIC'
      };
    }

    // 4. EXCESS_LIQUIDITY_OPTIMIZATION (Requer ausência de crescimento forte e altíssima liquidez)
    const treasurySurplusMaterial = facts.liquidityImmediate > 2 && facts.financialAutonomy > 0.70;
    if (facts.liquidityCurrent > 3 && facts.debtRatio < 0.20 && treasurySurplusMaterial && !hasMaterialGrowth) {
      return {
        scenario: 'EXCESS_LIQUIDITY_OPTIMIZATION',
        confidence: 'HIGH',
        primaryDriver: 'Excesso estrutural de liquidez',
        secondaryDriver: 'Autonomia financeira muito elevada com endividamento reduzido e balanço maduro',
        severity: 'LOW',
        policyProfile: 'CAPITAL_OPTIMIZATION',
        liquidityIntent: 'IDLE'
      };
    }

    // 5. STRUCTURALLY_BALANCED (Fallback)
    return {
      scenario: 'STRUCTURALLY_BALANCED',
      confidence: 'MEDIUM',
      primaryDriver: 'Equilíbrio padrão entre ativos circulantes e obrigações',
      secondaryDriver: 'Estrutura patrimonial sem disrupções severas ou excedentes agudos',
      severity: 'LOW',
      policyProfile: 'SUSTAINABLE_MANAGEMENT',
      liquidityIntent: 'NEUTRAL'
    };
  }
}
`;

content = content.replace(/export class BalanceSheetScenarioClassifier \{[\s\S]*?\}\n/, newClass.trim() + '\n');

fs.writeFileSync(file, content, 'utf8');
