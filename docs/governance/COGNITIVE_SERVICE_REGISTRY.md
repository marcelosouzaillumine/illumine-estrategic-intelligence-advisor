# Cognitive Service Registry™

**Status:** Active
**Date:** 2026-07-31
**Phase:** 4

Este documento funciona como o cartório central para qualquer serviço que execute inteligência computacional, inferência ou tomada de decisão na plataforma Illumine. Serviços que não estiverem listados aqui não são reconhecidos pelo ARB (Architecture Review Board) e devem ser eliminados (Ver: Debt Map).

## 1. Núcleo Executivo (Executive Runtime)

### 1.1 Executive Cognitive Runtime
* **Responsabilidade:** Motor central de raciocínio lógico, integrando contexto e intenção para formular respostas executivas coerentes.
* **Input Contract:** `HumanIntent`, `TenantIsolationContext`, `ExecutiveIdentityContext`
* **Output Contract:** `CognitiveServiceResult`
* **Evidence Responsibility:** Alta (deve registrar todas as fontes de dados utilizadas via RAG).
* **Confidence Impact:** Crítico (Define o baseline de certeza da resposta).
* **Lineage Generation:** Gera o nó raiz da `DecisionLineage`.
* **Governance Dependency:** Depende estritamente de `TenantIsolationKernel` e envia output para `CognitiveTrustGate`.

### 1.2 Executive Decision Forensics
* **Responsabilidade:** Registrar, explicar e auditar decisões complexas, permitindo rastreabilidade exata do "por que" a inteligência agiu de tal forma.
* **Input Contract:** `CognitiveServiceResult`, `DecisionLineage`
* **Output Contract:** `ExecutiveDecisionForensicsPackage`
* **Evidence Responsibility:** Conservador (Arquiva e não altera as evidências).
* **Confidence Impact:** Aferidor (Não gera confiança primária, mas calcula a consistência).
* **Lineage Generation:** Assina digitalmente a linhagem final.
* **Governance Dependency:** Dependência circular protegida com `CognitiveTrustGate`.

## 2. Memória e Contexto

### 2.1 Executive Memory Service (Institucional RAG)
* **Responsabilidade:** Recuperar blocos de conhecimento semântico baseados na ontologia executiva.
* **Input Contract:** `SemanticQuery`, `TenantIsolationContext`
* **Output Contract:** `EvidenceChain` (Array de fragmentos de conhecimento)
* **Evidence Responsibility:** Soberano (É a fonte das evidências).
* **Confidence Impact:** Moderado (Impactado pela distância vetorial e relevância).
* **Lineage Generation:** Registra IDs de documentos lidos na cadeia de extração.
* **Governance Dependency:** Só pode ser instanciado via `TenantIsolationKernel`.

## 3. Segurança e Liberação

### 3.1 Cognitive Trust Gate
* **Responsabilidade:** Avaliar alucinação, vazamento de dados inter-tenant e violações de compliance antes de enviar dados ao usuário final.
* **Input Contract:** `ExecutiveDecisionForensicsPackage`
* **Output Contract:** `GovernanceStatus`, `ExecutiveCognitiveTrace`
* **Evidence Responsibility:** Nenhuma (Apenas valida as evidências recebidas).
* **Confidence Impact:** Veto (Pode derrubar a confiança para 0 e bloquear a operação).
* **Lineage Generation:** Adiciona carimbo de validação na linhagem.
* **Governance Dependency:** É o próprio motor de governança no final do fluxo canônico.
