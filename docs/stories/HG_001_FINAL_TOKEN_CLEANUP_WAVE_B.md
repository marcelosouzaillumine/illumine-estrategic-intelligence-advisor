# HG-001 Final Token Cleanup — Wave B (Scope)

## Visão Geral
Após a finalização e certificação da Wave A, o escopo restrito aos componentes React (arquivos `.tsx`) foi rigorosamente submetido a uma queda para 0 violações dentro da abrangência coberta pelo teste de Design Sovereignty. 
Contudo, de acordo com o levantamento global, restam 261 ocorrências dispersas em outros domínios da aplicação, compondo os 5 maiores ofensores restantes.

### Inventário do Escopo (Top 5 Ofensores Remanescentes)
1. `src/index.css` (204 ocorrências) *— Excluído, pois se refere às declarações constitucionais do Tailwind.*
2. `src/lib/utils.ts` (15 ocorrências)
3. `src/components/ui/executive-chart-series-registry.ts` (12 ocorrências)
4. `src/components/pdf/TemporalBoardPackSection.tsx` (8 ocorrências)
5. `src/core/export/board-pack/InstitutionalReportLayoutEngine.ts` (6 ocorrências)

## Meta
Reduzir as 261 ocorrências (trazendo a contagem oficial para próximo de ~204, que é o lastro do próprio arquivo CSS principal da constituição visual).

## Estratégia de Adequação
Visto que os motores de exportação para PDF (`@react-pdf/renderer`) e de geração de Charting SVG puros não operam no DOM tradicional, a substituição requer um design fiduciário com injeção de temas e uso de constantes exportadas do tailwind config, para preservar a integridade estática do Design System sem forçar o uso de `#HEX`.

O teste de `design-token-sovereignty.test.ts` será reativado para o modo assert.strictEqual() absoluto.
