export interface ResolvedExperienceLayer {
  layerId: string;
  order: number;
  rootComponentId: string;
}

export interface ExecutiveExperienceManifest {
  productId: string;
  office: string;
  layers: ResolvedExperienceLayer[];
}
