# Legacy Memory Audit

### Domínio: `src/core/runtime/institutional-memory/` e Adaptadores Relacionados

A infraestrutura de `InstitutionalMemoryEngine` passou por um processo de maturação profundo para se integrar ao `InstitutionalBoardPackDocumentRuntime` (Reporting Unified).

#### 1. Estrutura do Engine (`InstitutionalMemoryAdapter.ts` / `InstitutionalMemoryEngine.ts`)
- O motor não sofreu depreciação, mas a sua **camada de apresentação foi desacoplada**. Antes, ele emitia blocos markdown diretos ou chaves rígidas. Hoje, ele cospe `metrics` e `narrative` que o `BoardPackRuntime` intercepta e remonta.

#### 2. Rastreio de Dependências em Testes
- O teste `tests/institutional-memory-engine.test.ts` falha estritamente na linha 193:
  `assert.ok(docOutput.markdownSections.institutionalMemorySummary);`
- **Diagnóstico do Código**: Verificando o código real no arquivo `InstitutionalBoardPackDocumentRuntime.ts`, observo que a chave exata `institutionalMemorySummary` AINDA EXISTE (linha 322: `sections.institutionalMemorySummary = summaryText;`), porém ela está condicionada à presença estrutural correta de `report.inferences['InstitutionalMemoryEngine']`.
- A falha real ocorre pois o mock do teste passa um payload inconsistente, sem preencher `inferences` ou a hierarquia no formato atualizado que o `generateDocument` passou a exigir na nova arquitetura.

#### Conclusão
O código base da memória não precisa ser reescrito, está alinhado à soberania. O que precisa ser reconstruído é o mock dos *fixtures* que alimentam o motor no arquivo de teste.
