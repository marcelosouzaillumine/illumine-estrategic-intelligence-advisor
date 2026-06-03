import { InstitutionalEvidenceInput, EvidenceDocument } from '../../../core/runtime/evidence-ingestion/InstitutionalEvidenceTypes';

export class InstitutionalEvidenceMockFactory {
  /**
   * Generates mock evidence context linked to the rawData payload for DEV/TEST purposes.
   */
  public static createEvidenceInputFromRawData(
    rawData: any,
    environmentType: string = 'DEVELOPMENT'
  ): InstitutionalEvidenceInput {
    const documents: EvidenceDocument[] = [];
    const tenantId = 'tenant-mock-123';

    // Mock BP
    if (rawData.bpData && rawData.bpData.length > 0) {
      documents.push({
        id: 'doc-bp-101',
        type: 'BP',
        hash: 'b1e2c3a4d5f6g7h8i9j0k1l2m3n4o5p6', // Length 32 (valid)
        isSyntheticMock: true,
        timestamp: new Date().toISOString(),
        metadata: {
          period: '2023',
          currency: 'BRL',
          confidence: 0.95,
          tenantId
        },
        rawContentReference: rawData.bpData
      });
    }

    // Mock DRE
    if (rawData.dreData && rawData.dreData.length > 0) {
      documents.push({
        id: 'doc-dre-202',
        type: 'DRE',
        hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Length 32 (valid)
        isSyntheticMock: true,
        timestamp: new Date().toISOString(),
        metadata: {
          period: '2023',
          currency: 'BRL',
          confidence: 0.95,
          tenantId
        },
        rawContentReference: rawData.dreData
      });
    }

    // Mock DFC
    if (rawData.cashFlowData && rawData.cashFlowData.length > 0) {
      documents.push({
        id: 'doc-dfc-303',
        type: 'DFC',
        hash: 'f1e2d3c4b5a697867564534231201293', // Length 32 (valid)
        isSyntheticMock: true,
        timestamp: new Date().toISOString(),
        metadata: {
          period: '2023',
          currency: 'BRL',
          confidence: 0.95,
          tenantId
        },
        rawContentReference: rawData.cashFlowData
      });
    }
    
    // DLPA check
    if (rawData.dlpaData && rawData.dlpaData.length > 0) {
      documents.push({
        id: 'doc-dlpa-404',
        type: 'DLPA',
        hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', // Length 32 (valid)
        isSyntheticMock: true,
        timestamp: new Date().toISOString(),
        metadata: {
          period: '2023',
          currency: 'BRL',
          confidence: 0.95,
          tenantId
        },
        rawContentReference: rawData.dlpaData
      });
    }

    // If no raw BP array but we have bpSummary, simulate minimal BP document
    if (!documents.some(d => d.type === 'BP') && rawData.rawFinancialData?.bpSummary) {
       documents.push({
        id: 'doc-bp-summary-505',
        type: 'BP',
        hash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d', // Length 32 (valid)
        isSyntheticMock: true,
        timestamp: new Date().toISOString(),
        metadata: {
          period: '2023',
          currency: 'BRL',
          confidence: 0.85,
          tenantId
        },
        rawContentReference: rawData.rawFinancialData.bpSummary
      });
    }

    return {
      environmentConfiguration: {
        environmentType,
        mockFactoriesEnabled: true
      },
      tenantIsolationRuntime: {
        tenantId,
        isPilotTenant: false,
        isProductionTenant: environmentType === 'PRODUCTION',
        hasCrossTenantAccess: false
      },
      organizationalMetadata: {
        organizationName: 'Mock Corp Ltd',
        industry: 'Technology',
        jurisdiction: 'Brazil',
        fiduciaryLevelRequired: 'STRICT'
      },
      onboardingStatus: {
        onboardingStage: 'FULL_INSTITUTIONAL_OPERATION',
        onboardingBlocked: false
      } as any,
      deploymentReadiness: {
        deploymentReadiness: 'FULL_PRODUCTION_READY',
        deploymentBlocked: false
      } as any,
      uploadedDocuments: documents,
      uploadAuditContext: {
        uploaderId: 'system-mock-injector',
        timestamp: new Date().toISOString(),
        ipHash: '127.0.0.1-hash'
      },
      historicalEvidenceRegistry: []
    };
  }
}
