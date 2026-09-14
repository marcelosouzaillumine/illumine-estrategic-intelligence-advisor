# Customer 360 Implementation Checklist

## Visão Geral

Este checklist guia a implementação completa de uma visão Customer 360 - uma visão unificada e acionável de cada cliente. Baseado nos frameworks de Peter Fader (Customer Centricity, CLV, RFM), Nick Mehta (Health Score, DEAR) e Sean Ellis (AARRR, North Star).

> "Customer 360 não é sobre coletar mais dados - é sobre criar uma visão acionável que permite tratar cada cliente proporcionalmente ao seu valor." — Inspirado em Peter Fader

---

## REGRA DE OURO

**Nunca implemente Customer 360 sem responder:**
1. Quem são nossos melhores clientes? (CLV)
2. Como identificamos quem está em risco? (Health Score)
3. Que ação tomamos com cada segmento? (Playbooks)

---

## FASE 0: PRE-FLIGHT CHECK ✈️

### Alinhamento Estratégico
- [ ] Objetivo de negócio está claro? (retenção, expansão, NPS?)
- [ ] Sponsor executivo identificado?
- [ ] Budget e timeline definidos?
- [ ] Equipe responsável designada?
- [ ] Métricas de sucesso do projeto definidas?

### Maturidade de Dados
- [ ] Assessment de qualidade de dados realizado?
- [ ] Gaps de dados identificados?
- [ ] Data governance existe ou será criado?
- [ ] Compliance (LGPD/GDPR) mapeado?

### Infraestrutura
- [ ] Stack tecnológica definida? (CDP, CRM, Data Warehouse)
- [ ] Integrações necessárias mapeadas?
- [ ] Capacidade técnica da equipe avaliada?
- [ ] Ambiente de desenvolvimento pronto?

**Gate Check:** Todos os itens acima devem estar completos antes de avançar.

---

## FASE 1: DATA SOURCES INVENTORY 📊

### 1.1 Identificação de Fontes

#### Sistemas Transacionais
- [ ] CRM principal identificado?
- [ ] Sistema de billing/pagamentos mapeado?
- [ ] E-commerce/checkout data incluído?
- [ ] Sistema de contratos/assinaturas catalogado?
- [ ] ERP (se aplicável) integrado?

#### Comportamento Digital
- [ ] Analytics web (GA4, Amplitude, Mixpanel)?
- [ ] Dados de produto (feature usage)?
- [ ] App mobile data (se aplicável)?
- [ ] Heatmaps e session recordings?
- [ ] Email engagement metrics?

#### Suporte e Atendimento
- [ ] Tickets de suporte?
- [ ] Chat logs?
- [ ] NPS/CSAT surveys?
- [ ] Reclamações e escalations?
- [ ] Reviews e feedback?

#### Comunidade e Engagement
- [ ] Fórum/comunidade data?
- [ ] Event attendance?
- [ ] Webinar participation?
- [ ] Social media interactions?
- [ ] Referral/advocacy data?

#### Dados Financeiros
- [ ] Revenue por cliente?
- [ ] Histórico de pagamentos?
- [ ] Upsells e cross-sells?
- [ ] Churn revenue?
- [ ] Custo de servir?

#### Dados Terceiros (se aplicável)
- [ ] Enrichment data (Clearbit, ZoomInfo)?
- [ ] Firmographics (B2B)?
- [ ] Intent data?
- [ ] Credit scoring?

### 1.2 Documentação de Fontes

Para CADA fonte identificada, documentar:

```yaml
source_documentation:
  name: "[Nome da Fonte]"
  system: "[Sistema de origem]"
  owner: "[Responsável técnico]"
  refresh_frequency: "[Real-time | Hourly | Daily | Weekly]"
  data_quality_score: "[1-10]"
  key_fields:
    - field_name: "[campo]"
      type: "[string | number | date | boolean]"
      completeness: "[% preenchido]"
      notes: "[observações]"
  integration_method: "[API | Batch | Streaming | Manual]"
  known_issues:
    - "[issue 1]"
    - "[issue 2]"
```

