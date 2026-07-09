# HCA-004 Batch 1: ViewModel Contract Hardening (Discovery & Execution)

A nova diretriz estrita (Constituição v6) determina que arquivos de ViewModel forneçam o contrato padrão `{ state, computed, actions }`. O nosso script guardrail flagrou 10 arquivos que não seguem esse padrão.

## 1. Topologia da Violação (10 ViewModels)

| Arquivo | Tipo Original | Retorno / Estrutura Atual | Risco de Correção |
| :--- | :--- | :--- | :--- |
| `useInstitutionalBenchmarkingViewModel.ts` | React Hook | `{ execution, sector, setSector }` | **SAFE** |
| `useInstitutionalMonitoringViewModel.ts` | React Hook | `{ alerts, isRunning, lastExecution, handleRunCycle }` | **SAFE** |
| `AdvisorWorkspaceViewModel.ts` | Classe Estática | Métodos adaptadores `adaptPortfolio`, `adaptInsights` | **SAFE** |
| `ExecutiveCognitiveViewModel.ts` | Classe DTO/Model | Propriedades públicas | **SAFE** |
| `BalanceSheetExecutiveViewModel.ts` | TS Interface | Definição de Tipos (`src/types/`) | **MEDIUM** |
| `InstitutionalDigitalTwinViewModel.ts` | Classe / DTO | Métodos estruturais | **SAFE** |
| `BoardInvestigationViewModel.ts` | Classe / DTO | Métodos estruturais | **SAFE** |
| `InstitutionalMemoryViewModel.ts` | Classe estática | Métodos utilitários | **SAFE** |
| `GovernanceTimeMachineViewModel.ts` | React Hook / Classe | Estado misto | **MEDIUM** |
| `WarRoomViewModel.ts` | Classe | Propriedades mistas | **SAFE** |

## 2. Estratégia de Correção Híbrida (Compatibilidade Legada)
Como a regra absoluta deste batch é **NÃO MEXER NA UI**, não podemos simplesmente trocar o retorno dos hooks, pois a UI quebraria. 
A estratégia **SAFE** é retornar o novo contrato embutido no contrato antigo:
```typescript
return {
  state: { ... },
  computed: { ... },
  actions: { ... },
  // Spread legado para manter UI intacta:
  execution, sector, setSector
};
```

## 3. Escopo de Intervenção Concluída (Batch 1 - 3 SAFE)
Aplicamos a blindagem nos 3 alvos mais seguros:
1. `useInstitutionalBenchmarkingViewModel.ts` (Hook) - **Corrigido**
2. `useInstitutionalMonitoringViewModel.ts` (Hook) - **Corrigido**
3. `AdvisorWorkspaceViewModel.ts` (Classe) - **Corrigido**

**✅ CERTIFICAÇÃO:** 
- Violações reduzidas de **10** para **7**.
- `npm run validate:architecture` passou perfeitamente e limitou a margem legada.
- `npm run typecheck` e `npm run test` aprovados (1.449 testes verdes).
- **HCA-004 Batch 1 Concluído Fiduciariamente.**
