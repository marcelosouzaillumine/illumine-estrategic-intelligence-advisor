# Governança de Dados e Conformidade (LGPD/Segurança)

Este documento dita as normas inegociáveis sobre manuseio, retenção e expurgo de dados contábeis e financeiros para o ambiente Piloto da Governance/EFOS.

## 1. Princípio de Isolamento Rigoroso (Tenant Isolation)
- O EFOS opera sob arquitetura de Multi-Tenancy Segregado Lógica ou Fisicamente.
- Sob nenhuma hipótese os dados numéricos brutos do Tenant Piloto (ex: Receita, Caixa) poderão transitar para o cache ou banco de dados de qualquer outro tenant.
- A criptografia ponta-a-ponta protege a Ingestão Documental inicial.

## 2. Termo de Uso e LLMs de Terceiros
- O sistema faz uso de Inteligência Artificial para tradução de narrativas.
- Contratos Enterprise asseguram que APIs de linguagem externas (se utilizadas via endpoints controlados, ex: OpenAI Azure / Gemini Enterprise) operem com **Zero Data Retention** e **Opt-out de Treinamento**. Os balanços do cliente não retroalimentarão modelos de mercado.
- Somente métricas normalizadas, expurgadas de PII (Personally Identifiable Information) e de CPNJ/Nomes, deverão transitar caso haja qualquer processamento externo.

## 3. Direitos sobre Dados Pessoais (LGPD)
- Embora a plataforma seja B2B (Foco em PJ), os perfis de usuários (`Tenant Admin`, `Board Member`) coletam e-mail corporativo. Estes dados sujeitam-se à conformidade com a LGPD, garantindo direito de consulta, exclusão ou portabilidade.

## 4. Política de Retenção e Expurgo
Caso os Critérios de Aceite não sejam atingidos e o Piloto seja descontinuado:
- Todos os dados históricos injetados (BPs, DREs, Board Packs) serão sumariamente pulverizados em até 30 dias.
- Certificado de destruição segura de dados gerado pela engenharia fiduciária mediante solicitação do Sponsor.
- Um "snapshot de corrupção" ou metadados anonimizados sobre falhas da engine podem ser retidos estritamente para melhoria matemática do produto, desde que sem vínculo identificável (Hash anônimo).
