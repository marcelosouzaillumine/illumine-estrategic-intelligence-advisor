# Pre-Implementation Checklist

## Visão Geral

Este checklist deve ser completado **ANTES** de iniciar qualquer implementação do Data Governance Pack. Garante que os fundamentos estão corretos e evita retrabalho.

> "Nunca implemente uma métrica sem passar por pelo menos 1 fundamentador (Tier 0)."
> — Data Governance Pack Golden Rule

---

## REGRA DE OURO

**Antes de implementar, responda:**
1. Qual decisão este dado informa?
2. Quem vai usar este dado e quando?
3. Que ação será tomada com base nele?

Se não conseguir responder, **PARE** e alinhe com stakeholders.

---

## GATE 1: ALINHAMENTO ESTRATÉGICO ✈️

**Objetivo:** Garantir que a implementação está alinhada com objetivos de negócio.

### Checklist

- [ ] **Sponsor identificado**
  - Nome: _____________
  - Cargo: _____________
  - Disponibilidade confirmada para decisions gates

- [ ] **Objetivo de negócio claro**
  - Qual problema estamos resolvendo? _____________
  - Como mediremos sucesso? _____________
  - Qual o ROI esperado? _____________

- [ ] **Escopo definido**
  - [ ] Escopo documentado
  - [ ] Out of scope explícito
  - [ ] Critérios de sucesso mensuráveis

- [ ] **Recursos alocados**
  - [ ] Time técnico disponível
  - [ ] Time de CS/operações engajado
  - [ ] Budget aprovado (se aplicável)

### Gate Check
```
[ ] PASS - Todos os itens acima completos
[ ] FAIL - Itens faltando: _____________
```

---

## GATE 2: AUDIT DE DADOS 📊

**Objetivo:** Garantir que os dados necessários existem e são confiáveis.

### Checklist

- [ ] **Fontes de dados identificadas**
  - [ ] Lista completa de tabelas/views necessárias
  - [ ] Referência: `supabase/docs/SCHEMA.md`

- [ ] **Quality assessment realizado**

  | Fonte | Completeness | Freshness | Quality Score |
  |-------|--------------|-----------|---------------|
  | transactions | ___% | ___ | ___/10 |
  | mind_content_interactions | ___% | ___ | ___/10 |
  | member_streaks | ___% | ___ | ___/10 |
  | messages | ___% | ___ | ___/10 |

- [ ] **Gaps identificados**
  - Gap 1: _____________
  - Gap 2: _____________
  - Plano para fechar gaps: _____________

- [ ] **Data governance**
  - [ ] PII identificado e protegido
  - [ ] RLS configurado onde necessário
  - [ ] Compliance (LGPD) verificado

### Gate Check
```
[ ] PASS - Quality score médio ≥ 7/10
[ ] FAIL - Quality issues: _____________
```

---

## GATE 3: FUNDAMENTAÇÃO (Tier 0) 🎯

**Objetivo:** Consultar os fundamentadores antes de implementar.

### Peter Fader - Customer Centricity

- [ ] **Definição de valor**
  - Quem são os melhores clientes? (CLV top 20%)
  - Como identificamos? (critérios)
  - Quanto representam da receita?

- [ ] **Segmentação definida**
  - [ ] RFM scores calculáveis
  - [ ] Segmentos nomeados (Champions, Loyal, etc.)
  - [ ] Ações por segmento definidas

### Sean Ellis - Growth

- [ ] **North Star Metric definida**
  - Qual é a North Star? _____________
  - Quem é dono? _____________
  - Target? _____________

- [ ] **Viral/Referral trackable**
  - [ ] Podemos rastrear indicações?
  - [ ] Viral coefficient calculável?

### Gate Check
```
[ ] PASS - Fundamentação completa
[ ] FAIL - Tier 0 não consultado: _____________
```

---

## GATE 4: DESIGN TÉCNICO 🔧

**Objetivo:** Garantir que o design técnico é sólido.

### Checklist

