# Wave 18B.2 — Executive Proposal Builder™ Architecture

## 1. Propósito
O **Executive Proposal Builder™** atua como um *Proposal Composition Engine*. Seu objetivo não é ser um simples editor de texto livre, mas um orquestrador modular que permite ao Revenue Manager, Advisor ou Partner compor propostas executivas consistentes, personalizadas e rastreáveis, alimentadas pela inteligência da Illumine.

## 2. Proposal Creation Flow
A jornada interna de construção da proposta obedece o pipeline:
`Opportunity ➔ Create Proposal ➔ Select Template ➔ Configure Context ➔ Generate Draft ➔ Customize Sections ➔ Attach Pricing Snapshot ➔ Submit For Review`

## 3. Estrutura do Workspace (ProposalBuilderWorkspace)
O motor de composição divide a tela nos seguintes contextos:
- **Context Panel**: Dados do cliente (Account/Opportunity), Locale e metadados globais.
- **Proposal Structure**: Navegação lateral para reordenar, adicionar ou remover seções (Drag & Drop modular).
- **Content Editor**: A interface principal de edição atrelada ao tipo de seção selecionada.
- **Pricing Configuration**: Painel de injeção e manipulação do *Pricing Snapshot* conectado à Engine.
- **Implementation Timeline**: Construtor de milestones executivos.
- **Preview & Submit**: O simulador visual (`Desktop`, `Tablet`, `Mobile`) e envio para `Internal Review`.

## 4. O Sistema de Templates Institucionais
As propostas não nascem do zero. Elas herdam de *Proposal Templates*:
- **Executive Intelligence Platform™ (Template Enterprise)**
- **Governance Intelligence Diagnostic™ (Template Assessment)**
- **Executive Advisory™ (Template Consulting)**
- **Partner Proposal (Template Channel)**

*O fluxo garante*: `Template ➔ Proposal Instance ➔ Version`.

## 5. Section Builder Modular
A renderização do conteúdo baseia-se em um padrão *Block/Section*. A `Proposal Section` tipada suporta:
- `HERO`
- `EXECUTIVE_CONTEXT`
- `CHALLENGE`
- `OPPORTUNITY`
- `SOLUTION`
- `CAPABILITY_MAP`
- `IMPLEMENTATION`
- `INVESTMENT`
- `TERMS`
- `ACCEPTANCE`

## 6. Integração com Executive Intelligence (O Diferencial)
O builder pode (e deve) consumir inteligência prévia gerada pela plataforma. 
Exemplo: Um `Governance Assessment` concluído em uma `Opportunity` anterior poderá popular automaticamente as seções `CHALLENGE` e `OPPORTUNITY` em formato de `Executive Evidence Grid`.

## 7. i18n Nativo
No ato da criação, o *Proposal Locale* (`pt-BR`, `en-US`, `es-ES`) é fixado. O Builder injeta imediatamente os JSONs correspondentes do idioma escolhido para orientar a composição, garantindo que propostas geradas em inglês tragam blocos padrão já traduzidos.

## 8. Entregáveis Técnicos Previstos
O pacote de Front-end ficará restrito em `src/components/revenue/proposal-builder/`:
- `ProposalBuilderWorkspace.tsx`
- `ProposalSectionEditor.tsx`
- `ProposalTemplateSelector.tsx`
- `ProposalPricingPanel.tsx`
- `ProposalTimelineEditor.tsx`
- `ProposalPreview.tsx`
