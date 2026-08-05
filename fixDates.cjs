const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project();
project.addSourceFilesAtPaths('src/components/**/*.tsx');
project.addSourceFilesAtPaths('src/components/**/*.ts');

function getImportPath(sourceFile) {
  const filePath = sourceFile.getFilePath();
  const dirParts = filePath.split('src/components/')[1].split('/');
  const depth = dirParts.length - 1;
  const relativePath = depth === 0 ? '../core/localization' : '../'.repeat(depth) + 'core/localization';
  return relativePath;
}

const filesModified = [];

for (const sourceFile of project.getSourceFiles()) {
  let modified = false;
  
  // Find all CallExpressions like new Date(...).toLocaleDateString()
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  const newExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.NewExpression);
  
  const replacements = [];
  
  for (const callExpr of callExpressions) {
    const expr = callExpr.getExpression();
    if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
      const propAccess = expr;
      const propName = propAccess.getName();
      
      if (propName === 'toLocaleDateString' || propName === 'toLocaleTimeString') {
        const caller = propAccess.getExpression();
        // check if caller is `new Date(...)` or `dateVar`
        let dateArgText = caller.getText();
        if (caller.getKind() === SyntaxKind.NewExpression && caller.getExpression().getText() === 'Date') {
          const args = caller.getArguments();
          if (args.length > 0) {
            dateArgText = args[0].getText();
          } else {
            dateArgText = 'new Date()';
          }
        } else if (caller.getKind() === SyntaxKind.CallExpression && caller.getExpression().getText().endsWith('toDate')) {
           dateArgText = caller.getText();
        }
        
        // args for the format call?
        const args = callExpr.getArguments();
        const argText = args.length > 1 ? args[1].getText() : '';
        
        let newCall = '';
        if (propName === 'toLocaleDateString') {
           newCall = argText ? `formatter.date(${dateArgText}, ${argText})` : `formatter.date(${dateArgText})`;
        } else if (propName === 'toLocaleTimeString') {
           newCall = `formatter.date(${dateArgText}, { hour: '2-digit', minute: '2-digit' })`;
        }
        
        replacements.push({ node: callExpr, text: newCall });
      }
    }
  }

  for (const newExpr of newExpressions) {
    const expr = newExpr.getExpression();
    if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
      const propAccess = expr;
      if (propAccess.getText() === 'Intl.DateTimeFormat') {
        const parentCall = newExpr.getParentIfKind(SyntaxKind.PropertyAccessExpression);
        if (parentCall && parentCall.getName() === 'format') {
          const formatCall = parentCall.getParentIfKind(SyntaxKind.CallExpression);
          if (formatCall) {
            const formatArgs = formatCall.getArguments();
            const dateArg = formatArgs.length > 0 ? formatArgs[0].getText() : 'new Date()';
            const intlArgs = newExpr.getArguments();
            const optionsArg = intlArgs.length > 1 ? intlArgs[1].getText() : '{}';
            replacements.push({ node: formatCall, text: `formatter.date(${dateArg}, ${optionsArg})` });
          }
        }
      }
    }
  }

  if (replacements.length > 0) {
    // Sort descending by position to replace bottom-up without affecting positions
    replacements.sort((a, b) => b.node.getPos() - a.node.getPos());
    
    for (const rep of replacements) {
       rep.node.replaceWithText(rep.text);
    }
    modified = true;
    
    // Ensure import exists
    const hasFormatterImport = sourceFile.getImportDeclarations().some(i => i.getModuleSpecifierValue().includes('core/localization'));
    if (!hasFormatterImport) {
       const relativePath = getImportPath(sourceFile);
       sourceFile.addImportDeclaration({
         namedImports: ['useExecutiveFormatter'],
         moduleSpecifier: relativePath
       });
    }

    // Inject `const formatter = useExecutiveFormatter();`
    const functions = sourceFile.getFunctions();
    const arrowFuncs = sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction);
    
    for (const func of [...functions, ...arrowFuncs]) {
       const body = func.getBody();
       if (body && body.getKind() === SyntaxKind.Block) {
          const bodyBlock = body;
          // check if it has the hook
          if (!bodyBlock.getText().includes('useExecutiveFormatter()')) {
             bodyBlock.insertStatements(0, 'const formatter = useExecutiveFormatter();');
          }
       }
    }
  }

  if (modified) {
    sourceFile.saveSync();
    filesModified.push(sourceFile.getFilePath());
  }
}

console.log(`Modified ${filesModified.length} files:`);
console.log(filesModified.join('\\n'));