### 1.3 Gap Analysis

- [ ] Lista completa de dados desejados criada?
- [ ] Gaps entre desejado e disponível identificados?
- [ ] Priorização de gaps por impacto?
- [ ] Plano para fechar gaps críticos?
- [ ] Timeline para fechamento de gaps?

### 1.4 Quality Audit por Fonte

Para cada fonte, verificar:

| Check | Descrição | Status |
|-------|-----------|--------|
| Completeness | % de registros com campos-chave preenchidos | [ ] |
| Accuracy | Dados refletem realidade? (amostragem) | [ ] |
| Consistency | Formatos padronizados? | [ ] |
| Timeliness | Dados atualizados com frequência adequada? | [ ] |
| Uniqueness | Sem duplicatas óbvias? | [ ] |
| Validity | Valores dentro de ranges esperados? | [ ] |

**Benchmark:** Fontes core devem ter quality score ≥ 7/10.

---

## FASE 2: IDENTITY RESOLUTION 🔐

### 2.1 Estratégia de Identificação

#### Identificadores Primários
- [ ] Customer ID único definido?
- [ ] Email como identificador secundário?
- [ ] Phone number normalizado?
- [ ] Account ID (B2B)?
- [ ] User ID (produto)?

#### Mapeamento de IDs

```yaml
identity_mapping:
  golden_id: "customer_id"
  mapping_rules:
    - source: "crm"
      source_id: "contact_id"
      confidence: "high"
    - source: "analytics"
      source_id: "user_id"
      confidence: "medium"
    - source: "support"
      source_id: "ticket_email"
      confidence: "medium"
    - source: "billing"
      source_id: "subscription_email"
      confidence: "high"
```

### 2.2 Regras de Match

#### Match Determinístico
- [ ] Regras de match exato definidas?
- [ ] Hierarquia de confiança estabelecida?
- [ ] Tratamento de conflitos documentado?

```yaml
deterministic_rules:
  rule_1:
    name: "Exact Email Match"
    condition: "email_normalized = email_normalized"
    confidence: 0.99
    priority: 1
  rule_2:
    name: "Email + Last Name"
    condition: "email_domain = email_domain AND last_name = last_name"
    confidence: 0.85
    priority: 2
  rule_3:
    name: "Phone + First Name"
    condition: "phone_normalized = phone_normalized AND first_name = first_name"
    confidence: 0.80
    priority: 3
```

#### Match Probabilístico (se necessário)
- [ ] Algoritmo de fuzzy matching escolhido?
- [ ] Threshold de match definido (ex: 0.85)?
- [ ] Processo de review manual para matches duvidosos?
- [ ] ML model treinado (se aplicável)?

### 2.3 Normalização de Dados

#### Email
- [ ] Lowercase aplicado?
- [ ] Trim de espaços?
- [ ] Validação de formato?
- [ ] Remoção de alias (ex: gmail +)?
- [ ] Tratamento de domínios descartáveis?

#### Phone
- [ ] Formato internacional (E.164)?
- [ ] Remoção de caracteres especiais?
- [ ] Validação de país/área?
- [ ] Distinção mobile/landline?

#### Name
- [ ] Capitalização consistente?
- [ ] Tratamento de títulos (Dr., Mr.)?
- [ ] Separação first/last name?
- [ ] Tratamento de nomes compostos?

#### Address (se aplicável)
- [ ] Padronização de endereço?
- [ ] Geocoding para lat/long?
- [ ] Validação postal?

### 2.4 Deduplicação

- [ ] Algoritmo de deduplicação escolhido?
- [ ] Regras de merge definidas (qual dado prevalece)?
- [ ] Processo de golden record estabelecido?
- [ ] Auditoria de duplicatas criadas?
- [ ] Rotina de manutenção agendada?

```yaml
merge_rules:
  email:
    strategy: "most_recent_verified"
    fallback: "most_complete"
  phone:
    strategy: "mobile_preferred"
    fallback: "most_recent"
  address:
    strategy: "most_recent"
    fallback: "billing_preferred"
  name:
    strategy: "crm_source"
    fallback: "most_complete"
```

