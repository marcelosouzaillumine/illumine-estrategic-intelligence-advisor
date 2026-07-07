# HCA-001 Wave 04 — Assessment & Monitoring Capability

## Objetivo
Continuar o expurgo estrutural (Reactivity Drift) focado na capability `assessment-monitoring`, convertendo as interfaces de diagnóstico, *benchmarking* e monitoramento em *dumb renderers*.

## Escopo Executado

### Wave 04 (Em Validação)
Foco em componentes de observabilidade e métricas comparativas institucionais. (Nota: A página `ESGIMAssessmentPage` já havia sido tratada previamente na Wave 02).

1. **InstitutionalBenchmarkingPage**
   - **Origem:** `src/components/pages/governance/InstitutionalBenchmarkingPage.tsx`
   - **Destino do ViewModel:** `src/capabilities/assessment-monitoring/presentation/view-models/useInstitutionalBenchmarkingViewModel.ts`
   - **Lógica extraída:** Controle de estado de `sector` e execução fiduciária de `InstitutionalBenchmarkEngine.runComparativeAnalysis` (lidando com *k-anonymity* e simulação anonimizada).

2. **InstitutionalMonitoringPage**
   - **Origem:** `src/components/pages/governance/InstitutionalMonitoringPage.tsx`
   - **Destino do ViewModel:** `src/capabilities/assessment-monitoring/presentation/view-models/useInstitutionalMonitoringViewModel.ts`
   - **Lógica extraída:** Injeção do `MonitoringAlertRegistry`, chamadas passivas ao montar, simulação multi-tenant (`mockContexts`) e execução ativa (`MonitoringExecutionScheduler.runManualCycle`).

## Próximos Passos
> O componente `ExecutiveMonitoringCenter.tsx` foi explicitamente excluído desta Wave e aguardará a migração da Capability `executive`, dado seu caráter agregador de topo de pirâmide.

## Status da Capability
- **`assessment-monitoring`:** Aguardando encerramento dos testes (Quality Gates) para atestado de certificação.
