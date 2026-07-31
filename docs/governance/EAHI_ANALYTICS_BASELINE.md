# EAHI Analytics Baseline

O EAHI (Executive Analytics Health Index) mensura o nível de maturidade da plataforma em relação à pureza analítica. 

Para que a base do sistema se mantenha saudável (EAHI > 95%), as seguintes verificações automatizadas de baseline devem ser executadas no CI:

1. **Testes de Regressão Obrigatórios**: Nenhuma alteração num Capability do *Executive Analytics Engine* pode ocorrer sem execução dos fixtures `endividada`, `saudavel`, `recuperacao`.
2. **Componentes React Limpos**: Uma verificação AST (Abstract Syntax Tree) nos arquivos da UI garantindo a inexistência de imports de lógicas analíticas próprias.
3. **Evidence Requirement**: Qualquer output do `Narrative Engine` que falhe na validação de preenchimento dos campos obrigatórios da *Evidence Chain* causará um bloqueio de renderização (Runtime Error 500 no Trust Gate).
