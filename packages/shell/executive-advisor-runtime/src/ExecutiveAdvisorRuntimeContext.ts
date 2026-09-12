import { ExecutiveIdentityContext } from '../../executive-identity-context/src/ExecutiveIdentityContext';

export type IntelligenceDomain = 'FINANCE' | 'GOVERNANCE' | 'HR' | 'SALES' | 'INSTITUTIONAL';

export interface ExecutiveOrganizationContext {
  readonly tenantId: string;
  readonly companyName: string;
  readonly industry: string;
}

export interface ExecutivePageContext {
  readonly route: string;
  readonly domain: IntelligenceDomain;
  readonly capability: string;
  readonly purpose: string;
}

export interface ExecutiveObjectiveContext {
  readonly currentDecision?: string;
  readonly priority?: string;
}

export interface DecisionMemory {
  readonly id: string;
  readonly description: string;
  readonly date: string;
}

export interface IssueMemory {
  readonly id: string;
  readonly description: string;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ExecutiveMemoryContext {
  readonly previousDecisions: DecisionMemory[];
  readonly unresolvedIssues: IssueMemory[];
}

/**
 * ExecutiveAdvisorRuntimeContext
 * 
 * Contexto imutável consolidando todas as dimensões de inteligência organizacional 
 * no momento da requisição. Nenhuma camada inferior pode redefinir o contexto de negócio.
 */
export interface ExecutiveAdvisorRuntimeContext {
  readonly identity: ExecutiveIdentityContext;
  readonly organization: ExecutiveOrganizationContext;
  readonly page: ExecutivePageContext;
  readonly objective: ExecutiveObjectiveContext;
  readonly memory: ExecutiveMemoryContext;
  readonly timestamp: string;
  readonly contextVersion: string;
}
