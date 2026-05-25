import { EntityProvenance } from './consolidated-types';

export function buildLineageTree(
  metricOrigin: string,
  entityValues: { entityId: string; originalValue: number; eliminatedValue: number }[]
): EntityProvenance[] {
  
  return entityValues.map(ev => ({
    sourceEntityId: ev.entityId,
    metricOrigin,
    originalValue: ev.originalValue,
    eliminatedValue: ev.eliminatedValue,
    consolidatedValue: ev.originalValue - ev.eliminatedValue
  }));
}
