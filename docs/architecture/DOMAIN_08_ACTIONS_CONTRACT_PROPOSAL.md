# Domain 08: Actions - Contract Proposal (Revisão Corretiva)

**Programa:** Executive Constitution Engine
**Data da Proposta:** Julho de 2026
**Responsável:** Aiox

## 1. Decisão Arquitetural Recomendada: Opção B (Wrapper Constitucional)

A **Opção B (Criar ExecutiveAction envelopando Button)** mantém-se como a hipótese preferencial. O `Button` de UI (Shadcn) absorve a complexidade técnica, enquanto o `ExecutiveAction` padroniza a sintaxe corporativa.

### Refinamento da Tipografia e "asChild"
Uma das objeções anteriores foi a dificuldade de compor `<ExecutiveText>` ao redor dos filhos caso o componente usasse `asChild`. 
**Solução Técnica Adotada:** 
O `ExecutiveAction` **não** encapsulará cegamente os `children` com `ExecutiveText`. A tipografia constitucional será garantida de forma declarativa na **raiz** do componente (via classes de utility do Tailwind mapeadas no *ExecutiveTypographyRegistry*), propagando-se fluidamente para os filhos, a menos que sobrecrita. Isso preserva o uso do `<Slot>` e do `asChild` para navegação (`<Link>`), além de permitir ícones misturados perfeitamente sem quebras de layout vertical (`<ExecutiveAction><DownloadIcon /> Exportar</ExecutiveAction>`).

### Gestão de Eventos, Loading e Disabled
O contrato do `ExecutiveAction` estenderá estritamente as `ButtonProps` do botão original, resolvendo as seguintes matrizes de estado:
- Se `loading=true`, o `disabled` nativo também será acionado, suprimindo o `onClick` para evitar duplo dispacho.
- Quando `loading`, o ícone do lado esquerdo (`iconLeft` ou o ícone atual se for `iconOnly`) será substituído por um *spinner* ou ícone de loading. O texto permanecerá intacto para manter a largura do botão previsível.
- A propriedade `aria-label` será **obrigatória** na tipagem se a variante/size adotada for explícita para `icon-only`.

## 2. Taxonomia Visual Referenciada na BP

Os estilos descobertos na `BalanceSheetPage.tsx` exigem a formalização destas variantes no `ExecutiveAction`:
- **primary / success**: Utilizado no `Lançar Dados` (Fundo `bg-success-soft`, texto `text-success`, borda e `shadow-sm`).
- **secondary / subtle**: Utilizado no `Importar` (Fundo `bg-secondary/10`, texto `text-secondary`, hover preenchido).
- **destructive**: Utilizado no `Excluir` (Fundo `bg-critical-soft`, texto `text-destructive`, border e `shadow-sm`).

**Dimensões (Sizes):**
A BP consolidou que ações no nível de toolbar e filtros não devem agigantar o cabeçalho. O tamanho padrão do Executive Action ali é **md (h-8)**, com `px-3` e `rounded-md`.

## 3. Revisão do Contrato do PageHeader
O atual `PageHeader` (`src/components/ui/page-header.tsx`) expõe apenas uma prop `actions`, sem slots semânticos. A verdadeira BP delega isso a um container externo.
Propõe-se que o novo contrato abstraia as regiões de forma controlada ou permita compor livremente desde que os seguintes "grupos" não se cruzem num único `flex` não hierárquico:

1. **Zone A (Badges de Status):** Isolados, sempre à esquerda, não clicáveis.
2. **Zone B (Filtros de Contexto):** Ex: seletor de ano `BalanceSheetYearFilter`.
3. **Zone C (Action Toolbar):** Agrupamento das ações primárias, secundárias e destrutivas (Domain 08 estrito).
