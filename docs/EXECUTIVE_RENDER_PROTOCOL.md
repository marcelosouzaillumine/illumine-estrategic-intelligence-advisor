# EXECUTIVE_RENDER_PROTOCOL.md — Executive Render Protocol v2.0

> **Padrão Normativo de Renderização Visual da Experiência Executiva de Decisão**  
> *Autoridade Supreme: Architecture Review Board (ARB) & Experience Architecture Foundation (EAF v1.0)*  
> *Alinhado à [`ARCHITECTURE_CONSTITUTION.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/ARCHITECTURE_CONSTITUTION.md), ADR-068 e ADR-076*

---

## 1. Visão Geral e Princípio Central (ADR-076)

A plataforma Illumine OS™ não renderiza telas analíticas convencionais (módulo → indicador → tabela → gráfico).  
Toda experiência no **Executive Workspace** é renderizada como uma jornada de decisão executiva organizada estritamente em **8 camadas cognitivas sequenciais**:

```
Executive Page
│
├── Layer 1 — Executive Context (Empresa, Período, Escopo & Pergunta Executiva)
├── Layer 2 — Executive Intent (Decisão Suportada & Meta Estratégica)
├── Layer 3 — Executive Understanding (Síntese Narrativa Semântica)
├── Layer 4 — Executive Diagnosis (Causas Dominantes, Drivers & Grafo Causal)
├── Layer 5 — Executive Deliberation (Cenários Alternativos, Trade-Offs & Simulações)
├── Layer 6 — Executive Evidence (KPIs, Benchmarks, Data Lineage & Decision Trace)
├── Layer 7 — Executive Execution (Owner, Priority, Deadline, Expected Shift & Actions)
└── Layer 8 — Executive Learning (Decision Monitoring & Outcome Tracking)
```

---

## 2. Especificação Canônica das 8 Camadas Cognitivas

### Layer 1 — Executive Context (`<ExecutiveDecisionContextCard />`)
- **Propósito**: Declarar formalmente a empresa analisada, período fiscal, período de comparação, escopo da análise e a pergunta executiva orientadora.
- **Regra**: Não pode ser alterado manualmente fora do controle de contexto da página.

### Layer 2 — Executive Intent (`<ExecutiveIntentCard />`)
- **Propósito**: Responder à indagação "Qual decisão esta experiência suporta?".
- **Regra**: Derivado dinamicamente do `ExecutiveDecisionContext` + `Decision Intelligence Engine`. Nunca estático.

### Layer 3 — Executive Understanding (`<ExecutiveSynthesis />`)
- **Propósito**: Responder "O que está acontecendo?" com a síntese fiduciária narrativa gerada pelo `Executive Narrative Engine`.

### Layer 4 — Executive Diagnosis (`<ExecutiveDiagnosisCard />`)
- **Propósito**: Explicar os causadores primários, drivers financeiros e relações de causa e efeito.

### Layer 5 — Executive Deliberation (`<ExecutiveDeliberationCard />`)
- **Propósito**: Apresentar o cenário atual versus cenários alternativos simular trade-offs e impactos projetados.

### Layer 6 — Executive Evidence (`<ExecutiveEvidenceCard />`)
- **Propósito**: Centralizar evidências numéricas em R$, variações em p.p., benchmarks de indústria e nível de confiança ($\ge 95\%$).

### Layer 7 — Executive Execution (`<ExecutiveExecutionCard />`)
- **Propósito**: Estruturar o plano de ação executivo com responsável (Owner), prioridade, prazo (Deadline) e shift esperado no KPI.

### Layer 8 — Executive Learning (`<ExecutiveLearningCard />`)
- **Propósito**: Registrar o resultado das decisões tomadas e alimentar o ciclo de aprendizado contínuo do Digital Twin.

---

## 3. Diretrizes de Design System e Tokens

1. **Cores**: Estritamente semânticas (`bg-card`, `bg-surface-container`, `border-border`, `text-primary`, `text-muted-foreground`). Proibidos fundos azul escuro hardcoded (`bg-slate-950`).
2. **Typography**: Tokens de tipografia executiva (`variant="title"`, `variant="caption"`).
3. **Traceability**: Todo card traz badge de confiança e rastreabilidade até o modelo financeiro.
