# So What Checklist

## Visão Geral

Este checklist valida se reports e dashboards seguem o framework "So What" de Avinash Kaushik. Todo dado apresentado deve levar a uma decisão.

> "A maioria das empresas está data-rich e insight-poor. Não faltam dados, faltam decisões."
> — Avinash Kaushik

---

## REGRA DE OURO

**Se um número não muda uma decisão, é ruído.**

Antes de incluir qualquer métrica em um report, pergunte:
1. Se este número mudar, que ação tomamos?
2. Se não mudar nada, por que estamos mostrando?

---

## O FRAMEWORK SO WHAT

Todo report deve responder 4 perguntas em sequência:

```
┌────────────────────────────────────────────────────────────────┐
│                   SO WHAT FRAMEWORK                             │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. SO WHAT?                                                    │
│     "Por que isso importa?"                                     │
│     Contexto e relevância do dado                               │
│                                                                  │
│  2. WHAT CHANGED?                                               │
│     "O que mudou desde a última análise?"                       │
│     Comparação com baseline/período anterior                     │
│                                                                  │
│  3. WHY?                                                        │
│     "Por que mudou?"                                            │
│     Root cause analysis                                         │
│                                                                  │
│  4. NOW WHAT?                                                   │
│     "O que vamos fazer?"                                        │
│     Ação recomendada específica com owner                       │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## CHECKLIST: VALIDAÇÃO DE REPORT

### 1. SO WHAT? ✅

- [ ] **Headline clara**
  - O insight principal está no topo?
  - Dá para entender em 5 segundos?

- [ ] **Contexto incluído**
  - O número está contextualizado (vs meta, vs benchmark)?
  - O leitor entende a relevância sem perguntar?

- [ ] **Implicação explícita**
  - O que este número significa para o negócio?
  - Qual o impacto financeiro/operacional?

**Exemplo BOM:**
> "Health Score médio caiu de 72 para 58 este mês, colocando R$340K de ARR em risco (23% da receita recorrente)."

**Exemplo RUIM:**
> "O Health Score médio é 58."

---

### 2. WHAT CHANGED? 📊

- [ ] **Comparação presente**
  - Δ vs período anterior?
  - Δ vs meta?
  - Δ vs benchmark?

- [ ] **Direção clara**
  - Subiu? Desceu? Estável?
  - Percentual de mudança?

- [ ] **Significância indicada**
  - A mudança é significativa?
  - Está dentro do esperado?

**Exemplo BOM:**
> "Completion rate caiu 12 pontos percentuais (de 15% para 3%), a maior queda em 6 meses."

**Exemplo RUIM:**
> "Completion rate é 3%."

---

### 3. WHY? 🔍

- [ ] **Root cause identificada**
  - Por que mudou?
  - Hipótese baseada em dados?

- [ ] **Evidência apresentada**
  - Que dados suportam a hipótese?
  - Correlação ou causação?

- [ ] **Fatores contribuintes**
  - Fatores internos vs externos?
  - Múltiplas causas listadas se aplicável?

**Exemplo BOM:**
> "A queda correlaciona com: (1) lançamento do novo módulo sem onboarding adequado, (2) 3 bugs críticos reportados na semana 2, (3) champion churn em 12 contas enterprise."

**Exemplo RUIM:**
> "Não sabemos por que mudou."

---

### 4. NOW WHAT? 🎯

- [ ] **Ação específica**
  - O que fazer é claro?
  - É acionável (não vago)?

- [ ] **Owner definido**
  - Quem é responsável?
  - Nome específico, não "o time"?

- [ ] **Timeline presente**
  - Quando deve ser feito?
  - Due date específica?

- [ ] **Impacto esperado**
  - Que resultado esperamos?
  - Como saberemos se funcionou?

**Exemplo BOM:**
> "Ações:
> 1. Priorizar fix dos 3 bugs críticos - Owner: João (Tech Lead) - Due: Sexta
> 2. Criar onboarding para novo módulo - Owner: Maria (Product) - Due: Próxima semana
> 3. Ligar para 12 contas com champion churn - Owner: Ana (CS) - Due: Hoje"

**Exemplo RUIM:**
> "Precisamos melhorar o Health Score."

---

## CHECKLIST: VALIDAÇÃO DE DASHBOARD

### Estrutura

- [ ] **Hierarquia clara**
  - KPIs principais no topo
  - Drill-down disponível para detalhes
  - Não mais de 7 métricas na visão principal

- [ ] **Filtros úteis**
  - Período selecionável
  - Segmentos filtráveis
  - Comparação ativável

### Cada Métrica

Para CADA número no dashboard:

| Métrica | So What? | vs Anterior | Action if Changes |
|---------|----------|-------------|-------------------|
| _______ | ________ | ________ | _________________ |
| _______ | ________ | ________ | _________________ |
| _______ | ________ | ________ | _________________ |

### Acionabilidade

- [ ] **Alertas configurados**
  - Thresholds definidos
  - Notificações para owners

- [ ] **Links para ação**
  - Click leva para próxima ação?
  - Playbooks acessíveis?

---

## ANTI-PATTERNS A EVITAR

### ❌ Data Dump
```
ERRADO:
"Aqui estão 47 métricas do mês passado."

