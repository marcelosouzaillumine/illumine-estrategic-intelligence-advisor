# RUNTIME COMPLIANT BENCHMARKS

**Documentação Oficial da Arquitetura Cognitiva Institucional**
**Objetivo:** Guiar as futuras migrações e o desenvolvimento de novos módulos da plataforma garantindo 100% de compliance arquitetural com o Runtime Institucional.

---

## 1. Módulos Certificados (Benchmarks Oficiais)

Os seguintes módulos foram integralmente migrados, auditados e homologados como **Runtime-Compliant**, estabelecendo o padrão ouro de arquitetura cognitiva para a Illumine:

- ✅ **BalanceSheetPage.tsx** (Financial Health Intelligence) -> *CERTIFIED*
- ✅ **DREPage.tsx** (Operational Scale & Eficiência Intelligence) -> *CERTIFIED*
- ✅ **DFCPage.tsx** (Cash & Liquidity Intelligence) -> *CERTIFIED*

*Todo novo código analítico deve ser construído espelhando a arquitetura destes módulos.*

---

## 2. Arquitetura Exigida (Runtime Compliance)

O modelo arquitetural que certificou estes módulos fundamenta-se nos seguintes pilares obrigatórios:

### 2.1 Integração Exclusiva via `RuntimeOutput`
Nenhum componente visual ou página pode inferir lógica complexa. Toda a página se conecta ao sistema nervoso central por meio de um único ponto de contato:
```typescript
const { runtimeOutput, loading } = useInstitutionalRuntime({
  engineType: 'NomeDoAdapter',
  input: { ...dadosBrutos }
});
```

### 2.2 Eliminação Total de Bypass Local
Os seguintes anti-patterns são categoricamente proibidos e bloqueiam a certificação:
- **Cálculo local:** Nenhuma divisão de margens, composição de caixa ou equação matemática financeira pode existir no arquivo `.tsx`. Tudo deve vir do array `metrics`.
- **Narrativa Hardcoded:** A conclusão que aparece na interface não pode ser digitada no Frontend. Ela deve obrigatoriamente ser lida de `runtimeOutput.inferences[0].narrative.diagnostic`.
- **Fallbacks Enganosos:** Quando faltam dados, a interface não pode exibir frases neutras mascaradoras (ex: "Manutenção da estrutura atual"). O Runtime é projetado para quebrar a inteligência e disparar um bloqueio (`blocked: true`).

### 2.3 Confidence Propagation
A plataforma é epistemologicamente franca com o cliente. Toda análise exibe sua qualidade baseada no nível de evidência (`HIGH`, `MEDIUM`, `LOW`). O Frontend deve renderizar o `globalConfidence` do runtime, explicitando que "a profundidade do conselho dependeu da completude dos dados providos".

### 2.4 Violations Rendering (Bloqueios Epistemológicos)
A interface deve abraçar falhas e limitações, exibindo as `violations` retornadas pelo runtime.
- Se o histórico de ciclos é inferior a 2 anos, a inteligência de tendências recusa inferir e o Frontend propaga o alerta com severidade `HIGH`.
- Se um demonstrativo está ausente, o Adapter interrompe o cálculo, o Confidence cai para `LOW` e o alerta institucional preenche o espaço visual vazio de forma didática.

### 2.5 Causalidade Obrigatória
As análises deixaram de ser baseadas em "status" para se tornarem baseadas em "Causalidade Operacional".
O Frontend varre o bloco `causality` retornado pelo Adapter e espelha os *triggers* (gatilho do evento) e *consequences* (impacto projetado futuro). Toda inteligência é preditiva.

---

## 3. Workflow de Adapters (`src/runtime/adapters/`)

O ciclo de vida da inteligência flui exclusivamente pelos Adapters, orquestrados pelo `EngineRegistry`.

**Padrão Exigido em um Adapter:**
1. Validar e formatar os dados cruzeiros (Data Cleansing local).
2. Verificar o tamanho da base de evidência (`historicalCyclesCount`).
3. Disparar erros (`violations`) imediatamente se faltarem blocos vitais.
4. Executar os motores legados originais em um Sandbox interno e isolado.
5. Traduzir os resultados no contrato estrito de `EngineExecutionResult`.

### 3.1 Padrões Anti-Bypass Mapeados
Durante a homologação da DREPage, o seguinte padrão foi considerado falha crítica (agora sanado):
- *O UI buscava a função auxiliar `generateDreInsights()` ao invés de buscar a narrativa no `InferenceBlock`.*

**Correção Implementada:** O `generateDreInsights()` foi encapsulado no Sandbox do `LegacyDREAdapter`. O Frontend agora só lê os bytes que sobrevivem ao enforcement do Orchestrator.
