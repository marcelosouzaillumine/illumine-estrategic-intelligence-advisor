# MASTER IMPORT ENGINE

## 1. Finalidade
O **Master Import Engine** define a governança técnica, os protocolos estruturais e os padrões operacionais obrigatórios para todo o ciclo de vida da importação de dados financeiros (Demonstrativos de Resultados do Exercício - DRE e Balanços Patrimoniais) na plataforma Illumine. A finalidade desta arquitetura é garantir que nenhum dado financeiro corrompido, incompleto, matematicamente inconsistente ou estruturalmente inválido atinja a camada oficial de dados. Este motor protege a integridade analítica da plataforma e assegura que todas as engrenagens de inteligência (como o Engine de Causalidade Financeira e o Engine de Continuidade Empresarial) consumam exclusivamente dados validados, rastreáveis e formalmente aprovados, operando sob uma perspectiva de resiliência e imutabilidade de informações já estabilizadas.

## 2. Regra de Precedência
Este documento atua como a fonte oficial de verdade para todas as rotinas e arquiteturas de importação de dados dentro do ecossistema Illumine. Em caso de conflitos ou divergências de implementação, as diretrizes aqui estabelecidas têm prevalência absoluta sobre qualquer documentação em nível de componente, fluxos operacionais, especificações funcionais ou descrições técnicas locais. O **Master Import Engine** subordina-se unicamente ao `MASTER_ARCHITECTURE.md` (Arquitetura Mestra Illumine) e atua em estrita complementaridade com o `MASTER_FINANCIAL_INTELLIGENCE_ENGINE.md`, assegurando uma via segura para que as inteligências financeira, de causalidade e de continuidade empresarial operem com dados invioláveis.

## 3. Nova Arquitetura Obrigatória
A pipeline de ingestão de dados da Illumine segue estritamente um fluxo linear, determinístico e com barreiras de contenção que impedem a gravação em banco oficial antes de todas as validações estruturais, matemáticas e aprovações humanas.
A arquitetura de ingestão deve obrigatoriamente operar na seguinte sequência de transições de estado isoladas:

**Fluxo Arquitetural de Ingestão:**
1. **UPLOAD:** Recepção física do arquivo (PDF, XLSX, CSV, Imagem) na camada de borda do sistema em ambiente temporário e criptografado.
2. **STAGING:** Armazenamento isolado do arquivo bruto em um ambiente transitório (Staging Layer), sem qualquer contato com o banco de dados oficial.
3. **PARSING:** Extração vetorial (para textos) ou extração óptica (OCR tolerante a falhas visuais) visando capturar de modo bruto os caracteres e tabelas, com tolerância a formatações exóticas, marcas d'água ou desalinhamentos.
4. **NORMALIZAÇÃO:** Limpeza dos dados extraídos, com a padronização de tipologias, remoção de caracteres invisíveis e padronização das nomenclaturas, convertendo dados sujos em arrays e matrizes controladas.
5. **MAPEAMENTO CONTÁBIL:** Aplicação do sistema de "De-Para Inteligente", relacionando a terminologia externa do cliente (planos de contas variados) ao modelo de dados oficial e normalizado da plataforma Illumine.
6. **VALIDAÇÃO ESTRUTURAL:** Verificação rigorosa do schema de importação, impedindo a mistura de contas sintéticas (agrupadoras) com contas analíticas (registros folha) e verificando hierarquias esperadas.
7. **VALIDAÇÃO MATEMÁTICA:** Re-cálculo da lógica vertical do demonstrativo financeiro (ex: subtotais como Lucro Bruto, EBITDA, e conferência se Ativo = Passivo + Patrimônio Líquido) garantindo a equação contábil perfeita.
8. **VALIDAÇÃO HIERÁRQUICA:** Reconstrução e validação do aninhamento do plano de contas, aferindo se as entidades filhas compõem de forma integral as entidades pais.
9. **PRÉVIA VISUAL:** Disposição de todas as informações mapeadas em uma interface de rascunho visual (*draft state*), onde o usuário interage diretamente com os erros, alertas e a estrutura validada.
10. **APROVAÇÃO MANUAL:** Mecanismo de consentimento explícito e assinado digitalmente, no qual um operador atesta que o mapa financeiro importado é correto e passível de efetivação.
11. **GRAVAÇÃO OFICIAL:** Migração estrita dos dados aprovados da Staging Layer para as tabelas analíticas principais (Banco Oficial) de modo transacional (garantia ACID e operação *all-or-nothing*).
12. **INDEXAÇÃO ANALÍTICA:** Propagação dos eventos para o processamento assíncrono das engrenagens da Illumine, habilitando o cálculo de Scores, geração de Advisory e predição de Continuidade Empresarial.

