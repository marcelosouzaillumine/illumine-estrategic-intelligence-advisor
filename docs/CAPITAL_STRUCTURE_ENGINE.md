# CAPITAL STRUCTURE ENGINE

**Versão:** 1.0
**Classificação:** Arquitetura Core Institucional
**Status:** Definitivo e Vigente

---

## 1. Finalidade

Esta **Capital Structure Engine** é o documento matriz responsável por parametrizar a interpretação qualitativa da estrutura de capital e do passivo corporativo dentro da plataforma Illumine.

A finalidade desta arquitetura é **substituir definitivamente** as interpretações financeiras matemáticas simplistas baseadas apenas no volume financeiro do passivo, no percentual absoluto de endividamento ou na relação fria entre dívida e patrimônio líquido.

Fica estabelecido o princípio de que **nem todo passivo representa risco estrutural**. A plataforma deverá avaliar obrigatoriamente a composição de capital a partir dos eixos de: Qualidade, Natureza, Função Operacional, Dependência, Custo, Prazo e Resiliência.

A inteligência de *advisory* da plataforma passa a reconhecer formalmente que:
*   Existem estruturas de balanço altamente alavancadas, porém institucionalmente saudáveis e eficientes.
*   Existem estruturas de capital aparentemente leves e com pouca dívida bancária, porém estruturalmente frágeis e asfixiadas.

O objetivo é forçar a transição analítica da Illumine: **deixar de interpretar a "quantidade" de dívida, para atestar a "Qualidade Estrutural do Capital".**

---

## 2. Princípios da Estrutura de Capital

Fica expressamente **PROIBIDO** aos algoritmos e LLMs da plataforma operarem sob a premissa obsoleta e matematicamente preguiçosa de:
`MAIS DÍVIDA = MAIS RISCO`

A nova Lógica Institucional de Risco Estrutural passa a ser uma equação multifatorial:

**`TIPO DE DÍVIDA + PRAZO + CUSTO + DEPENDÊNCIA + CAPACIDADE DE PAGAMENTO + GERAÇÃO OPERACIONAL + RESILIÊNCIA = RISCO ESTRUTURAL REAL`**

O risco deixa de ser a dívida em si, e passa a ser a incapacidade de serviço da dívida (cobertura) e a toxidade do custo de captação atrelado ao prazo de maturidade.

---

## 3. Classificação Oficial dos Passivos

As *engines* devem classificar e interpretar qualitativamente cada grande rubrica de passivo conforme a taxonomia abaixo:

### Fornecedores Operacionais
*   **Natureza:** *Funding* operacional primário e natural. Dinheiro proveniente da cadeia de suprimentos (Supply Chain).
*   **Interpretação:** Geralmente **SAUDÁVEL**. Representa força de barganha, alavancagem natural de giro e eficiência do ciclo financeiro. Demonstra capacidade de reter caixa sem pagar juros bancários.
*   **Risco Latente:** Passa a ser perigoso apenas quando há concentração excessiva (dependência monopsonista), atraso recorrente crônico (forçando paralisação de entrega), e ruptura evidente da esteira produtiva.

### Dívida Bancária de Curto Prazo (CP)
*   **Natureza:** Financiamento de capital de giro transacional, desconto de recebíveis, cheque especial e garantias imediatas.
*   **Interpretação:** Alto risco de pressão e sangria de caixa se não coberta por recebíveis de curtíssimo prazo de altíssima qualidade. Gera enorme sensibilidade financeira (despesa de juros volátil).
*   **Classificação:** Varia de *Sensível* a *Pressionado* (se controlada) até *Crítico* (se houver dependência estrutural para cobrir ineficiência operacional).

### Dívida Bancária de Longo Prazo (LP)
*   **Natureza:** CAPEX, expansão de capacidade, M&A, reestruturação planejada.
*   **Interpretação:** Pode ser **SAUDÁVEL** e tática. É o capital que fomenta crescimento.
*   **Risco Latente:** Depende exclusivamente da taxa de juros real contratada (custo) *versus* o Retorno sobre o Capital Empregado (ROCE) da operação gerada.

### Passivo Tributário
*   **Natureza:** Impostos retidos não recolhidos ou discutidos.
*   **Interpretação:** **ALTO RISCO ESTRUTURAL**. Não é fonte de financiamento válida. Gera risco jurídico agressivo (penhoras), risco de continuidade (*Going Concern*), multas sufocantes e bloqueio institucional em M&A ou captação futura.

