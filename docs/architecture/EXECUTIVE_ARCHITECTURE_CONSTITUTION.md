# Executive Architecture Constitution (EAC)

## 1. Princípios Fundamentais
A plataforma transcendeu a **Executive Visual Constitution (EVC)**, que determinava *como* os componentes pareciam (tipografia, superfícies, cores, métricas). A **Executive Architecture Constitution (EAC)** foi estabelecida para determinar *onde* e *em que ordem* a informação deve ser apresentada ao usuário executivo, guiando o fluxo cognitivo e garantindo que a tomada de decisão seja suportada de forma hierárquica e racional.

O EAC assegura que nenhuma página seja tratada como um aglomerado livre de componentes. Toda interface executiva obedece a um arquétipo estrutural rigoroso (Executive Analytical, Governance, Operational, Admin, ou Board Mode).

## 2. Diferenciação: EVC vs. EAC
- **EVC (Visual):** Certifica se um número usa a fonte correta (`ExecutiveMetric`), se o fundo de um cartão obedece às regras de contraste (`ExecutiveSurface`), e se um botão possui a intenção semântica aprovada (`ExecutiveAction`).
- **EAC (Arquitetural):** Certifica se o contexto (ano, cliente) e os status fiduciários estão sendo declarados ANTES dos KPIs, se as ações primárias não estão misturadas com *badges* informativos, e se a camada técnica (auditoria, rastreabilidade) está posicionada no encerramento do fluxo cognitivo, preservando a carga atencional do executivo.

## 3. Fluxo Cognitivo Executivo
Embora existam perfis arquiteturais distintos (veja `EXECUTIVE_PAGE_ARCHETYPES.md`), a espinha dorsal de qualquer experiência executiva segue a taxonomia:
1. **Identidade e Posicionamento (Page Identity):** "Onde estou e sobre o que é isso?"
2. **Contexto e Ação:** "Qual é o estado atual dos dados (ano, cliente) e o que posso fazer agora?"
3. **Síntese (Summary):** O veredito imediato ("Bom, Ruim, Atenção").
4. **Evidências Primárias (KPIs):** A comprovação numérica do veredito.
5. **Aprofundamento (Narrative & Analytics):** A análise detalhada, desvios e distribuições visuais.
6. **Governança e Sustentação (Technical Layer):** O rastro de decisão da IA, memória de cálculo e premissas (recolhidas por padrão).

## 4. O papel do Scanner Estrutural
Para garantir a aderência arquitetural contínua, o projeto emprega o **Executive Architecture Scanner**. Ele opera examinando a AST (Abstract Syntax Tree) das páginas para extrair a taxonomia real renderizada, avaliando componentes importados, JSX condicional e a hierarquia final. Se uma página tentar posicionar um bloco Técnico antes do Resumo Executivo, o *Cognitive Compliance Score* será severamente penalizado.