### 2.5 Validação de Identity Resolution

- [ ] Match rate calculado? (% de records unificados)
- [ ] False positive rate estimado? (matches incorretos)
- [ ] False negative rate estimado? (matches perdidos)
- [ ] Amostragem manual de validação realizada?
- [ ] Baseline antes/depois documentado?

**Benchmarks:**
- Match rate target: >85%
- False positive rate: <2%
- False negative rate: <10%

---

## FASE 3: PROFILE COMPLETENESS 📋

### 3.1 Definição do Perfil Ideal

#### Campos Core (Obrigatórios)
- [ ] Identificadores (ID, email, phone)
- [ ] Nome completo
- [ ] Status do cliente (active, churned, prospect)
- [ ] Segmento/tier
- [ ] Owner/CSM responsável
- [ ] Data de criação
- [ ] Última atividade

#### Campos Demográficos/Firmográficos
- [ ] Localização (país, estado, cidade)
- [ ] Timezone
- [ ] Idioma preferido
- [ ] Setor/Industry (B2B)
- [ ] Company size (B2B)
- [ ] Cargo/Role (B2B)
- [ ] Revenue range (B2B)

#### Campos de Valor
- [ ] CLV calculado
- [ ] MRR/ARR atual
- [ ] Revenue histórico total
- [ ] Número de produtos/planos
- [ ] Contract value
- [ ] Renewal date

#### Campos Comportamentais
- [ ] RFM scores (Recency, Frequency, Monetary)
- [ ] Activation milestone
- [ ] Power user flag
- [ ] Engagement score
- [ ] Feature adoption %
- [ ] Last login date

#### Campos de Saúde
- [ ] Health Score atual
- [ ] Health trend (improving/declining/stable)
- [ ] Risk flags ativos
- [ ] NPS/CSAT mais recente
- [ ] Support sentiment

#### Campos de Relacionamento
- [ ] Account owner
- [ ] Pontos de contato (stakeholders)
- [ ] Histórico de interações (resumo)
- [ ] Próxima ação planejada
- [ ] Oportunidades abertas

### 3.2 Completeness Scoring

```yaml
completeness_tiers:
  critical:
    fields: ["customer_id", "email", "status", "segment"]
    weight: 40%
    target: 100%

  important:
    fields: ["name", "clv", "health_score", "owner"]
    weight: 30%
    target: >95%

  enrichment:
    fields: ["industry", "company_size", "location"]
    weight: 20%
    target: >80%

  nice_to_have:
    fields: ["timezone", "language", "social_profiles"]
    weight: 10%
    target: >50%
```

### 3.3 Audit de Completeness

Para cada segmento de clientes, medir:

| Segmento | Critical | Important | Enrichment | Nice to Have | Overall |
|----------|----------|-----------|------------|--------------|---------|
| Enterprise | [ ] % | [ ] % | [ ] % | [ ] % | [ ] % |
| Mid-Market | [ ] % | [ ] % | [ ] % | [ ] % | [ ] % |
| SMB | [ ] % | [ ] % | [ ] % | [ ] % | [ ] % |
| Self-Serve | [ ] % | [ ] % | [ ] % | [ ] % | [ ] % |

**Target:** Critical 100%, Overall >80%

### 3.4 Data Enrichment Strategy

- [ ] Fontes de enrichment identificadas?
- [ ] Budget para enrichment aprovado?
- [ ] Processo de enrich automático configurado?
- [ ] Refresh frequency definida?
- [ ] Validação de enrichment quality?

```yaml
enrichment_sources:
  b2b:
    - name: "Clearbit"
      fields: ["company_size", "industry", "technologies"]
      coverage: "70%"
      cost: "$X/1000"
    - name: "ZoomInfo"
      fields: ["contacts", "org_chart", "intent"]
      coverage: "60%"
      cost: "$Y/1000"

  b2c:
    - name: "FullContact"
      fields: ["social_profiles", "demographics"]
      coverage: "40%"
      cost: "$Z/1000"
```

### 3.5 Progressive Profiling