CERTO:
"Baseado nos dados, devemos fazer X porque Y."
```

### ❌ Métricas Órfãs
```
ERRADO:
Mostrar número sem contexto de decisão.

CERTO:
Cada número leva a uma ação potencial.
```

### ❌ Vanity Metrics
```
ERRADO:
"Temos 10,000 usuários cadastrados!"

CERTO:
"1,500 usuários ativos (15% dos cadastrados) geraram R$X de receita."
```

### ❌ Conclusões sem Evidência
```
ERRADO:
"Acreditamos que o problema é X." (sem dados)

CERTO:
"Os dados mostram que X correlaciona com Y (r=0.7)."
```

### ❌ Ação sem Owner
```
ERRADO:
"Precisamos melhorar isso."

CERTO:
"João vai implementar X até sexta para resolver Y."
```

---

## QUICK VALIDATION

### Para cada seção do report, pergunte:

1. ☐ **SO WHAT?** - O leitor entende por que isso importa?
2. ☐ **WHAT CHANGED?** - A comparação está clara?
3. ☐ **WHY?** - A causa está identificada?
4. ☐ **NOW WHAT?** - A ação está clara com owner e deadline?

### Score

| Seções com So What completo | Rating |
|-----------------------------|--------|
| 100% | ⭐⭐⭐ Excelente |
| 75-99% | ⭐⭐ Bom |
| 50-74% | ⭐ Precisa melhorar |
| <50% | ❌ Refazer |

---

## TEMPLATES DE SO WHAT

### Template 1: Performance Report

```markdown
## [Métrica]: [Valor]

**SO WHAT?**
[Valor] é [X%] [acima/abaixo] do [target/anterior], impactando [área do negócio] em [quantificação].

**WHAT CHANGED?**
- vs Mês anterior: [delta]%
- vs Meta: [delta]%
- vs Mesmo período ano passado: [delta]%

**WHY?**
A mudança é explicada por:
1. [Causa 1] - [evidência]
2. [Causa 2] - [evidência]

**NOW WHAT?**
| Ação | Owner | Due |
|------|-------|-----|
| [Ação 1] | [Nome] | [Data] |
| [Ação 2] | [Nome] | [Data] |
```

### Template 2: Alert/Issue

```markdown
## ⚠️ [Alerta]: [Descrição breve]

**SO WHAT?**
Este [alerta] coloca em risco [R$X] de [receita/ARR/etc].

**WHAT CHANGED?**
[Métrica] passou de [X] para [Y], cruzando o threshold de [Z].

**WHY?**
Root cause provável: [causa] baseado em [evidência].

**NOW WHAT?**
- **Imediato** (24h): [Ação] - Owner: [Nome]
- **Curto prazo** (7d): [Ação] - Owner: [Nome]
- **Follow-up**: [Data] para verificar resolução
```

---

## METADATA

| Campo | Valor |
|-------|-------|
| Report/Dashboard | |
| Reviewer | |
| Data review | |
| Score | |
| Status | |

---

## REFERÊNCIAS

- **Avinash Kaushik**: Occam's Razor blog, Web Analytics 2.0
- **DMMM Framework**: Digital Marketing & Measurement Model
- **10/90 Rule**: 10% ferramentas, 90% pessoas que interpretam

---

*Data Governance Pack - So What Checklist v1.0*
*Based on: Avinash Kaushik Methodology*
*Last Updated: 2026-01-23*
