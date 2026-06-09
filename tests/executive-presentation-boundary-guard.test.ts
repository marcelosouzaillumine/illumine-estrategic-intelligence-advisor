import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FORBIDDEN_REACT_PROPS = [
  "Runtime",
  "Engine",
  "Raw",
  "Diagnostic",
  "Result"
];

const COMPONENTS_DIR = join(__dirname, '../src/components');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    if (statSync(join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith('.tsx')) {
        arrayOfFiles.push(join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

describe("Executive Presentation Boundary Guard", () => {
  it("should not allow React components to ingest raw Runtime payloads as props", () => {
    const files = getAllFiles(COMPONENTS_DIR);
    const violatingFiles: string[] = [];

    files.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      
      FORBIDDEN_REACT_PROPS.forEach(forbidden => {
        // Checking for regex like: RuntimePayload, EngineResult, RawData
        const propRegex = new RegExp(`(?:interface|type).*Props.*(?:extends|\\=).*\\b${forbidden}\\w*\\b|function.*\\(.*props.*:.*\\b${forbidden}\\w*\\b`, 'i');
        if (propRegex.test(content)) {
          violatingFiles.push(`Violation in ${file}: Ingesting prohibited raw type (${forbidden})`);
        }
      });
    });

    if (violatingFiles.length > 0) {
      console.error("⛔ ARCHITECTURAL VIOLATION: Presentation components must consume ViewModels, not Runtime types.");
      violatingFiles.forEach(v => console.error("   - " + v));
    }
    
    // Hard fail the test if there are any violations
    assert.strictEqual(violatingFiles.length, 0, "Boundary Guard Failed: Raw Runtime Payloads leaked into UI Component Props.");
  });
});
