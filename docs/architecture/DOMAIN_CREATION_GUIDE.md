# How to Create a New Executive Domain

Este guia extremamente prático orienta o passo-a-passo para adicionar um novo domínio à Illumine sem causar dívida arquitetural, explorando a infraestrutura de plugins criada na Fase B.

### Passo 1: Criar a Estrutura de Pasta
Crie um novo diretório dentro de `src/intelligence/diagnostics/` com o nome do domínio.
Exemplo: `src/intelligence/diagnostics/operational/`

Nesta pasta, crie **exatamente** 5 arquivos centrais:
- `operational-model.v1.ts`: Define a tipagem do perfil final, os attention points específicos e a string canônica do domínio.
- `operational-questions.v1.ts`: O catálogo de questões, opções, pesos e mappings das dimensões organizacionais.
- `operational-evaluator.ts`: A classe que herda a responsabilidade de interpretar as respostas e compilar as pontuações e matrizes deste domínio.
- `operational-profile.ts`: Tipagem estrita de resposta do Evaluator.
- `operational-diagnostic.ts`: A classe abstrata final herdando de `ExecutiveDiagnostic` para servir a jornada ao motor principal.

### Passo 2: Atualizar os Tipos Globais
No arquivo `src/intelligence/diagnostics/core/diagnostic-types.ts`, adicione o seu novo tipo à `DiagnosticDomain`.
```typescript
export type DiagnosticDomain =
  | "financial"
  // ... outros domínios
  | "operational"; // <- Adicionado aqui
```

### Passo 3: Registrar o Domínio no Catálogo
Abra `src/intelligence/diagnostics/core/domain-registry.ts` e declare a existência do domínio em `registerCoreDomains()`.
```typescript
    this.register({
      domain: 'operational',
      name: 'Operational Intelligence™',
      isCoreFoundation: false,
      supportedEngines: ['Diagnostic']
    });
```

### Passo 4: Registrar a Jornada Diagnóstica
Abra `src/intelligence/diagnostics/catalog/register-diagnostics.ts` e exporte a classe para o Concierge.
```typescript
import { OperationalDiagnosticJourney } from '../operational/operational-diagnostic';

// ...

export function bootstrapDiagnostics() {
  // ...
  DiagnosticRegistry.registerDiagnostic(new OperationalDiagnosticJourney().descriptor);
}
```

### Passo 5: Atualizar o Executive Domain Graph™
Vá em `src/intelligence/progression/executive-domain-graph.ts` e configure como esse domínio se conecta estrategicamente ao resto da organização. Adicione as influências dele e adicione quem o influencia.
```typescript
    this.addEdge('financial', 'operational', 0.8, 'Com disciplina financeira, o foco muda para eficiência.');
    this.addEdge('operational', 'commercial', 0.9, 'A escala desbloqueia agressividade comercial.');
```

### Fim.
Seu novo domínio está ativo, será renderizado na cor "Future" no Architecture Map, orquestrado pela Narrativa se executado, e calculará pontos no Executive Intelligence Index automaticamente. Não toque no Core.