### Passivo Trabalhista
*   **Natureza:** Passivo atrelado a litígios e processos da força de trabalho.
*   **Interpretação:** Alta sensibilidade reputacional. Além do dreno direto de caixa (provisionamentos), pode inviabilizar operações que dependam de certidões negativas de débito (CNDs), especialmente no B2G (Governo).

### Conta Corrente dos Sócios (Mútuos)
*   **Natureza:** Aportes ou retiradas via pessoa física ou de *Holdings* coligadas.
*   **Interpretação:** Embora sirva como *funding* de salvamento em PMEs, é indicativo claro de **BAIXA INSTITUCIONALIZAÇÃO** e alerta grave de Governança (*Red Flag*). Demonstra confusão patrimonial, ausência de processos corporativos e dependência do CPF/CNPJ de controle. Não é unicamente negativo, mas rebaixa o *rating* de maturidade.

### Funding Estruturado (Debêntures, CRIs, CRAs, FIDCs, Private Debt)
*   **Natureza:** Capital institucional desenhado para balanços maiores.
*   **Interpretação:** Sinaliza **Maturidade Financeira** e **Sofisticação Institucional**. Indica que a empresa superou a mesa de varejo do banco e acessou mercado de capitais. O risco é moderado, balizado por *covenants* restritivos (garantias estritas).

### Leasing / FINAME / CAPEX Financiado
*   **Natureza:** Dívida atrelada e garantida por um ativo físico específico gerador de receita.
*   **Interpretação:** Traz forte dependência operacional do maquinário financiado. O impacto recai sobre a garantia de demanda (se o ativo ocioso não gerar caixa, a parcela consome o restante da operação).

---

## 4. Qualidade do Endividamento (Metodologia de Avaliação)

A *engine* passará a modular a leitura da dívida submetendo o balanço aos seguintes vetores qualitativos:

1.  **Concentração de Passivos:** A dívida está concentrada em um único credor ou banco? (Risco sistêmico e dependência específica de rolagem). Há pulverização saudável mitigando exposição?
2.  **Prazo Médio:** Curto (ruim para estabilidade, bom para taxa imediata); Moderado; Longo (excelente para resiliência de caixa).
3.  **Elasticidade Financeira:** A capacidade intrínseca do balanço de absorver choques. Se a SELIC subir 3%, ou se a receita retrair 15%, o juros da dívida estrangula a margem de contribuição?
4.  **Dependência de Refinanciamento (Rollover Risk):** O balanço necessita rolar linhas curtas ininterruptamente para não asfixiar? (Capital de giro artificial = Risco Iminente).
5.  **Qualidade da Cobertura Operacional (Debt Service Coverage Ratio):** A relação sagrada entre Geração Operacional (EBITDA / Fluxo de Caixa Operacional) e a Capacidade de Pagamento de Amortização + Juros no período.

---

## 5. Estrutura de Capital por Segmento

A estrutura de capital natural difere frontalmente entre ecossistemas, não podendo ser uniformizada pela plataforma.

*   **SaaS:** Possui estrutura leve (baixo CAPEX/Imobilização). É altamente sensível a dívidas bancárias pesadas. O passivo deve ser dominado por Receita Antecipada.
*   **Indústria:** Depende de maquinário (maior CAPEX e Estoque). É normal e aceitável possuir passivos bancários de longo prazo substanciais (FINAME, Debêntures) amparando o ativo fixo, e forte financiamento via Fornecedor de insumos.
*   **Hospital:** O ciclo financeiro é longo e penoso na receita. Exige forte lastro em Patrimônio Líquido ou emissões longas imobiliárias (FIIs) e sofre crônica dependência operacional para cobrir despesas fixas massivas.
*   **Distribuição / Atacado:** Estrutura onde o "Fornecedor" domina o passivo passível de financiamento de expansão. A dívida bancária, quando entra pesada, geralmente é para descontos predatórios de recebíveis que corroem toda a margem.

---

## 6. MATRIZES OBRIGATÓRIAS

As matrizes abaixo governam a avaliação sintética do módulo.

