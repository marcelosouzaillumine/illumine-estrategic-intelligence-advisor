export class InvalidValueObjectError extends Error {
  constructor(
    public readonly objectName: string,
    message: string
  ) {
    super(`[InvalidValueObjectError] ${objectName}: ${message}`);
    this.name = 'InvalidValueObjectError';
    Object.setPrototypeOf(this, InvalidValueObjectError.prototype);
  }
}

export class DomainValidationError extends Error {
  constructor(
    public readonly domainComponent: string,
    message: string
  ) {
    super(`[DomainValidationError] ${domainComponent}: ${message}`);
    this.name = 'DomainValidationError';
    Object.setPrototypeOf(this, DomainValidationError.prototype);
  }
}
