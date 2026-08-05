import { DiagnosticDimension, DiagnosticAttentionArea } from '../core/diagnostic-contracts';
import { DiagnosticDomain } from '../core/diagnostic-types';

export const SAMPLE_DOMAIN: DiagnosticDomain = "sample";

export const SAMPLE_DIMENSIONS: DiagnosticDimension[] = [
  {
    id: 'dim_sample_test',
    name: 'Sample Test Dimension',
    description: 'A mock dimension for architecture validation.',
    weight: 1,
    indicators: []
  }
];

export const SAMPLE_ATTENTION_AREAS: DiagnosticAttentionArea[] = [
  {
    id: 'att_sample_warning',
    name: 'Sample Warning',
    description: 'This is a sample warning triggered when maturity is low.',
    criticality: 'high',
    relatedDimensions: ['dim_sample_test']
  }
];
