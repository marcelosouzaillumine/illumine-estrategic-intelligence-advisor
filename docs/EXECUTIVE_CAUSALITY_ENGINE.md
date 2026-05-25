# EXECUTIVE CAUSALITY ENGINE

## 1. Princípio da Precedência Institucional
A **Executive Causality Engine** é a camada mandatória e fonte única da verdade para qualquer interpretação econômica, síntese de board ou narrativa de risco dentro da plataforma Illumine. Nenhuma métrica isolada tem valor sem passar pela avaliação de causalidade deste motor.
Estão estritamente proibidos em todo o ecossistema:
- Placeholders genéricos (ex: "Neutra", "Pendente").
- Frases de fallback que não possuam racionalidade econômica.
- "N/A" para interpretações em balanços consolidados.

## 2. A Cadeia de Inteligência Narrativa
Toda narrativa institucional e diagnóstico consultivo deve seguir incondicionalmente a taxonomia de **Triangulação Causal**:

1. **CAUSA**: A origem matemática e estrutural da fricção ou alavanca. *(Ex: "Acúmulo crônico de capital de giro retido em recebíveis longos.")*
2. **PRESSÃO**: Como essa causa asfixia ou acelera a operação atual. *(Ex: "Pressionando a linha d'água da tesouraria no curto prazo e exigindo dependência sistêmica de desconto bancário.")*
3. **CONSEQUÊNCIA**: O que ocorre com a resiliência e patrimônio caso a pressão continue. *(Ex: "Essa dinâmica destrói o valor do EBITDA, corroendo a autonomia financeira da companhia e gerando vulnerabilidade a choques de crédito.")*
4. **DECISÃO (Ação/Advisory)**: A diretriz do conselho executivo para neutralizar a causa. *(Ex: "Redesenhar política de concessão de crédito, alinhar prazos operacionais com fornecedores e reter caixa imediato.")*

Toda narrativa executiva deve seguir obrigatoriamente a cadeia:
**CAUSA → PRESSÃO → CONSEQUÊNCIA → DECISÃO**.

Fica estritamente proibido o uso de:
- N/A;
- “base alinhada”;
- “monitoramento passivo”;
- “baixa sensibilidade” sem explicação;
- placeholders;
- frases genéricas sem causalidade econômica.

## 3. Direcionadores de Inferência Obrigatórios
A plataforma agora é um **Advisor Institucional** e infere as seguintes estruturas baseadas em arquitetura de dados (sem intervenção neutra do usuário):

- **Tensões & Vulnerabilidades**: Detecção de descompasso entre EBITDA gerado e caixa retido. Imobilização excessiva (ativos permanentes altos) sugando fluxo livre de caixa.
- **Elasticidade Financeira**: Capacidade do CGL (Capital de Giro Líquido) de cobrir a NCG (Necessidade de Capital de Giro). Quando a elasticidade é alta, a operação é autofinanciada. Quando nula, é estruturalmente frágil.
- **Pressão de Liquidez**: Avaliação da capacidade de a Tesouraria suportar choques de 30, 60 e 90 dias sem recorrer a dívidas onerosas (DSCR simulado).
- **Dependência Operacional**: Se o Patrimônio Líquido sustenta as obrigações ou se a empresa "trabalha apenas para o banco".

## 4. O Fim das Mensagens Estáticas
O sistema extrai dinamicamente a arquitetura de capital (via `business-inference-engine`) e sobrepõe no motor de causalidade. 
Exemplo prático de evolução:
- **Antes**: *"Sua empresa tem risco de liquidez. O passivo circulante é maior que o ativo."*
- **Agora (Causality Engine)**: *"A estrutura encontra-se sob estresse severo de liquidez (Pressão), originado pela inadequação no ciclo de conversão de caixa (Causa). O passivo oneroso excessivo corrói a base de capital (Consequência). Ações táticas de desalavancagem e liquidação de ativos marginais são requeridas (Decisão)."*

## 5. Racionalidade Econômica
Qualquer diagnóstico, alerta ou recomendação só pode ser emitido se for **compatível** com o estágio de maturidade e o modelo de negócio inferido. 
- Recomendação de expansão acelerada para empresa asfixiada em caixa é falha sistêmica. A Engine proíbe essa narrativa.
- Alavancagem operacional (Asset Heavy) sem margem de geração robusta exige intervenção de sobrevivência, não recomendações de novos ativos.

## 6. Governança e Consumo
Os módulos `advisory-engine`, `score-engine` e todas as interfaces de renderização (`BalanceSheetPage`, `Executive Summary`) assinam contrato com esta Engine. Eles invocam `evaluateExecutiveCausality()` e renderizam as peças narrativas, substituindo completamente Mocks Narrativos e Mapeamentos Literais Fixos.
