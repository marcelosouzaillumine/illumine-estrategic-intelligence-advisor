import React from 'react';

export interface LifecycleStageDefinition {
  id: string;
  order: number;
  titleKey: string;
  descriptionKey: string;
  icon?: string;
  color?: string;
  office?: string;
  capability?: string;
  requiredRole?: string;
  featureFlag?: string;
  workspaceResolver: string;
  enterCommand?: string;
  exitCommand?: string;
  guard?: string;
  navigation?: boolean;
}

export interface WorkspaceDefinition {
  id: string;
  component: React.LazyExoticComponent<any> | React.FC<any>;
}