- [ ] Campos para progressive profiling identificados?
- [ ] Touchpoints para coleta mapeados?
- [ ] UX de coleta otimizada (não intrusiva)?
- [ ] Incentivos para completar perfil definidos?

```yaml
progressive_profiling:
  stage_1_signup:
    collect: ["email", "name"]
    incentive: "Acesso básico"

  stage_2_onboarding:
    collect: ["company", "role", "use_case"]
    incentive: "Setup personalizado"

  stage_3_activation:
    collect: ["team_size", "goals"]
    incentive: "Recomendações customizadas"

  stage_4_engagement:
    collect: ["feedback", "preferences"]
    incentive: "Features beta"
```

---

## FASE 4: SEGMENTATION VALIDATION ✅

### 4.1 Framework de Segmentação

#### Segmentação por Valor (Fader)

```yaml
value_segments:
  champions:
    criteria:
      clv_percentile: ">90"
      health_score: ">80"
      tenure: ">12 months"
    action: "Advocacy, upsell premium"
    size_target: "5-10%"

  high_value:
    criteria:
      clv_percentile: "70-90"
      health_score: ">60"
    action: "Expansion, white glove"
    size_target: "15-20%"

  growth_potential:
    criteria:
      clv_percentile: "50-70"
      adoption_rate: "<50%"
    action: "Activation, education"
    size_target: "20-25%"

  maintain:
    criteria:
      clv_percentile: "30-50"
      health_score: "40-60"
    action: "Automated engagement"
    size_target: "25-30%"

  at_risk:
    criteria:
      health_score: "<40"
      OR churn_signals: "present"
    action: "Intervention, save plays"
    size_target: "10-15%"

  low_value:
    criteria:
      clv_percentile: "<30"
      cost_to_serve: ">revenue"
    action: "Self-serve only, may churn"
    size_target: "10-15%"
```

#### Segmentação RFM (Fader)

- [ ] Recency scoring definido (1-5)?
- [ ] Frequency scoring definido (1-5)?
- [ ] Monetary scoring definido (1-5)?
- [ ] Combinações RFM mapeadas para segmentos?

```yaml
rfm_segments:
  "555": "Champions"
  "554": "Champions"
  "455": "Loyal Customers"
  "355": "Loyal Customers"
  "545": "Potential Loyalists"
  "535": "Potential Loyalists"
  "155": "New Customers"
  "145": "Promising"
  "115": "Need Attention"
  "114": "About to Sleep"
  "111": "Lost"
  "211": "Hibernating"
```

#### Segmentação por Lifecycle

- [ ] Stages definidos (Prospect → Onboarding → Active → Expanding → At Risk → Churned)?
- [ ] Critérios de transição claros?
- [ ] Automações por stage configuradas?

### 4.2 Validação de Segmentos

#### Teste de Cobertura
- [ ] 100% dos clientes classificados?
- [ ] Nenhum cliente em múltiplos segmentos conflitantes?
- [ ] Distribuição alinhada com expectativas?

#### Teste de Acionabilidade
- [ ] Cada segmento tem playbook de ação?
- [ ] Ações são diferenciadas entre segmentos?
- [ ] Recursos alocados por segmento?

#### Teste de Estabilidade
- [ ] Segmentos não mudam com frequência excessiva?
- [ ] Churn entre segmentos é monitorado?
- [ ] Thresholds são robustos?

#### Teste de Valor Preditivo
- [ ] Segmento "at risk" tem churn rate maior?
- [ ] Segmento "champions" tem NPS maior?
- [ ] Segmento "high value" gera mais receita?

### 4.3 Documentação de Segmentação

```yaml
segment_documentation:
  segment_name: "[Nome]"
  definition: "[Descrição clara]"
  criteria:
    - "[Critério 1]"
    - "[Critério 2]"
  size: "[N clientes, % base]"
  avg_clv: "[$X]"
  avg_health_score: "[Y]"
  primary_action: "[Ação principal]"
  owner: "[Time responsável]"
  refresh_frequency: "[Daily | Weekly]"
  last_validated: "[Data]"
```

