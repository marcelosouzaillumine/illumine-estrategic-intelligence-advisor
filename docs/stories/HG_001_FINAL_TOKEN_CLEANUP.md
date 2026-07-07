# HG-001 Final Token Sovereignty Cleanup

## Objetivo
Resolver o débito técnico reportado durante o ECA-004.4 relacionado a violações do *Design Token Sovereignty* em componentes React. 

## Contexto
Durante o *Runtime Recovery*, o teste `design-token-sovereignty.test.ts` bloqueou a esteira CI (build/test) identificando 384 definições legadas de hex colors (e.g. `#FF8552`, `#060D17`) espalhadas por 20 arquivos.
Como a limpeza visual indiscriminada ameaçava a recuperação dos contratos core, este débito foi colocado em estado de `warning/report-only` no teste de soberania.

## Ação Necessária
1. Restaurar `tests/design-token-sovereignty.test.ts` para falhar rigidamente (`assert.strictEqual`).
2. Migrar os 384 hex colors para *Design Tokens* oficiais do Tailwind (classes ou `var(--color-...)` autorizadas).
3. Eliminar todas as definições `style={{ backgroundColor: '#HEX' }}` substituindo-as por equivalentes canônicos.

## Critério de Aceite
- `npm run test` e `npm run build` rodando sem gerar Warnings de "HG-001 Debt".
- `tests/design-token-sovereignty.test.ts` operando de forma estrita novamente, com `0` violações de cores hexadecimais in-line.
