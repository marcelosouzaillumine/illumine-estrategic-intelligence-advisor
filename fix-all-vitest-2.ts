import * as fs from 'fs';
import * as path from 'path';

const dir = 'src/tests/balance-sheet';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.ts') || f.endsWith('.ts'));

for (const f of files) {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf-8');
  if (content.includes("node:test")) {
    content = content.replace(/import\s+\{[^}]*\}\s+from\s+['"]node:test['"];/g, "import { describe, it, test, expect, beforeAll, afterAll } from 'vitest';");
    content = content.replace(/import\s+assert\s+from\s+['"]node:assert['"];/g, "import assert from 'node:assert';");
    content = content.replace(/import\s+\*\s+as\s+assert\s+from\s+['"]node:assert['"];/g, "import assert from 'node:assert';");
    fs.writeFileSync(p, content);
  }
}
