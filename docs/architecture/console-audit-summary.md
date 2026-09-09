# Console Audit Summary

## Estatísticas
- **Logs Totais:** 1166 (38 mitigados na v1.0)
- **console.error:** 568
- **console.log:** 460
- **console.warn:** 134

## Top 50 Ocorrências Críticas (Dados Financeiros ou Segurança)

- **[Segurança/Auth]** `src/components/pages/public/LoginPage.tsx:93`
  `console.error('Email authentication error:', error);`
- **[Segurança/Auth]** `src/core/observability/GovernanceAuditTrace.ts:30`
  `console.warn(`[GovernanceAuditTrace] DENIAL AUDIT: Actor ${trace.actorId} with role ${trace.role} blocked on action ${trace.action} (Reason: ${trace.denialCode})`);`
- **[Segurança/Auth]** `src/core/observability/TenantAccessTrace.ts:27`
  `console.warn(`[TenantAccessTrace] SECURITY WARNING: Unauthorized tenant switch attempt detected by actor ${access.actorId} trying to access ${access.newTenantId}`);`
- **[Financeiro/Sensível]** `src/core/runtime/consolidated/data/ConsolidatedEntityRepository.ts:24`
  `console.error(`[ConsolidatedEntityRepository] Failed to fetch BP for ${entityId}: ${err.message}`);`
- **[Financeiro/Sensível]** `src/core/runtime/consolidated/data/ConsolidatedEntityRepository.ts:44`
  `console.error(`[ConsolidatedEntityRepository] Failed to fetch DRE for ${entityId}: ${err.message}`);`
- **[Financeiro/Sensível]** `src/core/runtime/executive-governance-runtime.ts:585`
  `console.log('BP SUMMARY DEBUG:', bpSummary);`
- **[Financeiro/Sensível]** `src/core/runtime/executive-governance-runtime.ts:630`
  `console.log("DEBUG RUNTIME DRE LUCRO:", dreLucro, "DREDATA:", JSON.stringify(rawData.dreData));`
- **[Financeiro/Sensível]** `src/core/runtime/executive-governance-runtime.ts:1308`
  `console.log("DEBUG: normalizedDRE =", JSON.stringify(normalizedDRE));`
- **[Segurança/Auth]** `src/core/runtime/governance/dfc/DFCSSOTAuthorityGuard.ts:26`
  `console.error(`[DFCSSOTAuthorityGuard] ${reason}`);`
- **[Segurança/Auth]** `src/core/runtime/workflow-governance/WorkflowAuditLogger.ts:24`
  `console.log(`[WorkflowAuditLogger] ${event} - Workflow: ${workflowId} - Actor: ${actor.role}`);`
- **[Segurança/Auth]** `src/core/security/auth/InstitutionalAuthProvider.tsx:61`
  `console.error('[InstitutionalAuthProvider] Session resolution failed:', error);`
- **[Financeiro/Sensível]** `src/hooks/useFinancialData.ts:320`
  `console.warn(`[CORRUPTION RECOVERY] Documento BP ${docId} descartado pois contém dados de DFC/DRE.`);`
- **[Financeiro/Sensível]** `src/runtime/adapters/LegacyFinancialAdapter.ts:111`
  `console.error('LEGACY FINANCIAL ADAPTER ERROR STACK:', error);`
- **[Financeiro/Sensível]** `src/scripts/debug_entries.ts:208`
  `console.log(`  Period ${p.year}: bp.ativoTotal=${p.bp.ativoTotal}, metrics.ebitda=${p.metrics?.ebitda}, metrics.lucroLiquido=${p.metrics?.lucroLiquido}`);`
- **[Financeiro/Sensível]** `src/scripts/dump_granatum_data.ts:25`
  `console.log(`[DRE] Year: ${item.year} | Category: ${category} | Value: ${value}`);`
- **[Financeiro/Sensível]** `src/scripts/queryDfc.ts:13`
  `console.log(`\nQuerying DRE entries for client ${clientId}...`);`
- **[Financeiro/Sensível]** `src/scripts/queryDfc.ts:21`
  `console.log(`Found ${snap.size} approved DRE documents.`);`
- **[Financeiro/Sensível]** `src/scripts/queryDfc.ts:25`
  `console.log(`\nDRE ID: ${doc.id}`);`
- **[Financeiro/Sensível]** `src/scripts/queryDfc.ts:26`
  `console.log('DRE data rows:', JSON.stringify(data.data, null, 2));`
