import * as fs from 'fs';
import * as path from 'path';

export const RESULTS_FILE = path.join(process.cwd(), 'docs/architecture/EAC_SUMMARY_VISUAL_QA_RESULTS.json');

export function appendResult(result: any) {
  let results = [];
  if (fs.existsSync(RESULTS_FILE)) {
    try {
      results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
    } catch (e) {
      // ignore
    }
  }
  results.push(result);
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

export function initializeResults() {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify([]));
}
