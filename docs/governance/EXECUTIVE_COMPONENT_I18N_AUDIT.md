# Executive Component I18N Audit

Mapeamento da governança de internacionalização da camada de Design System Executivo (Wave 2B.3B).

## Componentes Analisados

| Componente | Responsabilidade | Migrar para i18n | Observação |
| --- | --- | --- | --- |
| `ExecutiveMetricCard` | KPI executivo | Sim | Não traduzir valores raw (ex: `12.5%`, `R$ 1M`). Usar `useExecutiveFormatter()`. |
| `ExecutiveStrategicSemanticCards` | Insights estratégicos | Sim | Traduzir labels (Impacto, Risco, Próxima Ação), proteger o conteúdo preditivo gerado (Risk Score: 87). |
| `ExecutiveTypography` | Labels semânticos | Sim | |
| `ExecutiveDataTable` | Cabeçalhos/estados | Sim | Colunas traduzidas, dados das linhas formatados, não traduzidos se forem operacionais. |
| `ExecutiveEmptyState` | Estados vazios | Sim | |
| `ExecutiveLoadingState` | Loading | Sim | |
| `ExecutiveErrorState` | Erros | Sim | |
| `ExecutiveBadge` | Status | Sim | |
| `ExecutiveTooltip` | Ajuda contextual | Sim | |

## Regra de Fronteira

- **Permitido:** Textos descritivos, Títulos, Subtítulos, Labels de colunas, Nomes de botões.
- **Proibido:** KPIs formatados sem formatação `useExecutiveFormatter`, moedas hardcoded, unidades numéricas, nomes próprios.
