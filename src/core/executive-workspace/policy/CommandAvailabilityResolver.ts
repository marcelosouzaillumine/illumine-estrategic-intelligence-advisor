export type CommandAvailabilityStatus = 'AVAILABLE' | 'HIDDEN' | 'LOCKED';

export interface CommandAvailability {
  commandId: string;
  status: CommandAvailabilityStatus;
  reason?: string; // Reason for being locked (e.g., 'Necessário Proposal Approved')
}

export interface CommandContext {
  stageId: string;
  userRoles: string[];
  capabilities: string[];
  [key: string]: any;
}

export type CommandRule = (context: CommandContext) => CommandAvailability;

class CommandAvailabilityResolverImpl {
  private rules = new Map<string, CommandRule[]>();

  registerRule(commandId: string, rule: CommandRule) {
    if (!this.rules.has(commandId)) {
      this.rules.set(commandId, []);
    }
    this.rules.get(commandId)!.push(rule);
  }

  resolve(commandId: string, context: CommandContext): CommandAvailability {
    const rules = this.rules.get(commandId);
    if (!rules || rules.length === 0) {
      return { commandId, status: 'AVAILABLE' }; // Default if no rules
    }

    // Evaluate rules. If any rule locks or hides, that takes precedence.
    let currentStatus: CommandAvailability = { commandId, status: 'AVAILABLE' };
    
    for (const rule of rules) {
      const result = rule(context);
      if (result.status === 'HIDDEN') return result; // HIDDEN is most restrictive
      if (result.status === 'LOCKED' && currentStatus.status !== 'HIDDEN') {
        currentStatus = result;
      }
    }

    return currentStatus;
  }
}

export const CommandAvailabilityResolver = new CommandAvailabilityResolverImpl();
