import { useState, useEffect, useCallback } from 'react';
import { expensesAPI } from '@/services/api';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await expensesAPI.getMy();
      setExpenses(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload) => {
    const { data } = await expensesAPI.create(payload);
    await fetch();
    return data;
  };

  return { expenses, loading, error, refetch: fetch, create };
}

export function useExpenseDetail(id) {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await expensesAPI.getById(id);
        if (!cancelled) setExpense(data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load expense');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { expense, loading, error };
}