- [ ] **Views/queries desenhadas**
  - [ ] SQL draft criado
  - [ ] Performance testada (< 5s para consultas principais)
  - [ ] Indexes planejados

- [ ] **Dependências mapeadas**
  ```
  Esta implementação depende de:
  - [ ] Views existentes: _____________
  - [ ] Tabelas: _____________
  - [ ] Funções RPC: _____________
  ```

- [ ] **Rollback plan**
  - [ ] Como reverter se der errado?
  - [ ] Backup necessário?

- [ ] **Naming conventions seguidas**
  - [ ] Views: `v_` prefix
  - [ ] Slugs: snake_case
  - [ ] Colunas: snake_case

### Gate Check
```
[ ] PASS - Design aprovado
[ ] FAIL - Issues: _____________
```

---

## GATE 5: OPERACIONALIZAÇÃO (Tier 1) ⚙️

**Objetivo:** Garantir que a implementação é operacionalizável.

### Nick Mehta - Health Score (se aplicável)

- [ ] Componentes definidos com pesos
- [ ] Thresholds validados (70/40 boundaries)
- [ ] DEAR framework aplicado

### David Spinks - Community (se aplicável)

- [ ] SPACES metrics mapeadas
- [ ] Benchmarks definidos

### Wes Kao - Learning (se aplicável)

- [ ] Completion tracking viável
- [ ] CBC elements identificados

### Gate Check
```
[ ] PASS - Operacionalização definida
[ ] FAIL - Tier 1 gaps: _____________
```

---

## GATE 6: COMUNICAÇÃO (Tier 2) 📢

**Objetivo:** Garantir que os outputs são acionáveis.

### Avinash Kaushik - So What

- [ ] **So What defined**
  - [ ] Cada métrica tem "So What" claro
  - [ ] Reports terminam em ação

- [ ] **DMMM mapping**
  - [ ] Business Objective → Goals → KPIs → Targets → Segments

- [ ] **Stakeholders identificados**
  - [ ] Quem vai consumir estes dados?
  - [ ] Com que frequência?
  - [ ] Que decisões tomam?

- [ ] **Report format**
  - [ ] Template selecionado
  - [ ] Cadência definida

### Gate Check
```
[ ] PASS - Comunicação planejada
[ ] FAIL - Issues: _____________
```

---

## FINAL APPROVAL

### Summary

| Gate | Status | Notes |
|------|--------|-------|
| G1: Alinhamento | ⬜ | |
| G2: Audit Dados | ⬜ | |
| G3: Fundamentação | ⬜ | |
| G4: Design Técnico | ⬜ | |
| G5: Operacionalização | ⬜ | |
| G6: Comunicação | ⬜ | |

### Approval

```
[ ] APPROVED TO PROCEED
    Approved by: _____________
    Date: _____________

[ ] NOT APPROVED
    Blocking issues: _____________
    Re-review date: _____________
```

---

## QUICK REFERENCE

### Quando usar cada Tier

```
TIER 0 - FUNDAMENTADORES (Sempre consultar primeiro)
├── Peter Fader: CLV, RFM, "quem importa"
└── Sean Ellis: Growth, Referral, "como crescer"

TIER 1 - OPERACIONALIZADORES (Para implementar)
├── Nick Mehta: Health Score, Churn, DEAR
├── David Spinks: Community, SPACES
└── Wes Kao: Learning, Completion, CBC

TIER 2 - COMUNICADORES (Para apresentar)
└── Avinash Kaushik: Attribution, DMMM, So What
```

### Anti-patterns a evitar

- ❌ Implementar sem definir quem usa
- ❌ Criar dashboard sem "So What"
- ❌ Medir tudo sem priorizar
- ❌ Copiar métricas de outros sem contexto
- ❌ Ignorar qualidade de dados

---

## METADATA

| Campo | Valor |
|-------|-------|
| Projeto | |
| Responsável | |
| Data início | |
| Review date | |
| Status | |

---

*Data Governance Pack - Pre-Implementation Checklist v1.0*
*Last Updated: 2026-01-23*
