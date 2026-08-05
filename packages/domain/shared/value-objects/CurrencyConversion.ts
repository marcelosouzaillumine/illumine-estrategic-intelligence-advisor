import { Money } from './Money';

export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  conversionDate: string; // ISO-8601 Date
}

export const CurrencyOps = {
  convert: (source: Money, conversion: CurrencyConversion): Money => {
    if (source.currency !== conversion.fromCurrency) {
      throw new Error(`Invalid conversion: source is ${source.currency} but rate is from ${conversion.fromCurrency}`);
    }
    return {
      amount: Math.round(source.amount * conversion.exchangeRate),
      currency: conversion.toCurrency
    };
  }
};
