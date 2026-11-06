import { Currency } from '@/types';

// Exchange rate: 1 USD = 86.50 INR (can be updated or fetched dynamically)
export const USD_EXCHANGE_RATE = 86.50;

export function convertPrice(amountInInr: number, targetCurrency: Currency): number {
  if (targetCurrency === 'INR') {
    return amountInInr;
  }
  // Convert INR to USD and round to 2 decimal places or clean cents
  const inUsd = amountInInr / USD_EXCHANGE_RATE;
  return Math.round(inUsd * 100) / 100;
}

export function formatPrice(amountInInr: number, currency: Currency): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amountInInr);
  }

  const usdAmount = convertPrice(amountInInr, 'USD');
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
}

export function getCurrencySymbol(currency: Currency): string {
  return currency === 'INR' ? '₹' : '$';
}
