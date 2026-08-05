# Formatter Authority Certification
**Status**: CERTIFIED ✅
**Data da Certificação**: 04 de Agosto de 2026
**Responsabilidade**: Formatação global de dados (`src/core/localization/formatters/**`)

## 1. Princípio da Autoridade Única
A partir da Wave 2B.5, fica instituído que `useExecutiveFormatter()` é a ÚNICA fonte de verdade para a representação em texto de:
- Moedas (Financial)
- Percentuais
- Datas e Horários
- Multiplicadores (Ex: `x4.5`)
- Scores Executivos

## 2. Contratos Definidos e Assegurados

### 2.1 CurrencyFormatter
- Responsável por interpretar a moeda do tenant ativo ou fallback definido.
- Não há formatação hardcoded de `R$` ou `$`.
- Formata adequadamente decimais com base no idioma do usuário.

### 2.2 PercentageFormatter
- Mantém integridade de percentuais, evitando cálculos duplos na camada de UI.
- Garante representações visuais corretas para taxas e conversões.

### 2.3 DateFormatter & TimeFormatter
- Totalmente dissociado do locale do browser (via remoção do `toLocaleDateString` na UI).
- Respeita o contrato de Timezone estabelecido pela hierarquia: `User Preference -> Tenant Preference -> Browser Default`.

### 2.4 ScoreFormatter
- Contrato validado e certificado: **Agnóstico Visual**.
- A saída é estritamente numérica e limpa (Ex: `87`).
- A inserção de contexto (Ex: `%`, `/ 100`, "Score:") é de total responsabilidade do componente visual (UI Component).

## 3. Conformidade
Nenhuma camada fora do `localization` ou `formatters` possui autonomia para formatar valores brutos. O desvio desta regra é considerado **Regressão Crítica** (Severity 1).

*Assinatura de Sistema (AIOX / Codex CLI)*
