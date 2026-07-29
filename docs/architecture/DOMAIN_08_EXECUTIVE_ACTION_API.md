# Domain 08: Executive Action API Contract

**Componente:** `ExecutiveAction`
**Import:** `import { ExecutiveAction } from '@/components/ui/executive-action'`

## Contrato de Variants e Tamanhos (Constitution Engine)

O componente estende nativamente os atributos base do `button` do React.

### Propriedades Fiduciárias

| Propriedade | Tipo | Obrigatório | Descrição |
| ----------- | ---- | ----------- | --------- |
| `variant` | `'primary' | 'success' | 'secondary' | 'subtle' | 'ghost' | 'destructive' | 'toolbar'` | Não (Default: `'primary'`) | Determina a hierarquia visual (primary) ou o tom/intenção específica (success/destructive) sem causar sobreposições semânticas. |
| `size` | `'sm' | 'md' | 'lg' | 'icon'` | Não (Default: `'md'`) | Dimensão do botão ditada pelo registry, incorporando radii e padding executivos. |
| `loading` | `boolean` | Não | Aciona estado seguro (força disabled) e converte ícone left/center para spinner. |
| `loadingLabel` | `string` | Não | Permite texto opcional ao carregar (Ex: "Salvando..."). |
| `iconLeft` | `ReactNode` | Não | Ícone injetado antes do texto. Desaparece durante o loading. |
| `iconRight` | `ReactNode` | Não | Ícone após o texto. Mantido durante loading, exceto em iconOnly. |
| `iconOnly` | `boolean` | Não | Flag estrita: se for `true`, o TypeScript exigirá obrigatoriamente a prop `aria-label`. |
| `aria-label` | `string` | **Sim, se `iconOnly`** | Garantia de acessibilidade para ações fantasmas / utilitárias. |
| `asChild` | `boolean` | Não | Delega a renderização e classes para o componente filho (ex: `<Link>`). |

## Restrições e Padrões de Uso
1. **Ações Primárias:** Sempre use `variant="primary"` para CTA. O `success` é reservado apenas para eventos estritamente positivos isolados.
2. **Context Badges não são botões:** Nunca substitua um `ExecutiveBadge` passivo por um `ExecutiveAction` desativado apenas pela aparência visual.
3. **Typography na Raiz:** Você não precisa (e não deve) envelopar o conteúdo interno com `<ExecutiveText>`. O próprio Action injeta a fonte.
4. **Toolbars Financeiras:** Para headers de tabelas (ex: BalanceSheet), use `variant="toolbar"` ou variações flat como `subtle`.

## Exemplos
```tsx
// 1. Submit com loading state
<ExecutiveAction variant="primary" size="lg" loading={isSubmitting} loadingLabel="Concluindo...">
  Avançar Etapa
</ExecutiveAction>

// 2. Ação Icon-Only segura
<ExecutiveAction variant="ghost" size="icon" iconOnly={true} aria-label="Fechar diálogo">
  <X size={16} />
</ExecutiveAction>

// 3. Ação Destrutiva Secundária
<ExecutiveAction variant="destructive" iconLeft={<Trash2 size={16} />} onClick={handleDelete}>
  Remover Exercício
</ExecutiveAction>

// 4. Link estilizado como botão (asChild)
<ExecutiveAction asChild variant="subtle" size="sm">
  <Link href="/bp">Voltar ao Balanço</Link>
</ExecutiveAction>
```
