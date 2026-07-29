# Executive Page Identity Contract

A identidade de uma página executiva não é apenas o seu "Header". Ela compõe o portal de entrada cognitivo e define como o usuário se localiza e manipula o escopo temporal/analítico.

## Taxonomia Oficial do Page Identity

```text
Page Identity
├── Title
├── Subtitle
├── Context Badges
├── Status Badges
├── Filters
├── Selectors
├── Primary Actions
├── Secondary Actions
└── Utility Actions
```

## Separação Semântica Estrita

O EAC determina que cada slot no Page Identity possui uma vocação única que não pode ser misturada ou canibalizada.

- **Action:** Um comando que altera o estado do sistema (Lançar Dados, Importar, Salvar). Não pode parecer um selo. (Implementação base: `ExecutiveAction`).
- **Badge:** Uma informação passiva ou marcador de diagnóstico. Não executa ação. (Implementação base: `ExecutiveBadge`).
- **Filter:** Um recorte de dados sobre o contexto atual (Ex: Filtro de Ano). Ele muda a visualização, mas mantém o contexto.
- **Selector:** Uma alteração profunda de contexto (Ex: Trocar de Cliente). Transita a aplicação para outra dimensão fiduciária.
- **Status:** A condição sistêmica ou qualitativa atual (Ex: "Ativo", "Aguardando Fechamento", "FAIL-CLOSED").
- **Toolbar:** O *container* composicional que abriga Ações.

## Regras Arquiteturais
1. **Não misturar Ações e Badges:** Botões de ação não podem ser renderizados como *badges* clicáveis. Badges não podem emitir eventos de mutação principal.
2. **Posição:** O título e subtítulo vêm primeiro. Status e Badges de Contexto formam a segunda linha de entendimento. Filtros/Seletores preparam o terreno, e a Toolbar de Ações sela o bloco superior, orientando a mutação.
