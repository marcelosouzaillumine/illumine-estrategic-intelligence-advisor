# Executive Architecture Constitution (EAC) — Illumine OS™

**Norma Soberana de Arquitetura de Software, Modelagem MVVM e Limites de Código**

---

## 1. Princípios de Engenharia
- **Pureza da View Layer**: A View (`.tsx`) é um consumidor 100% passivo de estado fornecido pelo ViewModel (`use[Page]ViewModel`).
- **Zero Lógica na View**: Deduções contábeis, filtros, ordenação e sanitização i18n devem ocorrer exclusivamente em ViewModels, Adapters e Runtime Engines.
- **Zero API na View**: `fetch`, `axios` ou chamadas de banco/Supabase são **estritamente proibidas** dentro de componentes visuais.

---

## 2. Limites Objetivos de Complexidade (`MUST`)
- **Linhas de Código da View (`.tsx`)**: $\le 500$ linhas.
- **Hooks Próprios Declarados na View**: $\le 10$ hooks.
- **Modais por Página**: $\le 3$ modais (extrair diálogos secundários para subcomponentes).
- **Chamadas de API na View**: **0 chamadas (`MUST`)**.
- **Regras de Negócio na View**: **0 regras (`MUST`)**.

---

## 3. Matriz de Decisão Arquitetural (EAA vs EFA)

| Se a página... | Arquitetura Obrigatória | Fluxo de Trabalho |
| :--- | :--- | :--- |
| **Apresenta indicadores / conselho** | **EAA (Executive Analytical Architecture)** | Resumo ➔ Narrativa ➔ Análise ➔ Detalhamento |
| **Apresenta demonstrativos (BP, DRE, DFC)** | **EAA (Executive Analytical Architecture)** | Resumo ➔ Narrativa ➔ Análise ➔ Detalhamento |
| **Executa cadastros (Clientes, Usuários)** | **EFA (Executive Functional Architecture)** | Localizar ➔ Selecionar ➔ Editar ➔ Salvar |
| **Executa configurações ou parâmetros** | **EFA (Executive Functional Architecture)** | Localizar ➔ Selecionar ➔ Editar ➔ Salvar |
| **Realiza importação ou upload de dados** | **EFA (Executive Functional Architecture)** | Dropzone ➔ Validação Schema ➔ Ingestão ➔ Audit |
| **Mistura análise e operação** | **PROIBIDO (`MUST`)** | **Separar em duas páginas ou workspaces** |

---

## 4. Governança de Exceções (`AE Lifecycle`)
Exceções temporárias a regras `MUST` exigem tag `@ArchitecturalException AE-XXXX` no topo do arquivo com justificativa, validade, aprovador e plano de remoção. Exceções sem prazo ativam falha imediata no CI/CD.