### 4.4 Monitoramento de Segmentos

- [ ] Dashboard de distribuição de segmentos?
- [ ] Alertas de mudanças significativas?
- [ ] Relatório semanal/mensal de migração?
- [ ] Review trimestral de critérios?

---

## FASE 5: QUALITY GATES 🚧

### 5.1 Gates de Dados

#### Gate 1: Source Data Quality
```yaml
gate_1:
  name: "Source Data Quality"
  checks:
    - check: "Completeness > 90%"
      status: "[ ]"
    - check: "Freshness < 24h"
      status: "[ ]"
    - check: "No critical errors in ETL"
      status: "[ ]"
  blocking: true
  owner: "Data Engineering"
```

#### Gate 2: Identity Resolution Quality
```yaml
gate_2:
  name: "Identity Resolution"
  checks:
    - check: "Match rate > 85%"
      status: "[ ]"
    - check: "Duplicate rate < 2%"
      status: "[ ]"
    - check: "Manual validation sample passed"
      status: "[ ]"
  blocking: true
  owner: "Data Engineering"
```

#### Gate 3: Profile Completeness
```yaml
gate_3:
  name: "Profile Completeness"
  checks:
    - check: "Critical fields 100%"
      status: "[ ]"
    - check: "Important fields > 95%"
      status: "[ ]"
    - check: "Overall > 80%"
      status: "[ ]"
  blocking: true
  owner: "Data Ops"
```

#### Gate 4: Calculation Accuracy
```yaml
gate_4:
  name: "Calculation Accuracy"
  checks:
    - check: "CLV values validated (sample)"
      status: "[ ]"
    - check: "RFM scores validated"
      status: "[ ]"
    - check: "Health Score correlation verified"
      status: "[ ]"
  blocking: true
  owner: "Analytics"
```

#### Gate 5: Segmentation Validity
```yaml
gate_5:
  name: "Segmentation"
  checks:
    - check: "100% coverage"
      status: "[ ]"
    - check: "No overlaps"
      status: "[ ]"
    - check: "Predictive validity tested"
      status: "[ ]"
  blocking: true
  owner: "Analytics"
```

### 5.2 Gates de Sistema

#### Gate 6: Performance
```yaml
gate_6:
  name: "System Performance"
  checks:
    - check: "Query time < 2s for single customer"
      status: "[ ]"
    - check: "Batch processing completes in window"
      status: "[ ]"
    - check: "API response time < 500ms"
      status: "[ ]"
  blocking: false
  owner: "Engineering"
```

#### Gate 7: Security
```yaml
gate_7:
  name: "Security & Compliance"
  checks:
    - check: "PII encryption at rest"
      status: "[ ]"
    - check: "Access controls configured"
      status: "[ ]"
    - check: "Audit logging enabled"
      status: "[ ]"
    - check: "LGPD/GDPR compliance verified"
      status: "[ ]"
  blocking: true
  owner: "Security"
```

### 5.3 Gates de Processo

#### Gate 8: Documentation
```yaml
gate_8:
  name: "Documentation"
  checks:
    - check: "Data dictionary complete"
      status: "[ ]"
    - check: "Segment definitions documented"
      status: "[ ]"
    - check: "Runbooks created"
      status: "[ ]"
  blocking: false
  owner: "Data Ops"
```

#### Gate 9: Training
```yaml
gate_9:
  name: "User Readiness"
  checks:
    - check: "CS team trained"
      status: "[ ]"
    - check: "Sales team briefed"
      status: "[ ]"
    - check: "Support playbooks updated"
      status: "[ ]"
  blocking: false
  owner: "Enablement"
```

### 5.4 Monitoring Contínuo

#### Alertas Críticos
- [ ] Alerta de queda de completeness > 5%
- [ ] Alerta de ETL failure
- [ ] Alerta de spike em duplicatas
- [ ] Alerta de distribuição anômala de segmentos

#### Health Checks Diários
- [ ] Record count dentro do esperado?
- [ ] Freshness de todas as fontes ok?
- [ ] Cálculos executaram com sucesso?
- [ ] Nenhum segmento com 0 clientes?

