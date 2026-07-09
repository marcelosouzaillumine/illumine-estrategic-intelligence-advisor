import { InstitutionalDigitalTwin } from '../../types/digital-twin/InstitutionalDigitalTwin';
import { AssembledTwinDomain } from '../../core/digital-twin/TwinAssemblyEngine';
import { TwinRelationship } from '../../types/digital-twin/TwinRelationship';

export interface UIDigitalTwin {
  id: string;
  name: string;
  updatedAt: string;
}

export interface UITwinDomain {
  id: string;
  type: string;
  name: string;
  description: string;
  status: string;
  confidence: string;
  hasTimeline: boolean;
  hasGraphNode: boolean;
  metrics: Array<{ label: string; value: string | number }>;
  historicalSnapshotsCount: number;
}

export interface UITwinRelationship {
  id: string;
  sourceName: string;
  targetName: string;
  type: string;
}

export interface UIMapNode {
  id: string;
  name: string;
  type: string;
  children?: UIMapNode[];
}

export class InstitutionalDigitalTwinViewModel {
  // Dummy Fiduciary Contract
  public static state = {};
  public static computed = {};
  public static actions = {};

  static adaptTwin(twin: InstitutionalDigitalTwin | null): UIDigitalTwin | null {
    if (!twin) return null;
    return {
      id: twin.objectId,
      name: twin.title,
      updatedAt: new Date(twin.updatedAt).toLocaleDateString('pt-BR')
    };
  }

  static adaptDomains(domains: AssembledTwinDomain[]): UITwinDomain[] {
    return domains.map(d => ({
      id: d.objectId,
      type: d.domainType,
      name: d.title,
      description: d.description || 'Domínio sem descrição fornecida.',
      status: d.officialStateRefs?.latestStatus || 'N/A',
      confidence: d.officialStateRefs?.latestConfidence || 'UNVERIFIED',
      hasTimeline: !!d.timelineId,
      hasGraphNode: !!d.graphNodeId,
      metrics: d.officialStateRefs?.recordedMetrics 
        ? Object.entries(d.officialStateRefs.recordedMetrics).map(([k, v]) => ({ label: k, value: v }))
        : [],
      historicalSnapshotsCount: d.historicalSnapshotsCount
    }));
  }

  static adaptRelationships(
    relationships: TwinRelationship[],
    domains: AssembledTwinDomain[]
  ): UITwinRelationship[] {
    const domainMap = new Map(domains.map(d => [d.objectId, d.title]));

    return relationships.map(r => ({
      id: r.relationshipId,
      sourceName: domainMap.get(r.sourceDomainId) || 'Domínio Desconhecido',
      targetName: domainMap.get(r.targetDomainId) || 'Domínio Desconhecido',
      type: r.type.replace('_', ' ')
    }));
  }

  static adaptToMap(twinName: string, domains: AssembledTwinDomain[]): UIMapNode {
    return {
      id: 'root',
      name: twinName,
      type: 'ORGANIZATION',
      children: domains.map(d => ({
        id: `node-${d.objectId}`,
        name: d.title,
        type: d.domainType
      }))
    };
  }
}
