# Protocolo de Calibração de Inteligência Institucional

Este protocolo define a especificação técnica e as políticas de governança para a calibração de pesos, thresholds e sensibilidades no Runtime da plataforma Illumine.

## 1. Princípios de Governança

1. **balanced como Baseline Congelado**:
   O perfil `balanced` representa exatamente o comportamento matemático e fiduciário homologado na versão RC-1. Nenhuma alteração pode ser feita diretamente neste perfil sem versionamento formal.
2. **Não-Alteração de Estrutura**:
   A calibração atua regulando parâmetros, pesos e tolerâncias. É terminantemente proibido reescrever ou alternar fórmulas matemáticas, motores de orquestração ou fluxos de linhagem de dados (lineage).
3. **Isolamento de Produção**:
   As simulações de calibração no playground operam estritamente sob sandbox utilizando dados e ciclos isolados de testes, nunca alterando bancos de dados de produção ou a visualização padrão do cliente final.
4. **Garantia Fiduciária de Falhas Críticas**:
   Alertas críticos que indiquem inconsistência material na contabilidade ou quebra de premissas financeiras básicas são classificados como `NON_SUPPRESSIBLE_WARNINGS` e nunca podem ser omitidos.

## 2. Parâmetros Regulados

A calibração do Runtime atua sobre as seguintes variáveis:

- `confidenceCollapseThreshold`: Percentual abaixo do qual a confiança entra em colapso (Padrão: 0.45).
- `confidenceDegradedThreshold`: Percentual abaixo do qual a confiança é considerada degradada (Padrão: 0.65).
- `stressPropagationSensitivity`: Coeficiente multiplicador aplicado à severidade e probabilidade de contágio de insolvência intercompany (Padrão: 1.0).
- `temporalCausalitySensitivity`: Fator de sensibilidade temporal para deteção de deterioração e melhoria (Padrão: 1.0).
- `warningMaterialityThreshold`: Diferença percentual máxima tolerável em conciliações contábeis (Padrão: 0.05).
- `scenarioVolatilityWeighting`: Multiplicador de estresse de volatilidade para projeções de fluxo de caixa (Padrão: 1.0).
- `advisoryVerbosity`: Grau de detalhamento das narrativas de aconselhamento executivo (`low` | `medium` | `high`).
- `degradedModeThresholdMs`: Limite de latência para ativação de avisos de lentidão do runtime (Padrão: 500ms).
- `advisoryAggressiveness`: Fator multiplicador de sugestões agressivas de mitigação e redução de custos (Padrão: 1.0).
- `suppressedWarnings`: Array de strings contendo avisos que podem ser ocultados se não forem classificados como críticos.

## 3. NON_SUPPRESSIBLE_WARNINGS (Alertas Críticos Não Supressíveis)

Os seguintes alertas contábeis/fiduciários são considerados críticos e **nunca** serão suprimidos, independentemente do perfil de calibração ou configuração ativa:

- `INVALID_BALANCE_SHEET` (Ativo diferente de Passivo + PL fora da tolerância extrema)
- `SIGN_INVERSION` (Despesas/CMV com sinais incoerentes)
- `CASHFLOW_MISMATCH` (Diferença na reconciliação de caixa da DFC)
- `HIERARCHY_BREAK` (Quebra de totalizadores no DRE/BP)
- `INCOMPLETE_DATASET` (Falta de peças contábeis mandatórias em datasets financeiros)

## 4. Estrutura de Perfis Disponíveis

- **conservative**: Rigor matemático máximo. Penaliza de forma severa desvios, amplia a volatilidade simulada de cenários e apresenta recomendações focadas estritamente em segurança e preservação de capital.
- **balanced**: Baseline padrão homologada em RC-1.
- **aggressive**: Maior tolerância a pequenas inconsistências, reduz penalidades e sugere recomendações audaciosas de crescimento e alavancagem.
- **board_mode**: Resumos executivos de baixa verbosidade, focados em indicadores agregados. Oculta avisos contábeis de menor relevância operacional para focar a tomada de decisão do conselho.
- **advisor_mode**: Alta sensibilidade temporal e analítica, gerando playbooks densos e detalhados.

## 5. Auditoria de Alteração (CalibrationProfileVersion)

Toda transição ou ajuste individual de calibração gera uma entrada imutável contendo:

```typescript
export interface CalibrationProfileVersion {
  profileId: string;        // Id do perfil (ex: balanced)
  version: string;          // Formato vX.Y.Z
  createdAt: string;        // ISO Timestamp
  actorId: string;          // Operador que realizou a mudança
  rationale: string;        // Justificativa da calibração
  diff: {                   // Dicionário com os parâmetros alterados
    parameter: string;
    before: any;
    after: any;
  }[];
  previousVersion?: string; // Hash ou versão anterior
}
```
