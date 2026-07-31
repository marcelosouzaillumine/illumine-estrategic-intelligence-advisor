import fs from 'fs';
import path from 'path';

const typesDir = path.join(process.cwd(), 'packages/architecture-governance-types/src');
const enumsDir = path.join(typesDir, 'enums');
const voDir = path.join(typesDir, 'value-objects');

fs.mkdirSync(enumsDir, { recursive: true });
fs.mkdirSync(voDir, { recursive: true });

const enums = {
  'Severity': `export enum Severity {\n  CRITICAL = 'CRITICAL',\n  HIGH = 'HIGH',\n  MEDIUM = 'MEDIUM',\n  LOW = 'LOW',\n  OBSERVATION = 'OBSERVATION'\n}`,
  'Risk': `export enum Risk {\n  CRITICAL = 'CRITICAL',\n  HIGH = 'HIGH',\n  MODERATE = 'MODERATE',\n  LOW = 'LOW'\n}`,
  'CertificationStatus': `export enum CertificationStatus {\n  CERTIFIED = 'CERTIFIED',\n  PENDING = 'PENDING',\n  BETA = 'BETA',\n  NOT_CERTIFIED = 'NOT_CERTIFIED',\n  APPROVED = 'APPROVED',\n  BLOCKED = 'BLOCKED'\n}`,
  'Lifecycle': `export enum Lifecycle {\n  EXPERIMENTAL = 'EXPERIMENTAL',\n  BETA = 'BETA',\n  CERTIFIED = 'CERTIFIED',\n  DEPRECATED = 'DEPRECATED',\n  RETIRED = 'RETIRED'\n}`,
  'GateResult': `export enum GateResult {\n  PASS = 'PASS',\n  PASS_WITH_OBSERVATIONS = 'PASS_WITH_OBSERVATIONS',\n  FAIL = 'FAIL'\n}`,
  'EvidenceSource': `export enum EvidenceSource {\n  STATIC_ANALYSIS = 'STATIC_ANALYSIS',\n  AST = 'AST',\n  HUMAN_REVIEW = 'HUMAN_REVIEW',\n  RUNTIME = 'RUNTIME',\n  CI = 'CI',\n  INFERENCE = 'INFERENCE'\n}`,
  'CapabilityType': `export enum CapabilityType {\n  CORE = 'CORE',\n  SUPPORTING = 'SUPPORTING',\n  EXPERIMENTAL = 'EXPERIMENTAL',\n  INFRASTRUCTURE = 'INFRASTRUCTURE'\n}`,
  'RuleCategory': `export enum RuleCategory {\n  ARCHITECTURAL = 'ARCHITECTURAL',\n  SECURITY = 'SECURITY',\n  PERFORMANCE = 'PERFORMANCE',\n  AI = 'AI',\n  GOVERNANCE = 'GOVERNANCE',\n  PRODUCT = 'PRODUCT'\n}`
};

for (const [name, content] of Object.entries(enums)) {
  fs.writeFileSync(path.join(enumsDir, `${name}.ts`), content + '\n');
}

const valueObjects = [
  'CapabilityId', 'RuleId', 'EvidenceId', 'ReleaseId', 
  'CertificationId', 'WaveId', 'BaselineId', 'SemanticVersion', 'WaveReference'
];

let voIndex = '';
for (const vo of valueObjects) {
  const content = `export type ${vo} = string & { readonly __brand: '${vo}' };\n\nexport const create${vo} = (id: string): ${vo} => id as ${vo};\n`;
  fs.writeFileSync(path.join(voDir, `${vo}.ts`), content);
  voIndex += `export * from './${vo}';\n`;
}
fs.writeFileSync(path.join(voDir, 'index.ts'), voIndex);

let enumsIndex = Object.keys(enums).map(e => `export * from './${e}';`).join('\n') + '\n';
fs.writeFileSync(path.join(enumsDir, 'index.ts'), enumsIndex);

fs.writeFileSync(path.join(typesDir, 'index.ts'), `export * from './enums';\nexport * from './value-objects';\n`);

console.log('Types package bootstrapped.');