**Proibições Sistêmicas Absolutas:**
A importação **NÃO** pode, sob nenhuma circunstância:
- Gravar dados diretamente no banco oficial a partir de fluxos de upload de ponta a ponta sem a aprovação explícita.
- Sobrescrever dados previamente validados, oficializados e consolidados sem controle de versionamento.
- Integrar importações incompletas ou que possuam falhas estruturais, matemáticas ou mapeamento contábil inconclusivo.
- Gerar scores, diagnósticos ou processar lógicas do Engine de Continuidade Empresarial sobre dados temporários, em *draft*, ou não aprovados.
- Produzir advisory estratificado ou narrativas causais baseadas em dados cujo balanço apresente inconsistência matemática ou estrutural.
- Misturar operações de contas sintéticas (totais) com contas analíticas (transacionais), violando o modelo canônico contábil.
- Ignorar ou mascarar inconsistências estruturais no log para forçar importações sistêmicas sob a prerrogativa de flexibilização.

## 4. Staging Layer Obrigatória
A **Staging Layer** (Camada de Estágio) é uma área de contenção obrigatória entre o mundo exterior e os bancos de dados oficiais. Todo dado extraído de um import, independente de sua origem ou formato, é retido nesta zona isolada (*sandbox* temporal). As tabelas da *staging layer* armazenam apenas intenções e *drafts* parciais da importação. Nenhum *query* do motor de inteligência financeira pode ler registros dessa camada. Essa barreira garante que dados defeituosos e arquivos maliciosos, incompletos ou em processamento sejam encapsulados. Ela garante, simultaneamente, que nenhum fluxo assíncrono execute avaliações preditivas (como a Engine de Causalidade) em demonstrações que ainda estão sob análise.

## 5. Engine de Parsing Financeiro
O Parsing Financeiro deve ser de natureza altamente resiliente. Este módulo é responsável pela ingestão agnóstica de arquivos estruturados ou não estruturados, processando linhas corrompidas, arquivos truncados e layouts adversos (seja por *crawlers* de PDF, leitura em matriz Excel ou processamento OCR). O **OCR tolerante** deve lidar ativamente com artefatos visuais, distorções de fonte e formatações exóticas (mesclagem de células, quebras de linhas no meio das descrições), interpretando layouts tabulares sem perda do contexto financeiro posicional. Essa engine garante que toda instrução de importação se reverta em um JSON estrutural canônico de entrada.

## 6. Engine de Normalização Contábil
Responsável pela padronização textual, estrutural e lógica. Após o parse dos arquivos brutos, este motor remove sufixos de identificação desnecessários, formata moedas, detecta encondings anômalos e realiza a higienização primária. Adicionalmente, executa o **de-para inteligente**, utilizando mapeamento algorítmico baseado em proximidade lexical e histórico de correspondências contábeis para vincular os códigos das contas de diferentes clientes (que podem estar em matrizes personalizadas) aos agrupadores sintéticos e analíticos oficiais estipulados no motor analítico da Illumine, tudo isso sem intervenção técnica no código-fonte.

## 7. Engine de Hierarquia Contábil
Neste núcleo operacional, garante-se a **reconstrução hierárquica** fidedigna da estrutura da organização financeira. O motor aplica um bloqueio inflexível em relação à **distinção entre contas sintéticas e analíticas**. Uma conta analítica, contendo o valor financeiro direto e real (linha de lançamento), não pode coexistir semanticamente ou assumir funções de uma conta sintética, que serve puramente como agrupador matemático de suas contas subjacentes. A engine valida níveis contábeis (ex: `1.0`, `1.1`, `1.1.01`) assegurando que a árvore hierárquica do demonstrativo de DRE ou BP importado se resolva perfeitamente em níveis descendentes organizados logicamente.

## 8. Engine de Validação Matemática
Trata-se de um validador algébrico transacional sem tolerância a falhas ou aproximações. Este motor recálcula em tempo real a consistência numérica vertical dos dados brutos recebidos contra as suas próprias linhas totalizadoras. Ele afere de maneira determinística, em cada importação, a equação fundamental contábil (Ativo Total = Passivo Total + Patrimônio Líquido). Em um DRE, afere que a soma dos faturamentos e deduções confere matematicamente com o Lucro Líquido do Exercício indicado, ou com métricas consolidadas (EBITDA, LAIR). O resultado da validação matemática é binário: válido ou inválido. Qualquer divergência entre a soma das filhas e o valor exposto da conta mãe bloqueia imediata e irreversivelmente a transição do estado do DRE ou BP para a fase aprobatória, retornando falhas determinísticas, apontamentos da anomalia na **validação matemática** e exigindo correção do dado na Staging Layer.

## 9. Engine de Sinais Contábeis
Processador focado de extrema precisão destinado ao **tratamento de sinais** lógicos. Historicamente os demonstrativos contábeis de diferentes plataformas mesclam notações financeiras (parênteses indicando valores negativos em ERPs ou representações de créditos e débitos sem conversão matemática explícita). Este Engine normaliza os valores absolutos transpostos aos perfis de contas, onde contas de natureza Credora e Devedora são transladadas em representações algébricas adequadas para o cálculo (+ e -). Uma falha nesta engine gera anomalias fatais no cálculo de liquidez e solvência; portanto, todas as chaves mapeadas recebem assinatura de inversão matemática explícita e controlada para não induzir a Engine de Causalidade em erros catastróficos.

