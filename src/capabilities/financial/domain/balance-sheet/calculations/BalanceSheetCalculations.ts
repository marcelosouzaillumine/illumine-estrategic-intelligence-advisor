import { NormalizedBalanceSheet } from '../../models/NormalizedBalanceSheet';

export interface BalanceSheetCalculatedMetrics {
  currentLiquidity: number | undefined | null;
  dryLiquidity: number | undefined | null;
  immediateLiquidity: number | undefined | null;
  generalLiquidity: number | undefined | null;

  debtRatio: number | undefined | null;
  shortTermDebtConcentration: number | undefined | null;
  thirdPartyCapitalRatio: number | undefined | null;
  equityImmobilization: number | undefined | null;
  permanentResourcesImmobilization: number | undefined | null;

  assetLiquidity: number | undefined | null;
  clientConcentration: number | undefined | null;
  inventoryConcentration: number | undefined | null;
  cashConcentration: number | undefined | null;
  financialDebtConcentration: number | undefined | null;
  operationalLiabilityRatio: number | undefined | null;
  operationalAssetRatio: number | undefined | null;
  shortTermFinancialDebtProfile: number | undefined | null;
  currentAssetsWithoutCash: number | undefined | null;
  currentLiabilitiesWithoutDebt: number | undefined | null;
  ncg: number | undefined | null;
  cgl: number | undefined | null;
  treasury: number | undefined | null;
}
    
    export class BalanceSheetCalculations {
      static calculateMetrics(data: NormalizedBalanceSheet): BalanceSheetCalculatedMetrics {
        const assets = data.assets;
        const liab = data.liabilities;
        const eq = data.equity;
    
        const safeDiv = (num: number | undefined, den: number | undefined) => {
            if (num === undefined || den === undefined) return undefined;
            if (den === 0) return null; // NOT_APPLICABLE
            return num / den;
        };
        const safeAdd = (...args: (number | undefined)[]) => {
            if (args.some(a => a === undefined)) return undefined;
            return args.reduce((sum, val) => (sum as number) + (val as number), 0) as number;
        };
        const safeSub = (a: number | undefined, b: number | undefined) => {
            if (a === undefined || b === undefined) return undefined;
            return a - b;
        };
    
        // LIQUIDITY
        const currentLiquidity = safeDiv(assets.currentAssets, liab.currentLiabilities);
        const dryLiquidity = safeDiv(safeSub(assets.currentAssets, assets.inventory), liab.currentLiabilities);
        const immediateLiquidity = safeDiv(assets.cashAndEquivalents, liab.currentLiabilities);
        const genLiab = safeAdd(liab.currentLiabilities, liab.nonCurrentLiabilities);
        const generalLiquidity = genLiab && genLiab > 0
          ? safeDiv(assets.currentAssets, genLiab)
          : null;
    
        // STRUCTURE
        const debtRatio = safeDiv(liab.total, assets.total);
        const shortTermDebtConcentration = safeDiv(liab.currentLiabilities, liab.total);
        const thirdPartyCapitalRatio = (eq.total && eq.total > 0) ? safeDiv(liab.total, eq.total) : null;
        const equityImmobilization = (eq.total && eq.total > 0) ? safeDiv(assets.nonCurrentAssets, eq.total) : null;
          
        const permanentResources = safeAdd(eq.total, liab.nonCurrentLiabilities);
        const permanentResourcesImmobilization = safeDiv(assets.nonCurrentAssets, permanentResources);
    
        // ASSET QUALITY / CONCENTRATION
        const assetLiquidity = safeDiv(safeAdd(assets.cashAndEquivalents, assets.accountsReceivable), assets.total);
        const clientConcentration = safeDiv(assets.accountsReceivable, assets.total);
        const inventoryConcentration = safeDiv(assets.inventory, assets.total);
        const cashConcentration = safeDiv(assets.cashAndEquivalents, assets.total);
        
        const operationalAssets = safeAdd(assets.accountsReceivable, assets.inventory, assets.fixedAssets);
        const operationalAssetRatio = safeDiv(operationalAssets, assets.total);
    
        // LIABILITY STRUCTURE
        const financialDebt = safeAdd(liab.financialDebtsShortTerm, liab.financialDebtsLongTerm);
        const financialDebtConcentration = safeDiv(financialDebt, liab.total);
        const shortTermFinancialDebtProfile = safeDiv(liab.financialDebtsShortTerm, financialDebt);
          
        const operationalLiabilityRatio = safeDiv(safeAdd(liab.suppliers, liab.laborObligations, liab.taxes), liab.total);
    
        // WORKING CAPITAL (FLEURIET)
        const currentAssetsWithoutCash = safeSub(assets.currentAssets, assets.cashAndEquivalents);
        const currentLiabilitiesWithoutDebt = safeSub(liab.currentLiabilities, liab.financialDebtsShortTerm);
        
        const ncg = safeSub(currentAssetsWithoutCash, currentLiabilitiesWithoutDebt);
        const cgl = safeSub(safeAdd(eq.total, liab.nonCurrentLiabilities), assets.nonCurrentAssets);
        const treasury = safeSub(cgl, ncg);
    
        return {
          currentLiquidity,
          dryLiquidity,
          immediateLiquidity,
          generalLiquidity,
          debtRatio,
          shortTermDebtConcentration,
          thirdPartyCapitalRatio,
          equityImmobilization,
          permanentResourcesImmobilization,
          assetLiquidity,
          clientConcentration,
          inventoryConcentration,
          cashConcentration,
          operationalAssetRatio,
          financialDebtConcentration,
          shortTermFinancialDebtProfile,
          operationalLiabilityRatio,
          currentAssetsWithoutCash,
          currentLiabilitiesWithoutDebt,
          ncg,
          cgl,
          treasury
        };
  }
}
