import { CapabilityRegistryReader } from '../contracts/CapabilityRegistryReader';
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
