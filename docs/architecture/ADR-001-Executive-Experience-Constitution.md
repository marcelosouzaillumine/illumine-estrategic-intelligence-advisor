# Architecture Decision Record: Executive Experience Constitution
**Date:** 2026-08-06
**Status:** Accepted

## Context
A arquitetura do CFO Office, inicialmente desenhada em torno do Balanço Patrimonial, evoluiu organicamente até um ponto onde o `FinancialPositionProduct` tornou-se acoplado aos mecanismos de renderização e registro (Registry/Runtime). Esse acoplamento causou efeitos colaterais severos: a quebra de um componente React interno derrubava o produto inteiro, e o produto passou a ditar as regras da arquitetura, e não o contrário.
Com a expansão da plataforma Illumine para novos escritórios (CEO, COO, Governance, etc) e novos produtos (DRE, Fluxo de Caixa), a arquitetura fundacional deve ser rigorosamente desacoplada de implementações específicas.

## Decision
Para prevenir o colapso estrutural, adotamos a **Executive Experience Constitution**, um núcleo de arquitetura 100% genérico que dita as fronteiras e responsabilidades do front-end. O fluxo oficial de renderização passa a ser rigorosamente uniderecional:
`Product → Experience Manifest → Registry → Runtime (Guards) → React (Root)`

### 1. Responsabilidades Definidas
- **Executive Product (`ExecutiveProductDefinition`)**:
  Define *o que* está sendo entregue (metadata, capabilities, office, permissões) e a configuração da experiência, mas NUNCA a implementação. Um Product NÃO pode referenciar arquivos React ou nomes de componentes internos (ex: `BalanceSheetLiquiditySection`).
  
- **Experience (`ExecutiveExperienceDefinition`)**:
  A declaração da jornada do usuário em Layers (Camadas). Uma Layer dita *o que* o usuário viverá (ex: "Diagnóstico"), determinando um `rootComponentId`, mas ignorando como ele é renderizado. As Layers podem variar em quantidade por produto.

- **Experience Manifest**:
  Um artefato intermediário compilado. O Runtime converte o Product em um Manifest resolvido, validando a integridade das Layers contra o Registry antes de tentar qualquer renderização.

- **Registry (`ExperienceComponentRegistry`)**:
  O único ponto que conhece o React. Ele mapeia IDs (ex: `FinancialDiagnosisRoot`) para *fábricas* (funções que retornam componentes), e nunca para a instância do componente diretamente.

- **Runtime (`ExecutiveProductRenderer`)**:
  O motor de execução. Ele não conhece nenhum produto específico. Sua responsabilidade primária é aplicar os **Runtime Guards** (Structural e Semantic) para impedir que produtos defeituosos (ex: com layers vazias ou ordens invertidas) sujem o DOM, falhando imediatamente com um erro claro.

- **Root Component**:
  O ponto de entrada de uma Layer. Um Root atua como um repassador cego de dados (ViewModels puros) para componentes granulares estúpidos (Grids, Cards, Tables). O Root NÃO contém regras de negócio.

### 2. O Que Nunca Poderá Acontecer
1. **O Product não pode conhecer a árvore React**: Um `ExecutiveProductDefinition` jamais registrará componentes específicos (como `BalanceSheetLiquiditySection`).
2. **O Registry não registra instâncias diretamente**: Ele registra funções fábrica (`factory`) para isolar acoplamento de imports.
3. **O Runtime não renderiza sem checar a Constituição**: A renderização é sempre precedida pelos `StructuralGuards` e `SemanticGuards`.
4. **O Validador não possui vieses de produto**: O `ExecutiveExperienceValidator` é agnóstico. Nenhuma menção a "Financial" ou "CFO" deve existir dentro do pacote de constituição.

## Consequences
- **Positive:** O Balanço Patrimonial deixa de ser o mestre do sistema e vira apenas a primeira implementação da Constituição. Produtos futuros (DRE, KPIs) nascerão compatíveis e protegidos pelo mesmo Runtime e Registry.
- **Negative:** Maior verbosidade para instanciar novos produtos devido à necessidade de respeitar as barreiras estritas (Product -> Manifest -> Root -> Grid), mas o trade-off pela segurança arquitetural é altamente justificado.
