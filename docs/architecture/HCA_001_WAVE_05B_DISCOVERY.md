# HCA-001 Wave 05B Discovery — Executive Capability Reactivity Extraction II

## Objetivo
Analisar os componentes sob `src/components/executive`, `src/components/advisor`, `src/components/cognitive` e `src/components/war-room` para detectar vazamento de estado (Reactivity Drift) e acoplamento direto com Engines e Serviços, desconsiderando componentes que já adotam ViewModels (como os tratados na Wave 05A).

## Critérios de Pontuação (Drift Score)
- **Reactivity**: Soma de `useState`, `useEffect`, `useMemo`, `useCallback`.
- **Coupling**: Invocação de Engines, Services, Registries e lógicas de navegação.
- Componentes com maior score representam maior desvio do padrão *Dumb Renderer*.

## Relatório de Entropia (Maiores Ofensores)

| Componente | Reactivity | Coupling | Drift Score | Status |
| :--- | :---: | :---: | :---: | :--- |
| `AdvisorWorkspaceShell.tsx` | 7 | 12 | **19** | Ofensor Crítico |
| `WarRoomWorkspace.tsx` | 9 | 6 | **15** | Ofensor Crítico |
| `BoardExperienceShell.tsx` | 3 | 6 | **9** | Ofensor Moderado |
| `ScenarioCommandCenter.tsx` | 2 | 6 | **8** | Ofensor Moderado |
| `WorkspaceHubNavigation.tsx` | 1 | 6 | **7** | Ofensor Moderado |

## Conclusão e Escopo Sugerido para Wave 05B
Para garantir uma adoção progressiva e consolidar o padrão arquitetural (ViewModel orquestrando sem acoplamento direto de navegação, roteando intenções via Application Services), sugerimos selecionar o **Top 3** para a Wave 05B:

1. `AdvisorWorkspaceShell.tsx`
2. `WarRoomWorkspace.tsx`
3. `BoardExperienceShell.tsx`

Eles concentram os maiores níveis combinados de Hooks de estado e acoplamento de infraestrutura de toda a superfície analisada.
