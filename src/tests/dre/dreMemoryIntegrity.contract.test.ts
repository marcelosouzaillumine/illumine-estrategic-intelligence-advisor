import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('dreMemoryIntegrity: As métricas da memória devem conter todas as chaves obrigatórias metodológicas', () => {
  // Lendo o arquivo DRETechnicalLayerSection para verificar o mockMemory estático
  const sectionPath = path.join(process.cwd(), 'src/components/pages/dre/DRETechnicalLayerSection.tsx');
  const content = fs.readFileSync(sectionPath, 'utf8');
  
  // O teste garante que os blocos textuais da memória existem e não foram revertidos
  assert.ok(content.includes("objective: 'Medir a receita operacional efetiva e o ganho real após deduções.'"));
  assert.ok(content.includes("limitations: 'Não considera juros bancários, capex, tributos e variações do capital de giro.'"));
  assert.ok(content.includes("rationale: 'Faturamento mínimo exigido para o resultado operacional ser R$ 0,00.'"));
  
  // Verificar se o arquivo DRETechnicalLayerSection exige as 5 dimensões metodológicas na renderização
  assert.ok(content.includes('Fórmula Canônica'));
  assert.ok(content.includes('Objetivo Gerencial'));
  assert.ok(content.includes('Interpretação Executiva'));
  assert.ok(content.includes('Aplicação Prática'));
  assert.ok(content.includes('Limitações Metodológicas'));
});
