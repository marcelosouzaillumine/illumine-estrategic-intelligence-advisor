export type SemanticVersion = string & { readonly __brand: 'SemanticVersion' };

export const createSemanticVersion = (id: string): SemanticVersion => id as SemanticVersion;
