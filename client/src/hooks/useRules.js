import { useState, useEffect, useCallback } from 'react';
import { rulesAPI } from '@/services/api';

export function useRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await rulesAPI.getAll();
      setRules(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload) => {
    const { data } = await rulesAPI.create(payload);
    await fetch();
    return data;
  };

  return { rules, loading, error, refetch: fetch, create };
}
