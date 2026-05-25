import { ImportedDataset, StagingValidationWarning } from './IntegrationGovernanceTypes';
import { ACTIVE_STAGING_POLICY, TRANSACTIONAL_STAGING_POLICY, StagingValidationPolicy } from './StagingValidationPolicy';

export class StagingValidationEngine {
  static validateDataset(dataset: ImportedDataset): void {
    dataset.blockingWarnings = [];
    dataset.stagingValidationPassed = false;
    dataset.promotedToRuntime = false; // Never auto-promoted initially unless approved
    
    const isTransactional = dataset.datasetType === 'TRANSACTIONS_PAYABLES' || 
                            dataset.datasetType === 'TRANSACTIONS_RECEIVABLES' || 
                            dataset.datasetType === 'TRANSACTIONS_MIXED';
                            
    const policy = isTransactional ? TRANSACTIONAL_STAGING_POLICY : ACTIVE_STAGING_POLICY;
    dataset.policyVersion = policy.version;

    if (!dataset.parsedData) {
      this.addWarning(dataset, 'INCOMPLETE_DATASET');
      return;
    }

    if (isTransactional) {
      this.validateTransactionalDataset(dataset, policy);
    } else {
      this.validateFinancialDataset(dataset, policy);
    }

    // Final checks
    dataset.stagingValidationPassed = !this.hasBlockingWarnings(dataset, policy);
  }

  private static validateFinancialDataset(dataset: ImportedDataset, policy: StagingValidationPolicy): void {
    const { bp, dre, dfc, accountList } = dataset.parsedData;

    if (!bp && !dre && !dfc) {
      this.addWarning(dataset, 'INCOMPLETE_DATASET');
      return;
    }

    // 1. Duplicate Accounts
    if (accountList) {
      const accountIds = new Set<string>();
      let hasDuplicates = false;
      for (const acc of accountList) {
        if (accountIds.has(acc.id)) {
          hasDuplicates = true;
          break;
        }
        accountIds.add(acc.id);
      }
      if (hasDuplicates) {
        this.addWarning(dataset, 'DUPLICATE_ACCOUNT');
      }

      // 4. Orphan Accounts
      let hasOrphans = false;
      for (const acc of accountList) {
        if (acc.parentId && !accountIds.has(acc.parentId)) {
          hasOrphans = true;
          break;
        }
      }
      if (hasOrphans) {
        this.addWarning(dataset, 'ORPHAN_ACCOUNT');
      }
    }

    // 2. BP Balances
    if (bp) {
      const { ativo, passivo, pl } = bp;
      // In some datasets, missing fields could mean 0.
      const valAtivo = ativo || 0;
      const valPassivo = passivo || 0;
      const valPl = pl || 0;

      const diff = Math.abs(valAtivo - (valPassivo + valPl));
      
      // Calculate tolerance based on Ativo
      const toleranceValue = Math.max(valAtivo * policy.tolerance, 0.01);

      if (diff > toleranceValue) {
        if (diff > (valAtivo * 0.05)) { // 5% diff is material
           this.addWarning(dataset, 'INVALID_BALANCE_SHEET');
        } else {
           this.addWarning(dataset, 'MATERIALITY_THRESHOLD_EXCEEDED');
        }
      }
    }

    // 3. DRE Hierarchy and Signs
    if (dre) {
      // Basic rules: Gross Revenue >= Net Revenue
      // Costs usually negative, but if positive could be a sign inversion.
      const { grossRevenue, deductions, netRevenue, costs } = dre;
      if (grossRevenue !== undefined && netRevenue !== undefined) {
        // Checking if gross + deductions (which is usually negative) = net
        const valGross = grossRevenue;
        const valDeductions = deductions || 0;
        const calcNet = valGross + valDeductions;
        const diffNet = Math.abs(calcNet - netRevenue);
        
        if (diffNet > Math.max(valGross * policy.tolerance, 0.01)) {
           this.addWarning(dataset, 'HIERARCHY_BREAK');
        }
      }

      // Check sign inversions
      if (costs !== undefined && costs > 0) {
        // Costs are generally represented as negative in math formulations, if > 0 it could be inverted
        this.addWarning(dataset, 'SIGN_INVERSION');
      }
    }

    // 4. Cashflow (DFC) Check
    if (dfc) {
      const { initialCash, finalCash, operatingFlow, investingFlow, financingFlow } = dfc;
      if (initialCash !== undefined && finalCash !== undefined) {
        const valInitial = initialCash;
        const valOp = operatingFlow || 0;
        const valInv = investingFlow || 0;
        const valFin = financingFlow || 0;

        const expectedFinal = valInitial + valOp + valInv + valFin;
        const diffCash = Math.abs(expectedFinal - finalCash);
        
        // Use a 0.01 fixed tolerance for cash flows to allow for floating point precision issues
        if (diffCash > 0.01) {
          this.addWarning(dataset, 'CASHFLOW_MISMATCH');
        }
      }
    }
  }

  private static validateTransactionalDataset(dataset: ImportedDataset, policy: StagingValidationPolicy): void {
    const transactions = dataset.parsedData.transactions;
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      this.addWarning(dataset, 'INCOMPLETE_DATASET');
      return;
    }

    const seenIds = new Set<string>();

    for (const tx of transactions) {
      if (typeof tx.valor !== 'number' || tx.valor === 0 || isNaN(tx.valor)) {
        this.addWarning(dataset, 'INVALID_TRANSACTION_AMOUNT');
      }
      
      if (!tx.emissao) {
        this.addWarning(dataset, 'INVALID_TRANSACTION_DATE');
      }
      
      if (!tx.vencimento) {
        // Warning depends on policy but we assume due date is required for payables/receivables
        this.addWarning(dataset, 'MISSING_DUE_DATE');
      }

      if (!tx.entidade || tx.entidade.trim() === '') {
        this.addWarning(dataset, 'MISSING_ENTITY');
      }

      // Type identified implicitly by datasetType or explicitly
      if (!dataset.datasetType) {
        this.addWarning(dataset, 'MISSING_TRANSACTION_TYPE');
      }

      // Check duplicates (composite key: emissao + entidade + valor)
      if (tx.emissao && tx.entidade && tx.valor) {
        const compositeKey = `${tx.emissao}-${tx.entidade}-${tx.valor}`;
        if (seenIds.has(compositeKey)) {
          this.addWarning(dataset, 'DUPLICATE_TRANSACTION');
        }
        seenIds.add(compositeKey);
      }
    }
  }

  static promoteToRuntime(dataset: ImportedDataset, actorId: string): void {
    if (!dataset.stagingValidationPassed) {
      throw new Error("Cannot promote an invalid dataset to runtime.");
    }
    dataset.promotedToRuntime = true;
  }

  private static addWarning(dataset: ImportedDataset, warning: StagingValidationWarning): void {
    if (!dataset.blockingWarnings) {
      dataset.blockingWarnings = [];
    }
    if (!dataset.blockingWarnings.includes(warning)) {
      dataset.blockingWarnings.push(warning);
    }
  }

  private static hasBlockingWarnings(dataset: ImportedDataset, policy: StagingValidationPolicy): boolean {
    if (!dataset.blockingWarnings) return false;
    
    for (const warning of dataset.blockingWarnings) {
      if (policy.blockingRules.includes(warning)) {
        return true;
      }
    }
    return false;
  }
}
