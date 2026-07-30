import { ExecutiveContextEnvelope } from '@illumine/executive-contracts';

export class ExecutiveContextValidator {
  public static validateEnvelope(context: ExecutiveContextEnvelope): ExecutiveContextEnvelope {
    const isValid = Boolean(
      context.companyId &&
      context.activeDomain &&
      context.strategicObjectives.length > 0 &&
      context.wisdomReferenceIds.length > 0
    );

    return {
      ...context,
      isValidated: isValid
    };
  }
}
