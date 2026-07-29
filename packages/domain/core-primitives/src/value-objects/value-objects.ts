import { InvalidValueObjectError } from '../errors/domain-errors';

export enum Currency {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR'
}

export interface Money {
  readonly amount: number;
  readonly currency: Currency;
}

export class Probability {
  private constructor(readonly value: number) {
    if (typeof value !== 'number' || isNaN(value) || value < 0.0 || value > 1.0) {
      throw new InvalidValueObjectError('Probability', `Value must be between 0.0 and 1.0, received: ${value}`);
    }
  }

  static create(value: number): Probability {
    return new Probability(value);
  }
}

export class Percentage {
  private constructor(readonly value: number) {
    if (typeof value !== 'number' || isNaN(value) || value < 0.0 || value > 100.0) {
      throw new InvalidValueObjectError('Percentage', `Value must be between 0.0 and 100.0, received: ${value}`);
    }
  }

  static create(value: number): Percentage {
    return new Percentage(value);
  }
}

export class Confidence {
  private constructor(readonly probability: Probability) {}

  static create(value: number): Confidence {
    return new Confidence(Probability.create(value));
  }

  get value(): number {
    return this.probability.value;
  }
}

export class Score {
  private constructor(readonly percentage: Percentage) {}

  static create(value: number): Score {
    return new Score(Percentage.create(value));
  }

  get value(): number {
    return this.percentage.value;
  }
}

export interface DurationMonths {
  readonly months: number;
}

export interface FreshnessHours {
  readonly hours: number;
}
