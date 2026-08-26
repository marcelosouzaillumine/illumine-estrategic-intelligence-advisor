import * as fs from 'fs';

const engine = 'src/capabilities/financial/intelligence/BalanceSheetIntelligenceEngine.ts';
if (fs.existsSync(engine)) {
  let content = fs.readFileSync(engine, 'utf-8');
  
  // Replace buildIndicator signature
  // const buildIndicator = (
  //   id: string, name: string, value: number | undefined | null, unit: string, category: string,
  //   statusFn: (val: number) => string, interpretationFn: (val: number) => string,
  //   referenceRange: string, methodologicalNotes: string
  // )
  content = content.replace(/statusFn: \(val: number\) => string, interpretationFn: \(val: number\) => string,[\s\S]*?\)/, 'statusFn: (val: number) => string, interpretationFn: (val: number) => string, ...extra: any[])');

  // Remove referenceRange and methodologicalNotes from the indicators.push objects
  content = content.replace(/referenceRange, methodologicalNotes,/g, '');

  fs.writeFileSync(engine, content);
}
