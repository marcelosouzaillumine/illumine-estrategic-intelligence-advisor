import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const PUBLIC_EXPERIENCE_TERMS_BLOCKLIST = [
  "Executive Copilot",
  "Microsoft Copilot",
  "AI Assistant",
  "Chatbot",
  "Assistant",
  "Digital Assistant",
  "Virtual Assistant"
];

// Diretórios onde não podemos vazar nomes genéricos (UI e Internacionalização)
const PROTECTED_DIRECTORIES = [
  'src/components',
  'src/pages',
  'src/i18n'
];

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (
        fullPath.endsWith('.tsx') || 
        fullPath.endsWith('.ts') || 
        fullPath.endsWith('.json')
      ) {
        // Ignorar arquivos de teste na varredura para evitar falsos positivos do próprio teste
        if (!fullPath.includes('.test.ts') && !fullPath.includes('.spec.ts')) {
          arrayOfFiles.push(fullPath);
        }
      }
    }
  });

  return arrayOfFiles;
}

describe('Experience Boundary Test', () => {
  it('should not contain public blocklisted terms in UI components and locales', () => {
    const rootPath = path.resolve(__dirname, '../../');
    
    let allProtectedFiles: string[] = [];
    PROTECTED_DIRECTORIES.forEach(dir => {
      const dirPath = path.join(rootPath, dir);
      allProtectedFiles = getAllFiles(dirPath, allProtectedFiles);
    });

    const violations: { file: string; term: string; line: number }[] = [];

    allProtectedFiles.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Simple heuristic: If it's an import path or a type definition, we ignore it.
        // We only care about string literals or JSX text.
        // For a more complete AST parser, we would use ts-morph, but a regex heuristic is enough for regression.
        if (line.includes('import ') || line.includes('export type ') || line.includes('export interface ')) {
          return;
        }

        PUBLIC_EXPERIENCE_TERMS_BLOCKLIST.forEach(term => {
          // Check for exact matches (case-insensitive for safety, but matching the word)
          const regex = new RegExp(`\\b${term}\\b`, 'i');
          if (regex.test(line)) {
            // Further ignore if it's clearly a technical artifact like "CopilotMessage" or "BoardCopilotPanelProps"
            if (
              line.includes('CopilotMessage') || 
              line.includes('CopilotPanel') || 
              line.includes('CopilotRuntime') ||
              line.includes('role: \'assistant\'') ||
              line.includes('role: "assistant"') ||
              line.includes('m.role === \'assistant\'') ||
              line.includes('msg.role === \'assistant\'') ||
              line.trim().startsWith('//') || // Ignore comments
              line.includes('/*')
            ) {
              return; // Ignorado, uso interno técnico
            }
            
            // Check if it's literally rendering the blocked term
            violations.push({ file: filePath, term, line: index + 1 });
          }
        });
      });
    });

    if (violations.length > 0) {
      console.error('Found experience boundary violations:');
      violations.forEach(v => console.error(`[${v.term}] at ${v.file}:${v.line}`));
    }

    expect(violations.length).toBe(0);
  });
});
