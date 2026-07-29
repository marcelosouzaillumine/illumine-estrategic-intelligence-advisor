const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json'
});

const pagesPath = path.join(__dirname, '../../src/components/pages');
const files = project.getSourceFiles(pagesPath + '/**/*.tsx');

const candidates = [];
const inventory = [];

files.forEach(file => {
  const filePath = file.getFilePath();
  const baseName = path.basename(filePath);
  
  const jsxElements = file.getDescendantsOfKind(SyntaxKind.JsxElement);
  const jsxSelfClosingElements = file.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
  
  const allElements = [...jsxElements, ...jsxSelfClosingElements];
  
  allElements.forEach(el => {
    let name = '';
    if (el.getKind() === SyntaxKind.JsxSelfClosingElement) {
      name = el.getTagNameNode().getText();
    } else {
      name = el.getOpeningElement().getTagNameNode().getText();
    }
    
    const isSummaryCandidate = 
      name.includes('Summary') || 
      name.includes('Synthesis') || 
      name.includes('Diagnosis') ||
      name === 'ExecutiveStrategicSemanticCards';
      
    if (isSummaryCandidate) {
      const line = el.getStartLineNumber();
      
      let category = 'SEMANTIC_REVIEW';
      let rationale = 'Requer revisão semântica manual por causa de lógica ou KPIs acoplados.';
      let confidence = 'medium';
      let autoFixEligibility = false;
      let reviewRequired = true;
      
      if (name === 'ExecutiveSummarySection') {
        category = 'ALREADY_COMPLIANT';
        rationale = 'Já utiliza o container semântico do EAC v2.';
        confidence = 'high';
        reviewRequired = false;
      }
      
      // A regra estrita é que SemanticCards requer review, pois costuma embutir recomendações
      if (name === 'ExecutiveStrategicSemanticCards') {
        category = 'SEMANTIC_REVIEW';
        rationale = 'Utiliza a fachada legada, que embute síntese e recomendação juntas. Deve ser revisado manualmente para separação semântica correta antes da migração.';
        confidence = 'high';
        reviewRequired = true;
      }

      const relativePath = path.relative(process.cwd(), filePath);
      
      const item = {
        filePath: relativePath,
        page: baseName,
        profile: "Unknown (Requires runtime check)",
        component: name,
        line: line,
        category: category,
        confidence: confidence,
        detectionMethod: "ast",
        semanticBoundary: {
          containsSummary: true,
          containsKpi: false,
          containsRecommendation: (name === 'ExecutiveStrategicSemanticCards'),
          containsTechnical: false
        },
        sharedConsumers: null,
        autoFixEligibility: autoFixEligibility,
        reviewRequired: reviewRequired,
        rationale: rationale
      };

      candidates.push(`- **[${category}]** \`${baseName}:${line}\` - Componente: \`${name}\` (Confidence: ${confidence})`);
      inventory.push(item);
    }
  });
});

fs.writeFileSync('docs/architecture/EAC_SUMMARY_GLOBAL_DISCOVERY.md', `# EAC Summary Global Discovery

**Data**: ${new Date().toISOString()}
**Mecanismo**: AST Analysis via ts-morph

## Candidatos
${candidates.join('\n')}

`);

fs.writeFileSync('docs/architecture/EAC_SUMMARY_MIGRATION_INVENTORY.json', JSON.stringify(inventory, null, 2));

console.log('Discovery Finalizado com Sucesso.');
