export type NarrativeTokenType = 'heading' | 'emphasis' | 'list_item' | 'text' | 'newline';

export interface NarrativeToken {
  type: NarrativeTokenType;
  content: string;
  level?: number; // Para headings
}
