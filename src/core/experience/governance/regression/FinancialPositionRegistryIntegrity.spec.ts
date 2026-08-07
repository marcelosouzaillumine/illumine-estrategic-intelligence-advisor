import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { FinancialPositionProduct } from '../../products/FinancialPositionProduct';
import { ExperienceComponentRegistry } from '../../registry/ExperienceComponentRegistry';
import { registerBalanceSheetComponents } from '../../registry/BalanceSheetComponentRegistration';

describe('Financial Position Registry Integrity (Wave 1.4.10)', () => {
  // Pre-setup: ensure registry is populated
  beforeAll(() => {
    ExperienceComponentRegistry.clear();
    registerBalanceSheetComponents();
  });

  afterAll(() => {
    ExperienceComponentRegistry.clear();
  });

  it('Product ⊆ Registry: Todos os componentes declarados no Product devem estar registrados', () => {
    const productComponents = FinancialPositionProduct.experience.layers.map(section => section.rootComponentId);
    
    productComponents.forEach(componentId => {
      // getComponentMetadata will throw if the component does not exist in the Registry
      expect(() => ExperienceComponentRegistry.getComponentMetadata(componentId)).not.toThrowError();
    });
  });

  it('Orphan Control: Componentes não-registrados no disco devem estar marcados como legacy', () => {
    // Nós varremos a pasta balance-sheet para garantir que não há arquivos órfãos (excluindo index, etc)
    const dirPath = path.resolve(__dirname, '../../../../components/pages/balance-sheet');
    const files = fs.readdirSync(dirPath);
    
    // Components that we know are pure components but maybe not in this registry
    // The strict rule: Any BalanceSheet*Section.tsx must be registered or moved to legacy.
    // TechnicalLayerSection is a nested component used strictly inside ExecutiveAccordion, not at the root Product level.
    const internalSubSections = ['BalanceSheetTechnicalLayerSection'];
    const sections = files.filter(f => f.endsWith('Section.tsx') && !internalSubSections.includes(f.replace('.tsx', '')));
    
    // Pegar o que está no registry para verificar se o arquivo em disco foi registrado
    // Since Registry doesn't expose the keys, we can just check against Product components
    // as we just established Product == Registry.
    const productComponents = FinancialPositionProduct.experience.layers.map(section => section.rootComponentId);
    
    sections.forEach(file => {
      const componentName = file.replace('.tsx', '');
      expect(productComponents).toContain(componentName);
    });
  });
});