## 10. Engine de Aprovação Obrigatória
Implementa uma porta de bloqueio (Gatekeeper) baseada em fluxo humano (*Human in the Loop*). Após os dados passarem nas Engine Estrutural, Matemática e Hierárquica, o sistema exige uma **aprovação obrigatória**. Os dados processados ficam paralisados no modelo de **Prévia Visual**. É estritamente vedado qualquer script de "auto-aprovação" (Auto-Approve Script) visando produtividade em detrimento de qualidade. Apenas um operador humano, ao atestar visualmente que o mapeamento De-Para final e que as integridades visuais dos demonstrativos numéricos em ambiente de teste condizem com a realidade do cliente corporativo, pode executar a ação explícita de submissão definitiva, assinando o fluxo transacional para a **gravação oficial**.

## 11. Engine de Logs e Auditoria
A engine de log atua como a fundação de rastreabilidade para toda e qualquer interação dentro do módulo de importação de dados. Requer a presença de **logs completos** de cada tentativa de processamento, englobando a geração sistêmica da **trilha de auditoria** contendo: User ID, IP, Timestamp Absoluto, Hash do Arquivo Importado, Divergências Reportadas e Payload Bruto Recebido. Cada evento de manipulação recebe *tagging* imutável. Além de rastrear ações bem-sucedidas, o log captura pormenorizadamente a **detecção de duplicidade**, impedindo registros de lançamentos sistêmicos repetidos com a mesma competência de data, garantindo a transparência total exigida pelas premissas contábeis.

## 12. Engine de Recuperação e Versionamento
Focado na proteção anti-corrupção dos registros oficias, o **Engine de Recuperação e Versionamento** implanta os conceitos obrigatórios de **rollback** e de preservação por **versionamento**. Cada inserção confirmada pela aprovação humana no Banco de Dados Oficial cria um Snapshot imutável. Caso uma integração gere discrepâncias observáveis no futuro, a governança permite aplicar um rollback transacional seguro para a versão estrutural prévia de uma competência. Em nenhum cenário a importação pode executar sobrescritas destrutivas; a **prevenção de sobrescrita indevida** garante que as atualizações documentais em um mesmo período mantenham os registros originais ocultos, mas integralmente rastreáveis no histórico.

## 13. Engine de Curadoria Inteligente
Este componente atua ativamente na governança lógica que orienta a correspondência dos dados transacionais do cliente ao `MASTER_FINANCIAL_INTELLIGENCE_ENGINE.md`. Durante o mapeamento, a Engine de Curadoria Inteligente analisa padrões estruturais para recomendar hierarquias que mantenham a conformidade dos relatórios. Construindo referências históricas das classificações validadas previamente, a curadoria mitiga falhas de classificação em relatórios de origem confusa e promove escalabilidade no processo de de-para humano sem interferir no controle absoluto da aprovação manual.

## 14. Engine de Mock e Dados Reais
Garante a santidade da base analítica contra a contaminação de dados sintéticos ou dados de teste inseridos acidentalmente. A importação impõe nativamente o **bloqueio de mock quando houver dados reais**. A infraestrutura proíbe terminantemente a inserção e permanência simultânea de demonstrações preenchidas artificialmente para simulação (via preenchimentos default para testes) dentro de contas ativas e operantes de clientes que já aprovaram seus dados legítimos, protegendo assim o motor central de "Causalidade Financeira" contra a poluição que causaria corrupção nos diagnósticos sistêmicos oficiais.

## 15. Engine de Resiliência
Motor de tratamento de infraestrutura operando perante falhas na camada da ingestão, incluindo quebras de time-outs de OCR e colapso de processamento de matrizes de alta densidade de dados. A **integração segura** e o parse tolerante impõem um framework técnico que impede a desestabilização da aplicação (Panic Propagation) aplicando recuperações granulares e interceptações dos processos em falhas sem perda da sessão. Assegura que falhas de rede, limites de bytes ou quebras do parsing devolvam o status da importação para a camada inicial sem gerar integrações fragmentadas.

## 16. Governança Final
A operação do processo completo de ingestão, parsing, e estruturação atua sob as mais restritas obrigações fiduciárias de integridade do código fonte. A **governança de importação** determina que a qualidade incontestável e perfeita da informação financeira validada e com distinção estrutural irrefutável prevalece sobre a rapidez técnica ou necessidade comercial de processamento rápido. A capacidade preditiva da Illumine e a qualidade técnica do advisory inteligente repousam exclusivamente nesta porta de entrada. A violação a essas regras arquiteturais representa uma infração direta de severidade máxima às premissas imutáveis da Illumine.
