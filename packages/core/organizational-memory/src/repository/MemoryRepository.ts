import { ExperienceRecord } from '../memory/ExperienceRecord';

export class MemoryRepository {
  private readonly records: Map<string, ExperienceRecord> = new Map();

  public save(record: ExperienceRecord): void {
    this.records.set(record.id, record);
  }

  public findById(id: string): ExperienceRecord | undefined {
    return this.records.get(id);
  }

  public findAll(): readonly ExperienceRecord[] {
    return Array.from(this.records.values());
  }
}
