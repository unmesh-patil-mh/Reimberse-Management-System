import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Fetches country → currency data from REST Countries API.
 * Returns a deduplicated list of { code, name, symbol } sorted by code.
 */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem('currencies');
    if (cached) {
      setCurrencies(JSON.parse(cached));
      setLoading(false);
      return;
    }

    axios
      .get('https://restcountries.com/v3.1/all?fields=name,currencies')
      .then(({ data }) => {
        const map = new Map();
        data.forEach((country) => {
          if (!country.currencies) return;
          Object.entries(country.currencies).forEach(([code, info]) => {
            if (!map.has(code)) {
              map.set(code, {
                code,
                name: info.name || code,
                symbol: info.symbol || code,
              });
            }
          });
        });
        const list = Array.from(map.values()).sort((a, b) =>
          a.code.localeCompare(b.code)
        );
        // Prioritize popular currencies at the top
        const priority = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD'];
        const prioritized = priority
          .map((c) => list.find((x) => x.code === c))
          .filter(Boolean);
        const rest = list.filter((x) => !priority.includes(x.code));
        const final = [...prioritized, ...rest];
        sessionStorage.setItem('currencies', JSON.stringify(final));
        setCurrencies(final);
      })
      .catch(() => {
        // Fallback
        setCurrencies([
          { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' },
          { code: 'GBP', name: 'British Pound', symbol: '£' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { currencies, loading };
}

/**
 * Fetches exchange rates for a base currency.
 * Uses exchangerate-api.com free tier.
 */
export function useExchangeRates(baseCurrency = 'INR') {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!baseCurrency) return;

    const cacheKey = `rates_${baseCurrency}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Cache for 1 hour
      if (Date.now() - parsed.ts < 3600000) {
        setRates(parsed.rates);
        setLoading(false);
        return;
      }
    }

    axios
      .get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      .then(({ data }) => {
        setRates(data.rates);
        sessionStorage.setItem(cacheKey, JSON.stringify({ rates: data.rates, ts: Date.now() }));
      })
      .catch(() => setRates(null))
      .finally(() => setLoading(false));
  }, [baseCurrency]);

  const convert = useCallback(
    (amount, fromCurrency, toCurrency = baseCurrency) => {
      if (!rates || fromCurrency === toCurrency) return amount;
      // rates are relative to baseCurrency
      const fromRate = rates[fromCurrency];
      const toRate = rates[toCurrency];
      if (!fromRate || !toRate) return amount;
      return (amount / fromRate) * toRate;
    },
    [rates, baseCurrency]
  );

  return { rates, loading, convert };
}
