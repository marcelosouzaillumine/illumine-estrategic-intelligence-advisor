# Governance Time Machine v1.0 — Architecture Audit

## 1. Princípio Fiduciário Mandatório
O Governance Time Machine atua estritamente como uma camada observacional temporal. Nenhuma engine fiduciária é executada no runtime temporal.

### Validação de Conformidade
- [x] O `GovernanceTimeMachineRuntime` expõe unicamente métodos de recuperação persistente (`loadTimeline`, `compareSnapshots`, etc.).
- [x] O `TimelineQueryEngine` realiza consultas e sort arrays, sem gerar scores.
- [x] O `InstitutionalDriftEngine` contabiliza instâncias persistidas sem emitir recomendações ativas.

## 2. Isolamento de Tenant (Tenant Sovereignty)
A camada de repositório (`FirestoreTimelineRepository`) exige `tenantId` em absolutamente todos os métodos de busca e reconstrução temporal.

### Validação de Conformidade
- [x] Toda requisição do Runtime para o repositório carrega a flag mandatória `tenantId`.
- [x] O ViewModel atua estritamente via injeção dependente do escopo executivo (passado pelo `GovernanceTimeMachineWorkspace`).

## 3. Proveniência e Auditabilidade (Temporal Provenance)
As entidades agora suportam `TemporalLineage`, `InstitutionalMilestone` e `TemporalProvenanceRecord`. 

### Validação de Conformidade
- [x] As modificações entre Snapshots A e B são lidas da assinatura criptográfica (`TemporalLineage`), não são re-inferidas em tempo de execução pela UI.
- [x] A Evidência associada a um estado passado é isolada através do objeto estático `TemporalProvenanceRecord`.

## 4. Integração Superficial
A rota isolada `/governance-time-machine/:nodeId` e a chamada via botão "Investigação Histórica" mantêm as UIs focadas sem sobrecarregar a esteira quente da `ExecutiveAdvisoryEngine`.

### Conclusão do Comitê de Arquitetura
A implementação do módulo v1.0 está **APROVADA** sob as regras de zero recálculo e fail-closed state. Todo o passado da plataforma é tratado como Imutável.
