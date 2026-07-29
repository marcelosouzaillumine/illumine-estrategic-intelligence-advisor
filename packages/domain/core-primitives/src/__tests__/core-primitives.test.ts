import { describe, it, expect } from 'vitest';
import { Probability, Percentage, Confidence, Score, InvalidValueObjectError, Currency } from '../index';

describe('@illumine/core-primitives Value Objects', () => {
  it('should create valid Probability between 0.0 and 1.0', () => {
    const prob = Probability.create(0.85);
    expect(prob.value).toBe(0.85);
  });

  it('should throw InvalidValueObjectError for Probability out of bounds', () => {
    expect(() => Probability.create(1.5)).toThrow(InvalidValueObjectError);
    expect(() => Probability.create(-0.1)).toThrow(InvalidValueObjectError);
  });

  it('should create valid Percentage between 0.0 and 100.0', () => {
    const pct = Percentage.create(95.5);
    expect(pct.value).toBe(95.5);
  });

  it('should throw InvalidValueObjectError for Percentage out of bounds', () => {
    expect(() => Percentage.create(105)).toThrow(InvalidValueObjectError);
  });

  it('should construct Confidence and Score correctly', () => {
    const conf = Confidence.create(0.99);
    expect(conf.value).toBe(0.99);

    const sc = Score.create(98);
    expect(sc.value).toBe(98);
  });

  it('should support Currency enum', () => {
    expect(Currency.BRL).toBe('BRL');
    expect(Currency.USD).toBe('USD');
    expect(Currency.EUR).toBe('EUR');
  });
});
