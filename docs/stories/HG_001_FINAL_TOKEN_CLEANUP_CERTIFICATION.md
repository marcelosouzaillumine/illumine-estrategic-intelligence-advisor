# HG-001 Final Token Cleanup — Certification

## Resumo da Epic
Esta certificação atesta a conclusão e encerramento da Epic `HG-001 Final Token Cleanup`.
A missão consistia em erradicar dívidas visuais de Design Token Sovereignty (uso hardcoded de cores em `#HEX` e `style` inlines) distribuídas pelo repositório.

## Conformidade Atingida
A limpeza obedeceu a um rigoroso isolamento e respeitou limites de refatoração para garantir risco zero no Runtime da aplicação e a ausência de redesigns indesejados.

1. **React UI Components (TSX): 0 violações**
   As ocorrências mapeadas pelo gate `design-token-sovereignty.test.ts` foram totalmente substituídas por tokens semânticos e propriedades derivadas (`var(--color-...)` ou utilitários CSS do Tailwind). A trava rigorosa (`assert.strictEqual`) no teste foi reabilitada para assegurar que não haja regressão.

2. **Registry e Utilitários (`utils.ts`, `executive-chart-series-registry.ts`)**
   Os diretórios `src/lib/` e partes puras de interface gráfica foram migrados para ler os tokens semânticos registrados, erradicando os últimos HEXs que se passavam por lógicas abstratas.

## Exceções Documentadas (HEX Permitido)
As seguintes frentes ganharam salvaguarda oficial para uso de valores HEX sob o princípio da infraestrutura de baixo nível, dado o bloqueio arquitetural que os impede de consumir o CSS nativo em tempo de execução:

- **Fonte de Verdade (`src/index.css`)**: Continua sendo o manifesto global que alimenta as abstrações semânticas. O uso de `#HEX` é obrigatório.
- **Motores de Exportação/PDF (`src/components/pdf/*`, `src/core/export/*`)**:
  Devido às limitações impostas pelos renderizadores abstratos (ex: `@react-pdf/renderer` ou geradores nativos), constantes em HEX são liberadas especificamente na montagem técnica dos templates de relatórios, não constituindo quebra da Soberania Visual da Aplicação Web.

## Situação Final
Epic concluída e chancelada. O sistema atingiu a maturidade visual esperada para seu core base (Architecture Freeze).