- **[Financeiro/Sensível]** `src/scripts/restoreBPDocuments.ts:45`
  `console.log(`[ALERTA] Documento BP ${bp.id} para ${key} contém linhas de DFC!`);`
- **[Financeiro/Sensível]** `src/scripts/restoreBPDocuments.ts:48`
  `console.log(`-> Arquivando BP corrompido ${bp.id}`);`
- **[Financeiro/Sensível]** `src/scripts/restoreBPDocuments.ts:75`
  `console.log(`-> Restaurando BP autêntico ${arch.id}`);`
- **[Financeiro/Sensível]** `src/scripts/restoreBPDocuments.ts:86`
  `console.log(`-> NÃO foi possível encontrar um BP autêntico para restaurar para ${key}.`);`
- **[Financeiro/Sensível]** `src/scripts/runActiveGovernance.ts:55`
  `console.log('\nIniciando Consolidated Financial Audit...');`
- **[Financeiro/Sensível]** `src/scripts/runActiveGovernance.ts:63`
  `console.log('\nIniciando Institutional Financial Audit (RC-1.5)...');`
- **[Financeiro/Sensível]** `src/scripts/runActiveGovernance.ts:67`
  `console.error('\nCRITICAL: Falha na Institutional Financial Audit. Abortando Governance Audit.\n');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedAdvisoryAudit.ts:52`
  `console.log('✅ Test 1 Passed: Operational Parasitism detectado corretamente (Holding drena Filial Operacional via Mútuo).');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:5`
  `console.log('Iniciando Consolidated Financial Audit...\n');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:74`
  `console.log('CONSOLIDATED FINANCIAL TESTS');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:110`
  `console.log('✅ Test 3 Passed: Soma linear de DRE correta (800,000).');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:112`
  `console.error('❌ Test 3 Failed: Soma DRE incorreta.');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:119`
  `console.error('❌ Test 4 Failed: Eliminação DRE falhou.');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:136`
  `console.log('✅ Test 6 Passed: Degradação e aviso aplicados por falta de peças contábeis (DRE ausente em sub-A).');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:138`
  `console.error('❌ Test 6 Failed: Degradação por ausência de DRE falhou.');`
- **[Financeiro/Sensível]** `src/scripts/runConsolidatedFinancialAudit.ts:142`
  `console.log('\nConsolidated Financial Audit Finalizada. Status: COMPLIANT');`
- **[Financeiro/Sensível]** `src/scripts/runDecisionGovernanceAudit.ts:14`
  `console.error('❌ ERRO: BoardResolutionEngine.ts não encontrado.');`
- **[Financeiro/Sensível]** `src/scripts/runDecisionGovernanceAudit.ts:19`
  `console.error('❌ ERRO: BoardResolutionEngine não implementa bloqueios fiduciários rigorosos.');`
- **[Segurança/Auth]** `src/scripts/runGovernanceCommandCenterAudit.ts:74`
  `console.error(`❌ VIOLATION [GCC-UI-003]: Controle de ações não desabilitado/bloqueado sob estado FAIL_CLOSED no componente ${file}.`);`
- **[Financeiro/Sensível]** `src/scripts/runInstitutionalFinancialAudit.ts:6`
  `console.log('Iniciando Institutional Financial Audit (RC-1.5)...');`
- **[Financeiro/Sensível]** `src/scripts/runInstitutionalFinancialAudit.ts:41`
  `console.error('🔴 Institutional Financial Audit FALHOU. Build bloqueado.');`
- **[Financeiro/Sensível]** `src/scripts/runInstitutionalFinancialAudit.ts:44`
  `console.log('✅ Institutional Financial Audit FINALIZADA COM SUCESSO. Plataforma RC-1.5A Compliant.');`
- **[Financeiro/Sensível]** `src/scripts/runReportingGovernanceAudit.ts:53`
  `console.error(`❌ VIOLATION: FiduciarySnapshotBuilder não deve salvar BP/DRE completos. Salve apenas outputs e referencie o LineageHash. Arquivo: ${fileName}`);`
- **[Financeiro/Sensível]** `src/scripts/seedCompany.ts:858`
  `console.error('FAIL financial_positions:', err);`
- **[Financeiro/Sensível]** `src/services/aiService.ts:285`
  `console.error("AI Financial Parsing Error:", error);`
- **[Segurança/Auth]** `src/services/security/RoleManagementService.ts:16`
  `console.error('Failed to assign role:', error);`
