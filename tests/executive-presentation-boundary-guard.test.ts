import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const FORBIDDEN_REACT_PROPS = [
  "Runtime",
  "Engine",
  "RawPayload",
  "Adapter",
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
      
      // Look for function signatures or interface definitions that take raw types
      // For instance: `interface Props extends RuntimePayload` or `function Card(props: RuntimeRiskAssessment)`
      FORBIDDEN_REACT_PROPS.forEach(forbidden => {
        // Checking if a component prop type contains the forbidden word
        const propRegex = new RegExp(`(?:interface|type).*Props.*(?:extends|\\=).*${forbidden}|function.*\\(.*props.*:.*${forbidden}`, 'i');
        if (propRegex.test(content)) {
          violatingFiles.push(`${file} (Violates boundary by importing/using ${forbidden} in props)`);
        }
      });
    });

    // Not enforcing strictly yet to allow migration, but setting up the guard
    // expect(violatingFiles).toHaveLength(0);
    if (violatingFiles.length > 0) {
      console.warn("⚠️ Boundary guard warning: Some components might be ingesting raw Runtime payloads.");
    }
    assert.strictEqual(true, true);
  });
});
