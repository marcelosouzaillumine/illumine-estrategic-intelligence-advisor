export class CapabilityNotAvailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CapabilityNotAvailableError';
  }
}
