# HCA-003 Batch 2: Services Taxonomy Discovery

Este documento mapeia os serviços residuais encontrados em `src/services/` após o Batch 1. O objetivo é estabelecer uma taxonomia canônica, classificar o risco de migração e propor a primeira onda segura de consolidações, evitando quebras estruturais.

## 1. Inventário e Taxonomia por Domínio

Foram mapeados os serviços remanescentes na raiz e agrupados por sua vocabulário arquitetural.

### 🛡️ Adapters (Interfaces de Runtime)
*Geralmente fazem ponte entre o modelo antigo e o novo Runtime Core.*
- `BoardRuntimeAdapter.ts` (712 bytes)
- `ClientExecutiveFinancialDataAdapter.ts` (8 KB)
- `CopilotRuntimeAdapter.ts` (502 bytes)
- `EFOSRuntimeAdapter.ts` (573 bytes)
- `EFOSTypes.ts` (496 bytes)
- `ExecutionGovernanceAdapter.ts` (760 bytes)
- `ExecutiveRuntimeAdapter.ts` (397 bytes)
- `FiduciaryRuntimeAdapter.ts` (31 KB)

### 🧠 Intelligence (Serviços Analíticos e IA)
*Extensão do Batch 1B.*
- `aiService.ts` (11 KB)
- `intelligenceEngine.ts` (7 KB)

### 💰 Financial (Processamento Financeiro)
- `cashFlowService.ts` (10 KB)
- `taxService.ts` (3 KB)

### 🏛️ Governance (Processos Fiduciários)
- `governanceService.ts` (8 KB)
- `boardResolutionService.ts` (1.8 KB)

### ⚙️ Platform & Infrastructure (Logs, Notificações, Segurança)
- `notificationService.ts` (2 KB)
- `auditService.ts` (641 bytes)
- `efosGuard.ts` (1.1 KB)
- `supportService.ts` (5 KB)

### 🔗 Integrations (Externos e Processamento em Massa)
- `marketService.ts` (2.4 KB) - *Integração com Bacen/SGS.*
- `importService.ts` (48 KB) - *Legacy Data Import.*

---

## 2. Classificação de Risco

### 🟢 Risco: SAFE
*Serviços puros, focados em infraestrutura, poucas dependências cruzadas e fáceis de relocar usando proxy.*
- `notificationService.ts`
- `auditService.ts`
- `marketService.ts`
- `boardResolutionService.ts`
- `taxService.ts`

### 🟡 Risco: MEDIUM
*Serviços que contêm inteligência de domínio leve, mas possuem amarras com Firebase ou tipos locais.*
- `aiService.ts`
- `governanceService.ts`
- `cashFlowService.ts`
- `supportService.ts`
- Adapters menores (ex: `EFOSRuntimeAdapter.ts`, `CopilotRuntimeAdapter.ts`).

### 🔴 Risco: HIGH
*Arquivos monolíticos, motores ocultos ou hubs de importação cruzada massiva. Requerem refatoração estrutural profunda.*
- `FiduciaryRuntimeAdapter.ts` *(245 imports relativos!)*
- `importService.ts` *(48 KB, motor de ingestão monolítico)*
- `intelligenceEngine.ts` *(Possível sombreamento de engines do core)*
- `ClientExecutiveFinancialDataAdapter.ts`

---

## 3. Análise de Imports Sensíveis

- Grande parte dos serviços consome `../lib/firebase`. A migração para pastas aninhadas (ex: `src/services/platform/`) exigirá alteração mecânica para `../../lib/firebase`.
- `FiduciaryRuntimeAdapter.ts` possui 245 imports relativos mapeados, cruzando múltiplos domínios fiduciários. Qualquer movimento neste arquivo quebrará referências em massa se não for tratado com script dedicado.

---

## 4. Proposta de Migração: Batch 2 (Seguro)

Conforme as diretrizes (não mover, deletar ou renomear agora), proponho que o **Batch 2B** foque nos seguintes serviços **SAFE**:

1. **Market Integrations:**
   - Mover `marketService.ts` para `src/services/integrations/marketService.ts`.
2. **Platform & Audit:**
   - Mover `auditService.ts` para `src/services/platform/auditService.ts`.
   - Mover `notificationService.ts` para `src/services/platform/notificationService.ts`.
3. **Financial / Taxation:**
   - Mover `taxService.ts` para `src/services/financial/taxService.ts`.

A transição ocorrerá através da mecânica **Proxy Barrels**, onde o arquivo original será substituído por um export apontando para a nova pasta com a notação `@deprecated`, mantendo 100% dos consumidores intactos.
