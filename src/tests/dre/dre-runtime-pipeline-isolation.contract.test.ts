import { describe, it } from 'node:test';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { DreExecutiveLanguageCompiler } from '../../core/runtime/dre/DreExecutiveLanguageCompiler';
import { DreExecutiveFactsBuilder } from '../../core/runtime/dre/DreExecutiveFactsBuilder';

describe('DRE Canonical Pipeline Isolation Contract', () => {
  it('Deve garantir que o DREPage.tsx não consuma report.metrics.financialMetrics para o DreExecutiveViewModelBuilder', () => {
    const pagePath = path.join(process.cwd(), 'src/components/pages/DREPage.tsx');
    const servicePath = path.join(process.cwd(), 'src/components/pages/dre/DREApplicationService.ts');
    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    const serviceContent = fs.readFileSync(servicePath, 'utf-8');

    // DREPage should not use report.metrics.financialMetrics inside DreExecutiveViewModelBuilder
    assert.ok(
      !pageContent.includes('DreExecutiveViewModelBuilder.build(report.metrics.financialMetrics'),
      'VIOLAÇÃO DE ARQUITETURA: DREPage.tsx não pode usar report.metrics.financialMetrics como fonte primária do ViewModel.'
    );
    
    // DREApplicationService deve passar dreData diretamente
    assert.ok(
      serviceContent.includes('DreExecutiveViewModelBuilder.build({'),
      'VIOLAÇÃO DE ARQUITETURA: DREApplicationService.ts deve passar um objeto estruturado (dreData, historicalDreData) para o builder.'
    );
    assert.ok(
      serviceContent.includes('dreData: params.dbData'),
      'VIOLAÇÃO DE ARQUITETURA: DREApplicationService.ts deve passar dreData diretamente do Firestore.'
    );
  });

  it('Deve garantir que o FiduciaryRuntimeAdapter.generateExecutiveReport não alimenta os painéis da DRE na UI', () => {
    const filePath = path.join(process.cwd(), 'src/components/pages/DREPage.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    // UI não deve renderizar propriedades do report diretamente para a DRE
    assert.ok(
      !content.includes('viewModel={executiveReport.policy.executiveDiagnosis}'),
      'VIOLAÇÃO DE ARQUITETURA: DREPage não pode renderizar o diagnóstico vindo do executiveReport.'
    );
    assert.ok(
      !content.includes('viewModel={executiveReport.boardQuestions}'),
      'VIOLAÇÃO DE ARQUITETURA: DREPage não pode renderizar as perguntas vindo do executiveReport.'
    );
  });

  it('O DreExecutiveFactsBuilder deve ser capaz de computar o cascade de forma independente do ExecutiveIntelligenceRuntime', () => {
    // Simulando uma injeção bruta onde o cascade resulta nisso
    const builder = new DreExecutiveFactsBuilder({ 
      cascadeResult: [
        { id: 'ROB', computedValue: 10000 },
        { id: 'DED', computedValue: -1000 },
        { id: 'ROL', computedValue: 9000 },
        { id: 'CUSTOS', computedValue: -3000 },
        { id: 'LUCRO_BRUTO', computedValue: 6000 },
        { id: 'DESP_OPER', computedValue: -2000 },
        { id: 'EBITDA', computedValue: 4000 }
      ]
    });
    const facts = builder.build();

    // Validar se o construtor independente calculou os valores sem erro
    assert.strictEqual(facts.grossRevenue, 10000, 'Gross revenue fallback não foi calculado via cascade local');
    assert.strictEqual(facts.netRevenue, 9000, 'Net revenue (ROL) não foi calculado localmente via cascade');
    assert.strictEqual(facts.grossProfit, 6000, 'Lucro bruto não foi calculado localmente via cascade');
    assert.strictEqual(facts.ebitda, 4000, 'EBITDA não foi calculado localmente via cascade');
  });

  it('O DreExecutiveLanguageCompiler não deve gerar strings do pipeline legado', () => {
    const compiler = new DreExecutiveLanguageCompiler();
    
    const mockFacts = new DreExecutiveFactsBuilder({ 
        dreData: [
            { id: 'ROB', value: 100 },
            { id: 'DED', value: 0 },
            { id: 'CUSTOS', value: -40 },
            { id: 'DESP_OPER', value: -20 }
        ]
    }).build();

    const diagnosis = compiler.compileExecutiveDiagnosis(
      mockFacts,
      'Geração Operacional Funcional',
      'Margem Sólida',
      ['robusta'],
      false,
      false
    );

    const allStrings = JSON.stringify(diagnosis);
    
    const blacklist = [
      'Análise fundamentada pela métrica',
      'dados não atingem limiares',
      'Sem histórico conclusivo',
      'Driver dominante',
      'Driver restritivo',
      'O indicador',
      'demonstra que'
    ];

    for (const word of blacklist) {
      assert.ok(!allStrings.includes(word), `O compilador vazou a string legada proibida: "${word}"`);
    }
  });
});
