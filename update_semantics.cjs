const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/core/runtime/executive-consolidation/ExecutiveSemanticRegistry.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace interface property
content = content.replace('action: string;', 'executiveQuestion: string;');

// Replace properties and strings
content = content.replace(/action: 'Preservar caixa imediatamente e alongar dívidas',/g, "executiveQuestion: 'Quais medidas de contingência devem ser acionadas para preservar caixa e alongar o perfil da dívida?',");
content = content.replace(/action: 'Manter governança de alocação de caixa',/g, "executiveQuestion: 'A governança atual garante a eficiência na alocação deste caixa protegido?',");
content = content.replace(/action: 'Conservar reservas adequadas às obrigações',/g, "executiveQuestion: 'A política atual é suficiente para conservar reservas adequadas às obrigações futuras?',");

content = content.replace(/action: 'Suspender saídas não essenciais e renegociar prazos com fornecedores',/g, "executiveQuestion: 'Quais saídas não essenciais podem ser suspensas e quais prazos podem ser renegociados?',");
content = content.replace(/action: 'Direcionar excedentes para reinvestimento, abatimento de dívida ou distribuição',/g, "executiveQuestion: 'A liquidez excedente deve ser direcionada para reinvestimento, abatimento de dívida ou distribuição?',");
content = content.replace(/action: 'Manter disciplina de fluxo de caixa',/g, "executiveQuestion: 'A disciplina de fluxo de caixa está alinhada ao nível de liquidez atual?',");

content = content.replace(/action: 'Buscar injeção de capital próprio ou estruturação de dívida alongada',/g, "executiveQuestion: 'É o momento estratégico para injeção de capital próprio ou estruturação de dívida alongada?',");
content = content.replace(/action: 'Avaliar otimização da estrutura de capital ou política de dividendos',/g, "executiveQuestion: 'Existem oportunidades para otimizar a estrutura de capital ou a política de dividendos?',");
content = content.replace(/action: 'Buscar melhorias incrementais no custo da dívida',/g, "executiveQuestion: 'Quais melhorias incrementais podem ser buscadas no custo da dívida atual?',");

content = content.replace(/action: 'Normalizar capital de giro priorizando ciclo de recebimentos',/g, "executiveQuestion: 'Como normalizar o capital de giro priorizando o ciclo de recebimentos?',");
content = content.replace(/action: 'Manter política superavitária de capital de giro',/g, "executiveQuestion: 'A política superavitária de capital de giro maximiza a eficiência da operação?',");
content = content.replace(/action: 'Gerenciar o ciclo de conversão de caixa rigorosamente',/g, "executiveQuestion: 'O gerenciamento do ciclo de conversão de caixa está rigoroso o suficiente?',");

content = content.replace(/action: 'Acelerar conversão de ativos de baixa liquidez em caixa',/g, "executiveQuestion: 'É possível acelerar a conversão de ativos de baixa liquidez em caixa?',");
content = content.replace(/action: 'Garantir eficiência de conversão e renovação adequada',/g, "executiveQuestion: 'A composição do ativo garante eficiência de conversão e renovação adequada?',");

content = content.replace(/action: 'Focar exclusivamente em liquidez e sobrevivência',/g, "executiveQuestion: 'O foco exclusivo em liquidez e sobrevivência já foi plenamente absorvido pela operação?',");
content = content.replace(/action: 'Formalizar política de alocação de excedentes e avaliar retorno marginal',/g, "executiveQuestion: 'O retorno marginal justifica manter esta liquidez ou exige nova política de alocação de excedentes?',");
content = content.replace(/action: 'Buscar alavancas de incremento de retorno sobre capital empregado',/g, "executiveQuestion: 'Quais alavancas incrementais de retorno sobre capital empregado podem ser ativadas?',");

fs.writeFileSync(file, content);
console.log('Done replacing semantics');
