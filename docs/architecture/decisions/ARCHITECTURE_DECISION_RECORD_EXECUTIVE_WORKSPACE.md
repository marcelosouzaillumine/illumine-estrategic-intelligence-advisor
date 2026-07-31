# Architecture Decision Record: Executive Workspace (Wave G5.3.2)

## 1. Contexto e Motivação
A Illumine OS™ tem evoluído de uma plataforma com assistentes dispersos (como o antigo Copilot) para uma Arquitetura Executiva Canônica (Executive Experience Layer™). Durante a Wave G5.3, identificou-se um acoplamento indesejado: a interface de usuário (`ExecutiveCopilotPanel`) estava acessando diretamente o `ExecutiveIntelligenceContextAssembler` e o `WorkspaceAdvisoryEngine`. 
Esse acoplamento fere o princípio de **Single Source of Truth** e descentraliza lógicas de confiança e explicabilidade, impedindo uma auditoria eficiente pelo Canonical Assurance Engine (CAE).

O objetivo desta ADR é formalizar a criação do pacote `executive-workspace-orchestrator`, isolando a orquestração e gerando um único contrato consumível pela UI: o `ExecutiveWorkspaceSnapshot`.

## 2. Decisão Arquitetural
Foi estabelecida a seguinte hierarquia obrigatória e imutável para as experiências executivas:
```
ExecutiveCopilotPanel
        ↓
ExecutiveWorkspaceSnapshot™ (Immutable, CAE-Auditable)
        ↓
ExecutiveWorkspaceOrchestrator™
        ↓
ExecutiveIntelligenceContextAssembler™ & AdvisoryEngine
        ↓
Enterprise Knowledge Fabric™ & Domain Engines
```

### 2.1 Separação de Pacotes
- A camada de Workspace não é o Advisor. O Advisor responde "Qual recomendação fornecer?", enquanto o Workspace responde "Qual é o estado completo da organização?".
- Criou-se o pacote isolado `packages/intelligence/executive-workspace-orchestrator`.

### 2.2 Snapshot Imutável e Rastreável
O `ExecutiveWorkspaceSnapshot` não é apenas um container de UI; é uma fotografia criptográfica da inteligência gerada:
- Possui `snapshotId`, `version`, `generatedAt`, `sourceLineage`.
- Garante total compatibilidade com o Pipeline C do CAE.

### 2.3 Explicabilidade Mandatória (Explainability Surface)
Toda e qualquer `ExecutiveRecommendation` que alcança a interface DEVE apresentar os metadados de *Explainability* (Evidência, Confiança, Histórico, Cenários, Aprendizados e Riscos). Na UI, isso é tratado através do princípio de Progressive Disclosure (via `Accordion`), para manter o design premium enquanto preserva o acesso à fundamentação (AR-GFC-EXP-011).

## 3. Consequências
### Positivas
- **Alta Coesão e Baixo Acoplamento**: A UI (`ExecutiveCopilotPanel`) agora é "burra", atuando puramente como renderizadora do `ExecutiveWorkspaceSnapshot`.
- **Auditoria Plena**: O CAE pode analisar os artefatos da decisão de maneira unificada lendo apenas o objeto Snapshot emitido na Sessão.
- **Governança Expandida**: Inserção das GFCs AR-GFC-EXP-009, 010, 011 e 012 na Constituição de Arquitetura, elevando a segurança cognitiva do sistema.

### Mitigações de Riscos (Wave 15)
O `ExecutiveWorkspaceOrchestrator` consolida todo o contexto antes de ser entregue à UI. Esta implementação prepara o terreno para a Wave 15, onde o **Executive Cognitive Runtime™** orquestrará a colaboração Multi-Agente baseada na leitura do `ExecutiveWorkspaceSnapshot`.

## 4. Status
Aprovado - Finalizado em 31/07/2026.
ADR-071 - Wave G5.3.2 Canonical Executive Workspace Architecture.
