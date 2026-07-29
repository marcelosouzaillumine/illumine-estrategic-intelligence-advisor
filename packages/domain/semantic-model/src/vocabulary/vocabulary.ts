import { SemanticEntity } from '../kernel/semantic-kernel';

export interface UbiquitousTerm extends SemanticEntity {
  readonly termCode: string;
  readonly canonicalName: string;
  readonly synonyms: string[];
  readonly domainContext: string;
  readonly immutableDefinition: string;
}

export interface VocabularyRegistry {
  readonly terms: UbiquitousTerm[];
}
