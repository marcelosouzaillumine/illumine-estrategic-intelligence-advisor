import fs from 'fs';
import path from 'path';

const registryDir = path.join(process.cwd(), 'packages/architecture-governance-registry/src');

const contracts = {
  'Metadata.ts': `export interface RegistryMetadata {\n  registryVersion: string;\n  schemaVersion: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n`,
  'CapabilityRegistryWriter.ts': `import { CapabilityContract } from '@illumine/architecture-governance-contracts';
import { CapabilityId } from '@illumine/architecture-governance-types';
export interface CapabilityRegistryWriter {
  register(capability: CapabilityContract): Promise<void>;
  update(id: CapabilityId, capability: Partial<CapabilityContract>): Promise<void>;
}
`,
  'CapabilityRegistryReader.ts': `import { CapabilityContract } from '@illumine/architecture-governance-contracts';
import { CapabilityId } from '@illumine/architecture-governance-types';
export interface CapabilityRegistryReader {
  findById(id: CapabilityId): Promise<CapabilityContract | null>;
  findAll(): Promise<ReadonlyArray<CapabilityContract>>;
}
`,
  'RuleRegistryWriter.ts': `import { RuleContract } from '@illumine/architecture-governance-contracts';
import { RuleId } from '@illumine/architecture-governance-types';
export interface RuleRegistryWriter {
  register(rule: RuleContract): Promise<void>;
}
`,
  'RuleRegistryReader.ts': `import { RuleContract } from '@illumine/architecture-governance-contracts';
import { RuleId, RuleCategory } from '@illumine/architecture-governance-types';
export interface RuleRegistryReader {
  findById(id: RuleId): Promise<RuleContract | null>;
  findByCategory(category: RuleCategory): Promise<ReadonlyArray<RuleContract>>;
}
`,
  'CertificationRegistryWriter.ts': `import { CertificationContract } from '@illumine/architecture-governance-contracts';
import { CertificationId } from '@illumine/architecture-governance-types';
export interface CertificationRegistryWriter {
  issue(certification: CertificationContract): Promise<void>;
}
`,
  'CertificationRegistryReader.ts': `import { CertificationContract } from '@illumine/architecture-governance-contracts';
import { CertificationId } from '@illumine/architecture-governance-types';
export interface CertificationRegistryReader {
  verify(id: CertificationId): Promise<CertificationContract | null>;
}
`,
  'index.ts': `export * from './Metadata';
export * from './CapabilityRegistryWriter';
export * from './CapabilityRegistryReader';
export * from './RuleRegistryWriter';
export * from './RuleRegistryReader';
export * from './CertificationRegistryWriter';
export * from './CertificationRegistryReader';
`
};

const adapters = {
  'LocalCapabilityRegistry.ts': `import { CapabilityRegistryReader } from '../contracts/CapabilityRegistryReader';
import { CapabilityRegistryWriter } from '../contracts/CapabilityRegistryWriter';
import { CapabilityContract } from '@illumine/architecture-governance-contracts';
import { CapabilityId } from '@illumine/architecture-governance-types';
import fs from 'fs';
import path from 'path';

export class LocalCapabilityRegistry implements CapabilityRegistryReader, CapabilityRegistryWriter {
  private filePath = path.join(process.cwd(), 'artifacts/governance-foundation-certification/capabilities.json');

  private load(): Record<string, CapabilityContract> {
    if (!fs.existsSync(this.filePath)) return {};
    return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  private save(data: Record<string, CapabilityContract>) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async findById(id: CapabilityId): Promise<CapabilityContract | null> {
    const data = this.load();
    return data[id] || null;
  }

  async findAll(): Promise<ReadonlyArray<CapabilityContract>> {
    const data = this.load();
    return Object.values(data);
  }

  async register(capability: CapabilityContract): Promise<void> {
    const data = this.load();
    data[capability.id] = capability;
    this.save(data);
  }

  async update(id: CapabilityId, capability: Partial<CapabilityContract>): Promise<void> {
    const data = this.load();
    if (data[id]) {
      data[id] = { ...data[id], ...capability };
      this.save(data);
    }
  }
}
`,
  'index.ts': `export * from './LocalCapabilityRegistry';\n`
};

for (const [name, content] of Object.entries(contracts)) {
  fs.writeFileSync(path.join(registryDir, 'contracts', name), content);
}

for (const [name, content] of Object.entries(adapters)) {
  fs.writeFileSync(path.join(registryDir, 'adapters', name), content);
}

fs.writeFileSync(path.join(registryDir, 'index.ts'), `export * from './contracts';\nexport * from './adapters';\n`);
console.log('Registry package bootstrapped.');
