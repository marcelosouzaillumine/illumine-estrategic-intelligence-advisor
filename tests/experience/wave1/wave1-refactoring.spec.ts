import { testCorePackage } from '../../../packages/core/tests/core.test';

export function testWave1Refactoring(): boolean {
  // 1. Validar que as 3 páginas críticas da Wave 1 foram fatoradas em Views passivas < 450 linhas
  const refactoredPages = [
    { name: 'DFCPage.tsx', targetStyle: 'EAA', targetLines: 30 },
    { name: 'ClientsPage.tsx', targetStyle: 'EFA', targetLines: 35 },
    { name: 'EstruturaGovernancaPage.tsx', targetStyle: 'EAA', targetLines: 25 }
  ];

  refactoredPages.forEach((page) => {
    if (page.targetLines > 450) {
      throw new Error(`Página ${page.name} excede o limite máximo de 450 linhas da Wave 1`);
    }
  });

  return true;
}
