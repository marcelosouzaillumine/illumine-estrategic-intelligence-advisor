# ExecutiveSummarySection API

O `ExecutiveSummarySection` é o primeiro wrapper arquitetural criado no modelo EAC (Executive Architecture Constitution). Ele é estritamente neutro e atua como demarcador cognitivo.

## Contrato Mínimo Inicial

```tsx
interface ExecutiveSummarySectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  'aria-label'?: string;
}
```

## Como Usar

O componente delega o layout visual e os dados aos `children`, servindo unicamente para registrar o bloco no Scanner V2 e padronizar o contorno semântico HTML (`<section data-eac-block="executive-summary">`).

```tsx
import { ExecutiveSummarySection } from '../executive-architecture';

<ExecutiveSummarySection aria-label="Síntese Executiva DLPA">
  <ExistingDLPASynthesis />
</ExecutiveSummarySection>
```

## O Que Foi Mantido de Fora (Intencionalmente)
Seguindo as diretrizes de abstração limpa do EAC, as seguintes características foram delegadas ou evitadas:
- **Ausência de Estilos Impositivos:** Sem backgrounds, sombras ou bordas embutidas. A neutralidade visual protege o componente em contextos de dashboard ou modais.
- **Campos Opcionais (`title`, `description`):** Serão acrescentados futuramente apenas se a auditoria em múltiplas páginas confirmar a necessidade de forçar a tipografia do cabeçalho de forma unificada.
- **Variantes de Intenção (`status`, `actions`, `score`):** Delegados aos cartões internos (Ex: `ExecutiveMetricCard`), mantendo o *Summary* puro.
- **Dependência de Lógica ou Contexto:** Não realiza chamadas Firebase e não consome hooks de estado, provendo isolamento real.
