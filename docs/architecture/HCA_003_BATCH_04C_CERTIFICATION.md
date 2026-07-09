# HCA-003 Batch 4C: BoardExperienceShell Boundary Certification

## 1. Escopo de Execução
O Batch 4C tratou de isolar a sanitização visual no componente mais crítico da plataforma (`BoardExperienceShell`), mantendo o princípio de Fail-Closed estritamente funcional.

### Ações Realizadas
1. **Remoção de Lógica do JSX (Dumb Renderer):**
   - O `sanitizeExecutivePayload` foi extraído de dentro do mapeamento da View (`BoardExperienceShell.tsx`).
   - A dependência foi movida para o `useBoardExperienceShellViewModel`, onde agora popula a propriedade `computed.safeViolations`.
2. **Manutenção Intencional de Exceção Arquitetural:**
   - O `BoardModeGuard.assertSafeRendering` foi mantido **exatamente** na raiz do componente React.
   - Isso garante que a verificação de Fail-Closed ocorra de forma síncrona no Event Loop principal de renderização, evitando a exposição por *flash of unauthenticated content*.

## 2. Validation Gates
- `[x]` O ViewModel agora gerencia a extração segura de dados via propriedades pré-computadas.
- `[x]` A interface `BoardExperienceShell` não importa mais `sanitizeExecutivePayload`.
- `[x]` Nenhuma engine matemática fiduciária sofreu alteração.
- `[x]` Nenhuma rota ou comportamento de navegação alterado.
- `[x]` Testes executados (Verde) e Tipo Estático mantido intacto.

A arquitetura Visual Executiva (`pages`, `governance`, `executive`) agora está consideravelmente mais apartada das dependências subjacentes, respeitando a canonização da interface e fechando o ciclo imediato de Discovery Boundary (Batch 4).
