# HCA-003 Batch 1 Certification (Safe Refactor)

## 1. Escopo de Execução

### Batch 1A: ViewModel Consolidation Safe Redirect
O ViewModel redundante `InstitutionalMemoryViewModel.ts` foi mapeado para exclusão futura.
- **Auditoria de Consumo:** Não foram detectados consumidores remanescentes importando a versão obsoleta.
- **Redirecionamento:** `InstitutionalMemoryCenter.tsx` já consome o hook padronizado `useInstitutionalMemoryViewModel.ts`.
- **Prevenção:** O arquivo antigo foi mantido no repositório com tag `@deprecated` e indicação clara de substituição para garantir build contínuo até o ciclo de remoção final.

### Batch 1B: Services Taxonomy Discovery/Preparation
Iniciada a estruturação canônica do diretório `src/services/governance/`.
Os 3 serviços abaixo foram migrados de forma segura, mantendo arquivos proxy (barrels) na raiz legada para preservar a retrocompatibilidade dos imports.

1. **Board Report Governance**
   - Movido para: `src/services/governance/BoardReportGovernanceService.ts`
   - Proxy: `src/services/aiBoardReportService.ts`

2. **Advisory Governance**
   - Movido para: `src/services/governance/AdvisoryGovernanceService.ts`
   - Proxy: `src/services/advisoryAiService.ts`

3. **Governance Governance**
   - Movido para: `src/services/governance/GovernanceGovernanceService.ts`
   - Proxy: `src/services/governanceAiService.ts`

## 2. Validation Gates

- `[x]` Nenhuma exclusão imediata realizada.
- `[x]` Nenhuma quebra de import legado (`import { generateAdvisoryParecer } from '../services/advisoryAiService'` permanece funcional).
- `[x]` Zero alterações em runtime engines subjacentes.
- `[x]` **Typecheck & Tests:** ✅ GREEN (Build íntegro, suítes FLIF e TFIF 100% aprovadas sem anomalias nas pipelines de orquestração).

## 3. Próximos Passos Recomendados

A taxonomia provou-se segura na arquitetura em proxy. A transição definitiva e remoção das dependências velhas ocorrerá no fechamento da HCA-003.

**Aguardando autorização para:**
- **Batch 2:** Services Taxonomy (continuidade migratória).
- Ou exclusão definitiva (após garantia de segurança das branches adjacentes).
