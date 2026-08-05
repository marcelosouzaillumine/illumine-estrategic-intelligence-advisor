import { SystemCapability } from '../domain/authorization/Capabilities';
import { NavigationIntent } from '../navigation/types';
import React from 'react';

export type WorkspaceMaturity = 'prototype' | 'beta' | 'production';

// --- WIDGET DOMAIN ---

export type WidgetCategory = 'metric' | 'insight' | 'recommendation' | 'trend' | 'alert' | 'chart' | 'table' | 'narrative';
export type WidgetInteractionMode = 'readonly' | 'interactive' | 'drilldown';
export type WidgetRefreshPolicy = 'auto' | 'manual' | 'never';

export interface WidgetMetadata {
  description?: string;
  author?: string;
  tags?: string[];
  [key: string]: any;
}

export interface WidgetDefinition {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: WidgetCategory;
  domain?: string;
  version: string;
  supportedOffices: string[];
  supportedCapabilities: SystemCapability[];
  supportedLayouts: string[]; // e.g. ['grid', 'stack']
  requiredDataSources: string[];
  requiredPermissions: string[];
  component: React.ComponentType<any>;
  metadata?: WidgetMetadata;
}

export interface WidgetInstance {
  id: string; // Unique ID for this instance in the layout
  widgetId: string; // Refers to WidgetDefinition.id
  config: Record<string, any>;
  dataBinding: Record<string, string>; // Maps widget prop to data source key
  refreshPolicy: WidgetRefreshPolicy;
  interactionMode: WidgetInteractionMode;
  visibilityRules?: string[]; // Expressions to evaluate visibility
  priority: number; // 0 is highest
  metadata?: WidgetMetadata;
}

export type WidgetLifecycleState = 'registered' | 'configured' | 'bound' | 'loaded' | 'rendered' | 'disposed';

export interface BaseWidgetProps {
  instance: WidgetInstance;
  data: any;
  context: any;
  onAction?: (action: string, payload?: any) => void;
}

// --- LAYOUT DOMAIN ---

export interface LayoutSlot {
  id: string; // e.g. 'top-left', 'hero', 'sidebar'
  area: string; // Grid area name
  width?: string;
  height?: string;
  order: number;
  widgets: WidgetInstance[];
}

export interface WorkspaceLayoutDefinition {
  id: string;
  type: 'grid' | 'stack' | 'canvas';
  slots: LayoutSlot[];
}

// --- SURFACE & WORKSPACE DOMAIN ---

export interface DecisionSurfaceDefinition {
  id: string;
  officeId: string;
  titleKey: string;
  descriptionKey: string;
  intent: NavigationIntent;
  capability: SystemCapability;
  supportedEngines: string[];
  supportedAgents: string[];
  layouts: WorkspaceLayoutDefinition[];
  defaultLayout: string;
  intelligenceContext?: {
    domain: string;
    office: string;
    decisionQuestions: string[];
  };
}

export interface WorkspaceDefinition {
  officeId: string;
  titleKey: string;
  subtitleKey: string;
  iconKey: string;
  defaultSurface: string;
  capabilities: SystemCapability[];
  supportedAgents: string[];
  maturity: WorkspaceMaturity;
  surfaces: DecisionSurfaceDefinition[];
}

// --- DECISION DOMAIN ---

export type DecisionConfidence = 'high' | 'medium' | 'low';
export type DecisionUrgency = 'immediate' | 'short-term' | 'long-term';
export type DecisionPriority = 'critical' | 'high' | 'medium' | 'low';
export type DecisionStatus = 'success' | 'warning' | 'critical' | 'neutral' | 'info';

export interface DecisionContext {
  status: DecisionStatus;
  context: string;
  evidence: string[];
  impact: string;
  confidence: DecisionConfidence;
  urgency: DecisionUrgency;
  priority: DecisionPriority;
  origin: string;
  owner: string;
  recommendation: string;
  action: string;
}

// --- VISUALIZATION DOMAIN ---

export interface VisualizationComponentProps {
  title?: string;
  subtitle?: string;
  legend?: boolean;
  series: any[];
  emptyState?: string;
  loadingState?: string;
  errorState?: string;
  metadata?: WidgetMetadata;
}

// --- PATTERN DOMAIN ---

export interface WorkspacePatternDefinition {
  id: string;
  name: string;
  description: string;
  layout: WorkspaceLayoutDefinition;
}
