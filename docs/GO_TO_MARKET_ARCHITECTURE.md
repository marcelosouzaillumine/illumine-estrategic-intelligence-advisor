# Arquitetura Comercial Multi-Tenant (Go-To-Market Architecture)

Este documento descreve a modelagem comercial SaaS da plataforma Illumine, o controle de planos, limites de faturamento (billing), cotas e permissões de tenants.

## 1. Isolamento Comercial do Runtime Financeiro
A camada comercial da plataforma (gerenciada por `CommercialPlanEngine.ts`) é estritamente isolada do core financeiro. 
- A Commercial Layer decide **se** um usuário ou tenant pode visualizar uma feature ou executar uma ação com base no seu plano contratado.
- A Commercial Layer **nunca** interfere em cálculos de liquidez, margens, score de governança, severidade contábil ou detecção de causalidade. Ela atua puramente como um gatekeeper de acesso a recursos.

## 2. Planos Comerciais Homologados

A plataforma Illumine opera sob três planos principais:

- **basic**:
  - Limite de 1 Workspace ativo.
  - Exibição básica do dashboard financeiro.
  - Sem acesso a Estresse Preditivo ou Simulações.
  - Suporte básico a exportação em formato texto (Markdown).
- **premium**:
  - Limite de até 5 Workspaces.
  - Acesso total ao Scenario Simulation e Predictive Stress.
  - Suporte completo a relatórios em PDF e Board Packs.
  - Permissão de Calibration Playground em modo sandbox.
- **enterprise**:
  - Workspaces ilimitados.
  - Acesso multi-tenant ilimitado.
  - Calibrações permanentes do motor de inteligência e playbooks avançados.
  - Acesso total a painéis de monitoramento piloto e auditorias completas.

## 3. Quotas e Limites Controlados (Feature Flags)

| Recurso / Feature | basic | premium | enterprise |
| :--- | :--- | :--- | :--- |
| Max Workspaces | 1 | 5 | Ilimitado |
| Simulação de Cenários | Não | Sim | Sim |
| Exportar Board Pack | Não | Sim (com marca d'água) | Sim (White-label) |
| Calibração de Inteligência | Não | Sim (Playground) | Sim (Permanente) |
| Multi-tenant Advisor views | Não | Não | Sim |