#### Review Semanal
- [ ] Quality metrics estáveis?
- [ ] Novos gaps identificados?
- [ ] Feedback de usuários coletado?
- [ ] Action items do review anterior fechados?

---

## FASE 6: ACTIVATION & ADOPTION 🚀

### 6.1 Interfaces de Acesso

- [ ] Customer 360 view no CRM configurada?
- [ ] Dashboard executivo criado?
- [ ] Exports/reports automatizados?
- [ ] API disponível para integrações?
- [ ] Alertas configurados?

### 6.2 Playbooks por Segmento

Para cada segmento, definir:

```yaml
playbook_template:
  segment: "[Nome do Segmento]"
  trigger: "[Quando ativar]"
  owner: "[Time responsável]"
  actions:
    - action: "[Ação 1]"
      timeline: "[Prazo]"
      channel: "[Email | Call | In-app]"
    - action: "[Ação 2]"
      timeline: "[Prazo]"
      channel: "[Channel]"
  success_metric: "[Como medir sucesso]"
  escalation: "[Quando escalar]"
```

### 6.3 Integração com Workflows

- [ ] Triggers de automação configurados?
- [ ] Notificações para CSMs ativas?
- [ ] Syncs com ferramentas de marketing configurados?
- [ ] Fluxos de renewal conectados?

### 6.4 Adoção por Time

| Time | Use Case Principal | KPI de Adoção | Target |
|------|-------------------|---------------|--------|
| CS | Health monitoring, save plays | % logins/semana | >80% |
| Sales | Expansion opportunities | Pipeline influenced | $X |
| Marketing | Campaigns, segmentation | Campaign performance | +Y% |
| Product | Usage insights | Feature decisions | N decisions |
| Support | Context before tickets | Time to resolution | -Z% |

---

## FASE 7: CONTINUOUS IMPROVEMENT 📈

### 7.1 Métricas de Sucesso do C360

#### Métricas de Qualidade
- [ ] Data freshness (% within SLA)
- [ ] Completeness score (overall)
- [ ] Match rate (identity resolution)
- [ ] Error rate (calculations)

#### Métricas de Uso
- [ ] DAU/MAU de usuários internos
- [ ] Queries per user
- [ ] Time in application
- [ ] Features most used

#### Métricas de Impacto
- [ ] Churn reduction (at risk saves)
- [ ] Expansion revenue influenced
- [ ] Time to resolution (support)
- [ ] NPS improvement

### 7.2 Review Cadence

```yaml
review_schedule:
  daily:
    - "Health check automation"
    - "Critical alert triage"

  weekly:
    - "Quality metrics review"
    - "User feedback synthesis"
    - "Issue backlog grooming"

  monthly:
    - "Segment performance analysis"
    - "Gap analysis update"
    - "Roadmap prioritization"

  quarterly:
    - "Full audit of segmentation"
    - "CLV model recalibration"
    - "Health Score weight review"
    - "Strategic alignment check"
```

### 7.3 Feedback Loop

- [ ] Canal de feedback de usuários estabelecido?
- [ ] Data quality issues tracked?
- [ ] Feature requests prioritized?
- [ ] Win/loss analysis includes C360 data?

### 7.4 Roadmap de Evolução

```yaml
evolution_stages:
  v1_foundation:
    - "Basic profile unification"
    - "Manual segmentation"
    - "Reactive use"
    status: "[ ] Complete"

  v2_governance:
    - "Calculated fields (CLV, RFM)"
    - "Health Score"
    - "Automated alerts"
    status: "[ ] Complete"

  v3_predictive:
    - "Churn prediction model"
    - "Propensity scores"
    - "Next best action"
    status: "[ ] In Progress"

  v4_autonomous:
    - "AI-driven insights"
    - "Automated interventions"
    - "Self-optimizing segments"
    status: "[ ] Planned"
```

---

## APPENDIX A: DATA DICTIONARY TEMPLATE

