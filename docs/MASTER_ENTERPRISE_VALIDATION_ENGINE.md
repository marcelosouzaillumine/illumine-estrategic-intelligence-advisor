# MASTER ENTERPRISE VALIDATION ENGINE (Phase 22)

Este documento rege a infraestrutura de **Enterprise Validation & Go-To-Market Readiness** (Fase 22).

## Princípio Fundamental: Validação Através de Golden Datasets
A plataforma Illumine não processa dados de clientes reais sem passar por um Sandbox de Validação Empresarial estrito.
Nesta fase, a plataforma transita de "Software Arquitetural" para "Produto Comercial", simulando cenários complexos (Holdings e Intercompany) usando *Golden Datasets in-memory*. 
Isso permite aos desenvolvedores e executivos validarem fricção (UX), resiliência (Runtime Integrity) e Prontidão de Mercado sem corromper a Truth Layer ou vazar PII (Personally Identifiable Information).

## Pilares da Fase 22

A validação foi orquestrada em 5 motores principais alocados em `src/core/runtime/`:

### 1. `enterprise-validation/`
- Mede a integridade dos cálculos (BP/DRE/DFC).
- Simula a inserção de dados via `RealDataValidationEngine`.
- Não salva os resultados diretamente em produção. Funciona como uma alfândega in-memory rigorosa.

### 2. `ux-hardening/`
- Responsável por mapear e auditar as jornadas de executivos (CFO, Controller, Board).
- Identifica "pontos de atrito" (friction points) e pontuações de carga cognitiva.
- Evita que as capacidades da IA afoguem o usuário em dashboards incompreensíveis.

### 3. `pilot-readiness/`
- Garante o isolamento de ambientes para pilotos reais.
- Verifica checklists fiduciários antes da ativação do workspace (ex: "No PII Leakage").
- Define se um sandbox atende aos requisitos governamentais da Illumine.

### 4. `operational-playbooks/`
- Organiza manuais vivos para operação da Illumine em Enterprise.
- Possui o `EnterpriseOnboardingPlaybook` que descreve a implantação desde a criação do Workspace até o setup dos Gatekeepers fiduciários.

### 5. `commercial-readiness/`
- Trilha que rege os tiers e features da plataforma.
- Prepara o motor interno para desativar e ativar features baseado no `InstitutionalOfferingRegistry` (Essencial, Enterprise, Advisor).

## Active Governance (`runEnterpriseValidationGovernanceAudit.ts`)

Para que as demonstrações comerciais ou testes reais não vazem dados nem quebrem a governança da Illumine, os seguintes controles estão codificados no Audit Script:
- A UI de Validação (Enterprise Validation Hub) não pode chamar *fetch* ou mutar diretamente cálculos (BPRuntime).
- Dados do "Golden Dataset" são estritamente proibidos de invocar a rotina de "Save to Production" localmente sem passar pelo ciclo regular de importação governado.
- `localStorage` e salvamentos diretos são banidos da UI para proteger a fuga de dados simulados.
