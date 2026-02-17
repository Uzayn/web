interface CurrencyConfig {
  symbol: string;
  monthly: number;
  yearly: number;
  code: string;
}

const currencyMap: Record<string, CurrencyConfig> = {
  NG: { symbol: "₦", monthly: 15000, yearly: 144000, code: "NGN" },
  US: { symbol: "$", monthly: 10, yearly: 96, code: "USD" },
  GB: { symbol: "£", monthly: 8, yearly: 77, code: "GBP" },
  GH: { symbol: "GH₵", monthly: 160, yearly: 1536, code: "GHS" },
  KE: { symbol: "KSh", monthly: 1300, yearly: 12480, code: "KES" },
  // EU countries
  DE: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  FR: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  ES: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  IT: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  NL: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  PT: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  BE: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  AT: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  IE: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
  FI: { symbol: "€", monthly: 9, yearly: 86, code: "EUR" },
};

const defaultCurrency: CurrencyConfig = {
  symbol: "$",
  monthly: 10,
  yearly: 96,
  code: "USD",
};

export function getCurrencyForCountry(countryCode: string): CurrencyConfig {
  return currencyMap[countryCode] || defaultCurrency;
}

export function formatPrice(amount: number, symbol: string): string {
  const formatted = amount.toLocaleString("en-US");
  return `${symbol}${formatted}`;
}

export function getSavingsText(currency: CurrencyConfig): string {
  const annualIfMonthly = currency.monthly * 12;
  const savings = annualIfMonthly - currency.yearly;
  return `Save ${formatPrice(savings, currency.symbol)}/year`;
}

export async function detectCountry(): Promise<string> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return "US";
    const data = await res.json();
    return data.country_code || "US";
  } catch {
    return "US";
  }
}
