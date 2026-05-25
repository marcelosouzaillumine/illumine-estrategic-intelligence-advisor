# MASTER WORKFLOW GOVERNANCE ENGINE

Este documento define a camada oficial de Governança de Decisão Institucional (*Institutional Decision Governance Infrastructure*).

A premissa central desta fase é: **Decisões criam responsabilidade (Action Items e Workflows) e registram trilhas de auditoria, mas NUNCA alteram os dados fiduciários, Advisory ou Confidence originais que engatilharam a decisão.**

## Arquitetura de Aprovação (Workflow Engine)

O `DecisionWorkflowEngine` é responsável por tramitar pacotes institucionais.
Um workflow só existe se vinculado a uma referência inquebrável, gerada pelo `DecisionLineageBinder`, garantindo rastreabilidade do "Por quê" e "Em cima do que" aquela decisão foi tomada (Hash do relatório, ID do alerta crítico, etc).

## Políticas de Aprovação (ApprovalPolicyResolver)

Não existe workflow *freestyle*. 
- O resolver dita o nível hierárquico necessário para deliberar.
- Alertas `CRITICAL` exigem trânsito pelo nível de `BOARD_MEMBER` ou `CONTROLLER`.
- Resolução de riscos de rotina (`LOW`) podem ser concluídos pelo `ADVISOR` da conta.

## Rastreabilidade e Auditoria (Audit & Action Tracking)

- O `InstitutionalActionTracker` distribui tarefas pós-reunião (ex: "Levantar debênture para injetar caixa na holding devido à propagação de colapso de tesouraria"). 
- Todos esses passos disparam eventos no `WorkflowAuditLogger`, registrando *quem*, *quando*, *em qual contexto* e *por qual justificativa* uma decisão ocorreu.

## Restrições UI e Persistência no MVP

Por restrição de *Active Governance*:
1. Nenhum workflow sobrevive em LocalStorage ou IndexedDB no navegador.
2. A transição entre Tenants/Workspaces força uma anulação do Registry em memória.
3. Não há pop-ups automáticos e interruptivos; o consumo das decisões é *Pull-based* via a central `/dashboard/decision-governance`.

Em iterações futuras (Fase de Persistência), os workflows serão integrados ao repositório de backend, mantendo o estrito respeito à multilocação (Tenant Isolation).
