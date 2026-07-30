# COGNITIVE_MAPPING.md — Cognitive Pipeline Equivalence & Mapping (AGC v1.0)

> **Documento Normativo Canônico de Mapeamento Cognitivo (Level A — Canonical)**  
> *Horizonte Temporal de Estabilidade: 10+ Anos (2026 – 2036+)*  
> *Documentos Complementares: [`docs/EXPERIENCE_ARCHITECTURE.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_ARCHITECTURE.md) | [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md)*  
> *Status: Homologado & Congelado*

---

## 1. Visão Geral e Propósito

O **Cognitive Mapping** formaliza a equivalência semântica e funcional entre o **Pipeline Cognitivo Canônico da IERA** e a **Cognitive Experience Architecture**. 

Esta norma estabelece que não existem dois pipelines cognitivos independentes na plataforma Illumine OS™. A *Cognitive Experience Architecture* é a representação experiencial e de interface do Pipeline Cognitivo de domínio da IERA.

---

## 2. Princípio da Equivalência Cognitiva (*Cognitive Equivalence Principle*)

> [!IMPORTANT]
> **Toda camada cognitiva da Experience Architecture representa uma especialização experiencial do Pipeline Cognitivo da IERA. É expressamente proibida qualquer evolução independente ou divergente entre o Pipeline Cognitivo de Domínio e a Experience Architecture.**

$$\text{Pipeline Cognitivo (Domínio)} \equiv \text{Cognitive Experience Architecture (Experiência)}$$

---

## 3. Matriz Oficial de Mapeamento Cognitivo

A tabela abaixo define a correspondência 1:1 rigorosa entre os estágios do Pipeline Cognitivo de Domínio e as Camadas da Experience Architecture:

| Pipeline Cognitivo da IERA | Camada da Experience Architecture | Função Cognitiva na Interface |
| :--- | :--- | :--- |
| **Fact** | **Executive Context** | Estabelece entidades, premissas, período contábil e contexto de negócio. |
| **Evidence** | **Executive Understanding** | Apresenta fatos auditados, metadados de proveniência e indicadores sintéticos. |
| **Inference** | **Executive Diagnosis** | Revela padrões, Causa Dominante, anomalias e projeções de modelos. |
| **Finding** | **Executive Diagnosis** | Consolidação neutra de descobertas e restrições sem viés deliberativo. |
| **Alternative** | **Executive Deliberation** | Confronta cenários, trade-offs e impactos quantitativos (`ExpectedKPIShift`). |
| **Recommendation** | **Executive Deliberation** | Apresenta a proposição formal imutável enviada ao Conselho. |
| **Resolution** | **Executive Execution** | Formaliza votos e a Resolução de Conselho juramentada (`BoardResolution`). |
| **Action** | **Executive Execution** | Desencadeia planos de ação táticos desacoplados (`ExecutiveAction`). |
| **Measurement** | **Executive Learning** | Mede o deslocamento real de KPI vs. o previsto (`ExpectedKPIShift`). |
| **Learning** | **Executive Learning** | Registra o aprendizado na memória organizacional (`OrganizationalMemory`). |

---

## 4. Fluxo Causal Integrado

O fluxo cognitivo completo opera de forma unidirecional e auditável:

$$\begin{aligned}
\text{Fact} &\longrightarrow \text{Executive Context} \\
\text{Evidence} &\longrightarrow \text{Executive Understanding} \\
\text{Inference / Finding} &\longrightarrow \text{Executive Diagnosis} \\
\text{Alternative / Recommendation} &\longrightarrow \text{Executive Deliberation} \\
\text{Resolution / Action} &\longrightarrow \text{Executive Execution} \\
\text{Measurement / Learning} &\longrightarrow \text{Executive Learning}
\end{aligned}$$

---

## 5. Governança e Regras de Invariância

1. **Vedação de Etapas Órfãs**: Nenhuma camada de interface pode ser exibida sem que exista o correspondente estágio do Pipeline Cognitivo de Domínio ativo.
2. **Auditabilidade de Mapeamento**: O `Decision Trace ID` DEVE correlacionar a evidência de domínio com a camada visual `Executive Understanding` e `Executive Deliberation`.
3. **Consistência de Evolução**: Qualquer alteração futura no Pipeline Cognitivo exige aditamento simultâneo e obrigatório via ADR neste documento e na Constituição Arquitetural.
