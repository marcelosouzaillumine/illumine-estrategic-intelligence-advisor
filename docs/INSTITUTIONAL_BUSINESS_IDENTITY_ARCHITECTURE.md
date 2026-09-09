# Institutional Business Identity Architecture

## Evolução da Illumine Governance de Inteligência Financeira para Inteligência Institucional Contextual

### Objetivo
Evoluir a Illumine Governance de uma engine predominantemente orientada à interpretação financeira para uma infraestrutura de Inteligência Institucional Contextual, onde o runtime passa a compreender a identidade operacional da organização antes de interpretar seus indicadores financeiros.

A meta desta arquitetura é impedir que empresas estruturalmente diferentes sejam classificadas de forma semelhante apenas porque compartilham padrões contábeis superficiais.

### Problema Estrutural Atual
Atualmente, o runtime infere o “Modelo Econômico” predominantemente a partir de:
* composição do ativo;
* dependência de estoque;
* liquidez;
* estrutura de capital;
* comportamento do capital de giro.

**Exemplo atual:**
Modelo Econômico → Dependente de Estoques

Embora tecnicamente correto, isso é institucionalmente insuficiente.
Empresas completamente diferentes podem ser classificadas da mesma forma:
* indústria;
* comércio atacadista;
* distribuidora;
* varejo;
* hospital;
* operação logística.

Todas podem apresentar:
* estoque elevado;
* dependência de capital de giro;
* pressão operacional.

Mas possuem:
* riscos diferentes;
* margens diferentes;
* ciclos financeiros diferentes;
* estruturas operacionais diferentes;
* benchmarks diferentes;
* maturidades diferentes;
* dinâmicas institucionais diferentes.

### Diretriz Institucional Obrigatória
A identidade operacional da empresa deve nascer:
* do cadastro institucional do cliente;
  e não:
* exclusivamente da fotografia financeira do BP/DRE/DFC.

O runtime financeiro deve:
* validar;
* tensionar;
* interpretar;
* contextualizar;
  a identidade operacional previamente definida.

---

### 1. Nova Camada Obrigatória

**Criar:** `InstitutionalBusinessProfile`

**Responsabilidade:** representar a identidade institucional base da organização.

---

### 2. Estrutura Recomendada

**Criar:** `src/core/runtime/institutional-identity/InstitutionalBusinessProfile.ts`

**Estrutura sugerida:**
```typescript
export type InstitutionalBusinessProfile = {
  segmentoOperacional: string;
  subsetorOperacional?: string;
  modeloOperacional?: string;
  intensidadeEstoque?: 
    | "LOW"
    | "MODERATE"
    | "HIGH";
  intensidadeCapital?: 
    | "LIGHT"
    | "MODERATE"
    | "INTENSIVE";
  perfilCicloFinanceiro?: 
    | "SHORT"
    | "MODERATE"
    | "LONG";
  perfilMargem?: 
    | "LOW_MARGIN"
    | "MODERATE_MARGIN"
    | "HIGH_MARGIN";
  perfilEscalabilidade?: 
    | "LOCAL"
    | "REGIONAL"
    | "SCALABLE";
  dependenciaCapitalGiro?: 
    | "LOW"
    | "MODERATE"
    | "HIGH";
  criticidadeOperacional?: 
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "MISSION_CRITICAL";
};
```

---

### 3. Nova Engine Obrigatória

**Criar:**
`SegmentGovernanceEngine`
ou
`InstitutionalIdentityResolver`

#### 3.1. Implementação Atual (SegmentGovernanceEngine)

A engine foi implementada em `src/core/runtime/institutional-context/` e atua como a primeira camada operacional do runtime. Suas principais responsabilidades incluem:
* **Contextual Confidence Matrix**: Isola o nível de confiança na interpretação (baseado na completude dos dados) do score financeiro da empresa.
* **Fail-Closed Runtime**: Implementa restrições como "No Segment, No Strong Diagnosis", que proíbem downstream runtimes de emitir conclusões fortes caso o perfil institucional seja insuficiente.
* **Capital Cycle Mismatch Rules**: Protege empresas com dinâmicas estruturais específicas (hospitais, estoque pesado, projetos, ONGs) de leituras limitadas baseadas apenas em liquidez corrente estática.
* **Audit Trail Total**: Garante explicabilidade para qualquer alteração de restrição repassando a origem da regra (`inputFieldsUsed`), justificativa (`limitationCreated`), e impacto (`downstreamImplication`).

---

### 4. Objetivo da Engine

Transformar:
* segmento;
* subsetor;
* características operacionais;

em:
* identidade operacional contextual;
* parâmetros esperados;
* comportamento financeiro esperado;
* perfil institucional esperado.

---

### 5. Fluxo Arquitetural Correto

**Novo fluxo obrigatório:**
```text
Cadastro do Cliente
        ↓
Segment Governance Matrix
        ↓
InstitutionalBusinessProfile
        ↓
Runtime Financeiro
        ↓
Contextual Governance Layer
        ↓
Executive Advisory Layer
```

---

### 6. Separação Conceitual Obrigatória

Separar claramente:

**Segmento Operacional**
Origem: cadastro do cliente.
Exemplo: Comércio e Distribuição de Ingredientes

**Modelo Operacional**
Origem: interpretação contextual.
Exemplo: Operação Comercial Intensiva em Estoques

**Perfil Financeiro**
Origem: runtime causal.
Exemplo: Dependência relevante de capital operacional de curto prazo

**Maturidade Institucional**
Origem: runtime longitudinal.
Exemplo: Operação em Estruturação

---

### 7. Exemplo — Granatum

**Antes**
Modelo Econômico → Dependente de Estoques

**Depois**
Segmento Operacional → Comércio e Distribuição de Ingredientes
Modelo Operacional → Operação Comercial Intensiva em Estoques
Perfil Financeiro → Dependência relevante de capital operacional de curto prazo
Maturidade Institucional → Operação em Estruturação

---

### 8. Benefícios Arquiteturais

Essa separação permitirá:
* benchmark setorial contextual;
* score mais inteligente;
* action plans mais coerentes;
* stress testing contextual;
* inferências mais sofisticadas;
* advisory institucional real;
* diferenciação premium.

---

### 9. Evolução do Runtime

O runtime deixa de:
* interpretar apenas balanços;

e passa a:
* interpretar organizações.

---

### 10. Impacto Futuro

Essa arquitetura permitirá posteriormente:

**Segment Benchmarking**
Comparação por segmento.

**Risk Baselines**
Risco esperado por indústria.

**Contextual Thresholds**
Thresholds específicos por setor.

**Institutional Stress Profiles**
Perfis de stress específicos:
* hospitalar;
* industrial;
* distribuição;
* varejo;
* serviços;
* SaaS;
* construção;
  etc.

---

### 11. Nova Taxonomia Recomendada

Substituir:
Modelo Econômico → Dependente de Estoques

por:
Modelo Operacional → Operação Intensiva em Estoques
ou:
Modelo Operacional → Operação Comercial Intensiva em Estoques

Muito mais institucional e executivo.

---

### 12. Diretriz Final

A Illumine Governance deve evoluir de:
**Financial Governance**
para:
**Institutional Contextual Governance**

O sistema não deve mais apenas:
* interpretar indicadores;
mas:
* compreender a natureza operacional da organização antes de interpretar seus dados financeiros.
