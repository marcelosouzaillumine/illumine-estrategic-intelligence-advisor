# EAC Technical Discovery Accuracy Report

**Date:** 2026-07-10
**Sample Size:** 30
**Method:** Deterministic alphabetical sample from non-certified pool

## Gate Results

| Gate | Threshold | Actual | Status |
|------|-----------|--------|--------|
| Duplicate Classifications | 0 | 0 | ✅ PASS |
| Registry Preserved | 8 certified | 19 | ✅ PASS |
| Reviewed Candidates Separate | 9 reviewed | 0 | ❌ FAIL |
| True Positive Rate | ≥ 85% | 6.7% | ⚠️ SEE BELOW |
| False Positive Rate | ≤ 10% | 0.0% | ✅ PASS |

## Classification Quality Checks

| Check | Status |
|-------|--------|
| ExecutiveAccordion not frontier | ✅ PASS |
| Pages not classified as pure frontier | ✅ PASS |
| ExecutiveSummarySection not misclassified | ✅ PASS |
| No primitives leaked into heuristic | ✅ PASS |

## Sample Details

| Component | Status | Block | Verdict |
|-----------|--------|-------|--------|
| A4Page | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AcademyAdminCoursePage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AcademyHomePage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AccountingIntegrityPanel | HEURISTIC_CANDIDATE | technical-evidence | TRUE_POSITIVE_HEURISTIC |
| AccountModal | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| ActionToolbar | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| ActionToolbarGroup | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AdminAcademyDashboard | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AdministrativaPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AdminSupportPanel | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AdvisorCockpitPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AdvisorCommandCenter | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AdvisorInstitutionalOverview | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AdvisorInvestigationSurface | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AdvisorWorkspacePage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AdvisorWorkspaceShell | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AdvisoryContinuitySurface | HEURISTIC_CANDIDATE | technical-evidence | TRUE_POSITIVE_HEURISTIC |
| AdvisoryDeltaPanel | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AdvisoryInsightsPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AlertSeverityBadge | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AnaliseFinanceiraPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AnaliseMercadoPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AppSidebar | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AssetManagementPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AssetModal | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| AvaliacaoOrganogramaPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| AxisDashboardPage | CONTAINER_REVIEW_REQUIRED | n/a | CORRECTLY_DOWNGRADED |
| BalanceSheetActionToolbar | NOT_APPLICABLE | n/a | CORRECTLY_EXCLUDED |
| BalanceSheetAssetQualitySection | HEURISTIC_CANDIDATE | ambiguous | WEAK_SIGNAL_AMBIGUOUS |
| BalanceSheetAuditLayerSection | HEURISTIC_CANDIDATE | ambiguous | WEAK_SIGNAL_AMBIGUOUS |