```yaml
data_dictionary:
  field_name:
    display_name: "[Nome amigável]"
    description: "[Descrição clara]"
    data_type: "[string | number | date | boolean | array | object]"
    source: "[Sistema de origem]"
    calculation: "[Fórmula se calculado]"
    refresh: "[Frequência de atualização]"
    nullable: "[true | false]"
    pii: "[true | false]"
    example: "[Valor exemplo]"
```

---

## APPENDIX B: TROUBLESHOOTING COMUM

### Problema: Match Rate Baixo
```
Causas Comuns:
- Emails não normalizados
- IDs inconsistentes entre sistemas
- Registros duplicados na fonte

Soluções:
1. Revisar regras de normalização
2. Adicionar regras de match fuzzy
3. Limpar duplicatas na fonte
```

### Problema: Health Score Não Correlaciona com Churn
```
Causas Comuns:
- Pesos incorretos
- Dados de usage desatualizados
- Definição de churn não alinhada

Soluções:
1. Recalibrar pesos com dados históricos
2. Verificar freshness de dados de produto
3. Alinhar definição de churn com Finance
```

### Problema: Segmentos Muito Voláteis
```
Causas Comuns:
- Thresholds muito sensíveis
- Dados ruidosos
- Período de análise muito curto

Soluções:
1. Adicionar bandas de tolerância
2. Usar médias móveis
3. Aumentar janela de análise
```

### Problema: Baixa Adoção por Usuários
```
Causas Comuns:
- Interface não intuitiva
- Dados não confiáveis
- Falta de training

Soluções:
1. Melhorar UX com feedback
2. Atacar issues de qualidade
3. Criar programa de enablement
```

---

## APPENDIX C: TEMPLATES ADICIONAIS

### Template: Segmentation Review Meeting

```markdown
# Segmentation Review - [Data]

## Distribuição Atual
| Segmento | Count | % | vs Last Month |
|----------|-------|---|---------------|
| ... | ... | ... | ... |

## Migrações Significativas
- X clientes moveram de Y para Z

## Health Score Distribution
- Mean:
- Median:
- At Risk %:

## Action Items
- [ ] ...

## Next Review: [Data]
```

### Template: Quality Gate Report

```markdown
# Quality Gate Report - [Data]

## Gates Status
| Gate | Status | Notes |
|------|--------|-------|
| G1: Source Quality | ✅/⚠️/❌ | ... |
| G2: Identity | ✅/⚠️/❌ | ... |
| ... | ... | ... |

## Blocking Issues
- [ ] Issue 1
- [ ] Issue 2

## Approved for: [Production | Staging | Blocked]
## Approver: [Nome]
```

---

## SCORE CARD FINAL

Conte os ✅ completados e calcule:

| Fase | Items | Completos | % |
|------|-------|-----------|---|
| F0: Pre-Flight | 14 | [ ] | [ ]% |
| F1: Data Sources | 40 | [ ] | [ ]% |
| F2: Identity | 35 | [ ] | [ ]% |
| F3: Profile | 30 | [ ] | [ ]% |
| F4: Segmentation | 25 | [ ] | [ ]% |
| F5: Quality Gates | 35 | [ ] | [ ]% |
| F6: Activation | 20 | [ ] | [ ]% |
| F7: Improvement | 20 | [ ] | [ ]% |
| **TOTAL** | **219** | [ ] | [ ]% |

| Score | Status | Ação |
|-------|--------|------|
| >90% | ✅ Production Ready | Go Live |
| 75-89% | ⚠️ Ready with Gaps | Document risks, Go Live with monitoring |
| 60-74% | ⏸️ Needs Work | Address gaps before Go Live |
| <60% | ❌ Not Ready | Major work required |

---

## PRINCÍPIO FINAL

> "Customer 360 não é um projeto - é uma capability. O dia do lançamento é o início, não o fim. Itere incansavelmente baseado em dados e feedback."
> — Inspirado em frameworks de Fader, Mehta e Ellis

---

*Checklist Version: 1.0*
*Data Governance Pack - Customer 360 Implementation*
*Primary Agents: Peter Fader, Nick Mehta, Sean Ellis*