### MATRIZ DE QUALIDADE DA DÍVIDA
| Perfil da Dívida Predominante | Impacto na Estrutura | Parecer Institucional |
| :--- | :--- | :--- |
| **Dívida CP Bancária sem Garantia** | Destruição de Caixa | Péssima Qualidade / Alto Risco |
| **Mútuos de Sócios** | Risco de Governança | Baixa Qualidade / Risco Institucional |
| **Debêntures de Infraestrutura** | Financiamento de Escala | Alta Qualidade / Sofisticação |
| **FINAME/BNDES** | Custo Adequado / Lastreado | Qualidade Moderada-Alta |

### MATRIZ DE QUALIDADE DOS PASSIVOS
| Tipo de Passivo Concentrado | Função no Ciclo | Nível de Ameaça Latente |
| :--- | :--- | :--- |
| **Fornecedores** | *Funding* Operacional | Tolerável / Desejável (se sem atraso) |
| **Trabalhista/Tributário** | *Funding* Ilegal / Judicial | Crítico (Ameaça Continuidade) |
| **Receita Diferida** | Financiamento pelo Cliente | Saudável |

### MATRIZ DE ELASTICIDADE FINANCEIRA
| Condição da Dívida vs Geração | Elasticidade | Interpretação |
| :--- | :--- | :--- |
| **Serviço da Dívida < 20% do EBITDA** | Alta Elasticidade | Suporta retração operacional severa |
| **Serviço da Dívida > 80% do EBITDA** | Inelástico / Rígido | Qualquer choque causa *Default* imediato |

### MATRIZ DE RISCO DE REFINANCIAMENTO
| Relação Dívida Curta / Caixa Livre | Risco de Rolagem (*Rollover*) | Status |
| :--- | :--- | :--- |
| **CP exigível é 5x o Caixa** | Risco Gravíssimo | Refinanciamento forçado sob taxas punitivas |
| **CP exigível < Caixa + Recebíveis** | Risco Baixo/Nulo | Soberania de Caixa |

### MATRIZ DE MATURIDADE DO FUNDING
| Instrumento Utilizado | Grau de Maturidade Financeira da Empresa |
| :--- | :--- |
| **Cheque Especial / Conta Garantida** | Imaturidade / Descontrole |
| **Capital de Giro Limpo Bancário** | Operação Padrão |
| **CRA / CRI / Emissão Externa** | Sofisticação de Tesouraria Avançada |

---

## 7. Diretrizes para Narrativas (Advisory & LLM)

Os motores de IA encarregados de gerar texto explicativo, conselhos e *Executive Summaries* devem obedecer irrestritamente:

1.  **Fica Proibido:** Demonizar e emitir sentenças apocalípticas automaticamente ante o aumento nominal do passivo isolado.
2.  **Fica Proibido:** Classificar um aumento vigoroso em contas operacionais saudáveis (Receita Diferida ou Fornecedores em dia) como sintoma de "colapso".
3.  **Fica Proibido:** Recomendar planos drásticos de recuperação (*Turnaround*) sem a evidência cristalina de ruptura de cobertura (EBITDA asfixiado) e degradação da estrutura de capital.
4.  **Fica Proibido:** Tratar o risco inerente a Fornecedores (comercial) como idêntico ao Risco Bancário (execução judicial sumária).

**EXEMPLO OBRIGATÓRIO PARA A ENGINE:**
*   Fornecedor Operacional Elevado com Prazos Alinhados **≠** Insolvência. (É otimização de ciclo financeiro).
*   Dívida Bancária Curta e Cara SEM Geração Operacional Crescente **=** Alto Risco Estrutural de *Default*.

---

## 8. Objetivo Final Institucional

O propósito da aplicação da *Capital Structure Engine* é dotar a plataforma da capacidade crítica de diagnosticar a verdadeira saúde do financiamento corporativo.

A plataforma e seus algoritmos deverão interpretar o balanço com comportamento, vocabulário e profundidade comparáveis à análise de um *Chief Financial Officer* (CFO), comitês de crédito bancários *premium*, diretores de *Private Equity*, consultores de reestruturação de capital e estruturas formais de Governança Corporativa.

A missão fundamental deste módulo cessa em focar no "Tamanho da Dívida", para entregar o diagnóstico cirúrgico da **Qualidade Institucional, Origem e Resiliência da Estrutura de Capital** do negócio avaliado.

---
*Fim do Documento.*
